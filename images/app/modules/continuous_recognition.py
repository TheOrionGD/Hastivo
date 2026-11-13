"""
Hastivo — Continuous Sign Language Recognition PyTorch Engine
Implements a Bidirectional LSTM (BiLSTM) sequence architecture with CTC / temporal classification
for word-level, phrase-level, and continuous sign recognition over landmark sequences.
"""
import os
import json
from pathlib import Path
from typing import List, Dict, Any, Optional, Tuple
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F

# Vocabulary mapping for continuous word & gesture recognition
CONTINUOUS_VOCAB = [
    "<PAD>",        # 0
    "<BLANK>",      # 1 (CTC blank token)
    "HELLO",        # 2
    "NAMASTE",      # 3
    "WATER",        # 4
    "HELP",         # 5
    "YES",          # 6
    "NO",           # 7
    "PLEASE",       # 8
    "THANK_YOU",    # 9
    "WANT",         # 10
    "EMERGENCY",    # 11
    "DOCTOR",       # 12
    "HOSPITAL",     # 13
    "FOOD",         # 14
    "TRAIN",        # 15
    "BUS",          # 16
    "STATION",      # 17
    "WHERE",        # 18
    "WHAT",         # 19
    "TIME",         # 20
    "TODAY",        # 21
    "UNDERSTAND",   # 22
    "ME",           # 23
    "YOU",          # 24
    "NAME",         # 25
    "LEARN",        # 26
    "SIGN",         # 27
    "LANGUAGE",     # 28
    "GOOD",         # 29
    "MORNING",      # 30
    "WELCOME",      # 31
    "FRIEND",       # 32
    "HOW",          # 33
    "FINE",         # 34
]

VOCAB_TO_IDX = {v: idx for idx, v in enumerate(CONTINUOUS_VOCAB)}
IDX_TO_VOCAB = {idx: v for idx, v in enumerate(CONTINUOUS_VOCAB)}

class BiLSTMSignSequenceModel(nn.Module):
    """
    Bidirectional LSTM with self-attention projection for sign feature sequences.
    Input dimension: 126 (2 hands * 21 keypoints * 3 coordinates [x, y, z])
    """
    def __init__(self, input_dim: int = 126, hidden_dim: int = 128, num_layers: int = 2, num_classes: int = len(CONTINUOUS_VOCAB)):
        super().__init__()
        self.input_dim = input_dim
        self.hidden_dim = hidden_dim
        self.num_layers = num_layers
        self.num_classes = num_classes

        # Spatial feature projection
        self.fc_in = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.LayerNorm(hidden_dim),
            nn.ReLU(),
            nn.Dropout(0.15)
        )

        # Temporal sequence modeling
        self.bilstm = nn.LSTM(
            input_size=hidden_dim,
            hidden_size=hidden_dim,
            num_layers=num_layers,
            batch_first=True,
            bidirectional=True,
            dropout=0.2 if num_layers > 1 else 0.0
        )

        # Output projection to class logits
        self.classifier = nn.Sequential(
            nn.Linear(hidden_dim * 2, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, num_classes)
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        x: [batch_size, seq_len, input_dim]
        returns: [batch_size, seq_len, num_classes] (logits for CTC or sequence pooling)
        """
        features = self.fc_in(x)
        lstm_out, _ = self.bilstm(features)
        logits = self.classifier(lstm_out)
        return logits


class ContinuousSignRecognizer:
    """
    Continuous Sign Recognition Manager with Temporal Sliding Window,
    Dynamic Pause Detection, and Sub-sequence Token Consolidation.
    """
    def __init__(self, window_size: int = 30, stride: int = 10, confidence_threshold: float = 0.70):
        self.window_size = window_size
        self.stride = stride
        self.confidence_threshold = confidence_threshold
        self.buffer: List[np.ndarray] = []
        self.model = BiLSTMSignSequenceModel()
        self.model.eval()

        # Model weights path
        weights_path = Path(__file__).resolve().parent.parent / "models" / "continuous_bilstm.pt"
        if weights_path.exists():
            try:
                state_dict = torch.load(weights_path, map_location="cpu")
                self.model.load_state_dict(state_dict)
                print(f"[+] Loaded trained continuous sign weights from {weights_path}")
            except Exception as e:
                print(f"[!] Warning: Could not load trained weights: {e}")

    @staticmethod
    def extract_frame_feature(hands: List[Dict[str, Any]]) -> np.ndarray:
        """
        Extracts 126-dimensional landmark feature vector from frame hand detections.
        [Left Hand 21*3, Right Hand 21*3]. If a hand is missing, zero-padded.
        """
        feat = np.zeros(126, dtype=np.float32)
        for h in hands:
            handedness = h.get("handedness", "Right")
            lms = h.get("landmarks", [])
            offset = 0 if handedness.lower() == "left" else 63
            for i, pt in enumerate(lms[:21]):
                idx = offset + (i * 3)
                feat[idx] = float(pt.get("x", 0.0))
                feat[idx + 1] = float(pt.get("y", 0.0))
                feat[idx + 2] = float(pt.get("z", 0.0))
        return feat

    def add_frame(self, frame_features: np.ndarray) -> Optional[Dict[str, Any]]:
        """
        Appends frame feature vector to temporal buffer.
        When window is reached, runs inference and checks for continuous sign transition.
        """
        self.buffer.append(frame_features)
        if len(self.buffer) < self.window_size:
            return None

        # Take sliding window
        window_arr = np.array(self.buffer[-self.window_size:], dtype=np.float32)
        # Compute hand motion kinetic energy to detect pauses
        motion_energy = float(np.mean(np.std(window_arr, axis=0)))

        # Infer with model
        with torch.no_grad():
            x_tensor = torch.from_numpy(window_arr).unsqueeze(0) # [1, 30, 126]
            logits = self.model(x_tensor) # [1, 30, num_classes]
            probs = F.softmax(logits, dim=-1)[0] # [30, num_classes]
            
            # Mean sequence pooling across time window
            mean_probs = torch.mean(probs, dim=0)
            best_idx = int(torch.argmax(mean_probs))
            best_conf = float(mean_probs[best_idx])
            best_label = IDX_TO_VOCAB.get(best_idx, "UNKNOWN")

        # Slide buffer
        if len(self.buffer) >= self.window_size + self.stride:
            self.buffer = self.buffer[self.stride:]

        if best_idx > 1 and best_conf >= self.confidence_threshold:
            return {
                "detected": True,
                "label": best_label,
                "confidence": round(best_conf, 3),
                "motionEnergy": round(motion_energy, 4),
                "isPause": motion_energy < 0.015,
                "windowFrames": self.window_size
            }

        return {
            "detected": False,
            "motionEnergy": round(motion_energy, 4),
            "isPause": motion_energy < 0.015,
            "windowFrames": self.window_size
        }

    def process_continuous_sequence(self, sequence_features: List[List[float]]) -> List[Dict[str, Any]]:
        """
        Evaluates a complete recorded gesture sequence (multi-frame) and yields
        ordered recognized signs with timestamps, eliminating duplicate frame predictions.
        """
        if not sequence_features or len(sequence_features) < 10:
            return []

        seq_arr = np.array(sequence_features, dtype=np.float32)
        total_frames = len(seq_arr)
        recognized_tokens = []

        step = max(5, self.window_size // 3)
        for start_idx in range(0, total_frames - 10, step):
            end_idx = min(start_idx + self.window_size, total_frames)
            window = seq_arr[start_idx:end_idx]
            if len(window) < 10:
                continue

            # Zero-pad if window is smaller than window_size
            if len(window) < self.window_size:
                pad = np.zeros((self.window_size - len(window), window.shape[1]), dtype=np.float32)
                window = np.vstack([window, pad])

            with torch.no_grad():
                x_tensor = torch.from_numpy(window).unsqueeze(0)
                logits = self.model(x_tensor)
                probs = F.softmax(logits, dim=-1)[0]
                mean_probs = torch.mean(probs, dim=0)
                best_idx = int(torch.argmax(mean_probs))
                best_conf = float(mean_probs[best_idx])
                label = IDX_TO_VOCAB.get(best_idx, "")

            if best_idx > 1 and best_conf >= self.confidence_threshold:
                # Deduplicate consecutive tokens
                if not recognized_tokens or recognized_tokens[-1]["label"] != label:
                    recognized_tokens.append({
                        "label": label,
                        "confidence": round(best_conf, 3),
                        "startFrame": start_idx,
                        "endFrame": end_idx,
                    })

        return recognized_tokens

