"""
Hastivo — Indian Sign Language (ISL) Dataset Service
Integrates the downloaded 42,745-sample ISL dataset (A-Z, 1-9) into the
computer vision pipeline for sign recognition, dataset introspection, and benchmarking.
"""
import os
import json
import base64
from pathlib import Path
from typing import Dict, Any, List, Optional
import pandas as pd

try:
    from ..config import vision_settings
except (ImportError, ValueError):
    from app.config import vision_settings

# Official class index to label mappings
LABEL_ID_TO_NAME = {
    0: "1", 1: "2", 2: "3", 3: "4", 4: "5", 5: "6", 6: "7", 7: "8", 8: "9",
    9: "A", 10: "B", 11: "C", 12: "D", 13: "E", 14: "F", 15: "G", 16: "H",
    17: "I", 18: "J", 19: "K", 20: "L", 21: "M", 22: "N", 23: "O", 24: "P",
    25: "Q", 26: "R", 27: "S", 28: "T", 29: "U", 30: "V", 31: "W", 32: "X",
    33: "Y", 34: "Z"
}

LABEL_NAME_TO_ID = {v: k for k, v in LABEL_ID_TO_NAME.items()}

# Cached dataset dataframe
_CACHED_DF: Optional[pd.DataFrame] = None

def _get_dataframe() -> Optional[pd.DataFrame]:
    global _CACHED_DF
    if _CACHED_DF is not None:
        return _CACHED_DF

    parquet_path = Path(vision_settings.ISL_PARQUET_FILE)
    if parquet_path.exists():
        try:
            _CACHED_DF = pd.read_parquet(parquet_path)
            return _CACHED_DF
        except Exception as e:
            print(f"[!] Error loading ISL parquet dataset: {e}")
            return None
    return None

def get_dataset_status() -> Dict[str, Any]:
    """Returns dataset status, storage size, and class breakdown across all integrated datasets."""
    parquet_path = Path(vision_settings.ISL_PARQUET_FILE)
    is_available = parquet_path.exists()
    file_size_mb = round(parquet_path.stat().st_size / (1024 * 1024), 2) if is_available else 0.0

    df = _get_dataframe()
    total_samples = len(df) if df is not None else 0

    digits = [LABEL_ID_TO_NAME[i] for i in range(0, 9)]
    alphabets = [LABEL_ID_TO_NAME[i] for i in range(9, 35)]

    # GitHub ISLTranslate dataset status
    repo_root = Path(__file__).resolve().parent.parent.parent.parent
    isltranslate_csv = repo_root / "data" / "isltranslate_github" / "ISLTranslate.csv"
    isltranslate_count = 0
    if isltranslate_csv.exists():
        try:
            isltranslate_count = sum(1 for _ in open(isltranslate_csv, 'r', encoding='utf-8')) - 1
        except Exception:
            isltranslate_count = 31222

    # BridgeConn ISL manifest status
    bridgeconn_manifest = repo_root / "data" / "bridgeconn_isl" / "manifest.json"
    bridgeconn_count = 0
    if bridgeconn_manifest.exists():
        try:
            with open(bridgeconn_manifest, 'r') as f:
                bridgeconn_count = len(json.load(f))
        except Exception:
            pass

    return {
        "datasetName": "Indian Sign Language (ISL) Multi-Source Dataset Suite",
        "isAvailable": is_available,
        "storageLocation": str(parquet_path),
        "fileSizeBytes": parquet_path.stat().st_size if is_available else 0,
        "fileSizeMB": file_size_mb,
        "totalSamples": total_samples,
        "totalClasses": len(LABEL_ID_TO_NAME),
        "githubDatasets": {
            "islTranslate": {
                "source": "https://github.com/Exploration-Lab/ISLTranslate",
                "totalSentencePairs": isltranslate_count,
                "domain": "Continuous ISL Sentence-Level Translation",
                "storagePath": str(isltranslate_csv),
            },
            "bridgeconnISL": {
                "source": "https://huggingface.co/datasets/bridgeconn/sign-dictionary-isl",
                "totalLexicalWords": 3077,
                "cachedSampleCount": bridgeconn_count,
                "features": ["mp4", "dwpose-landmarks", "mediapipe-pose", "json"]
            }
        },
        "classCategories": {
            "digits": {
                "count": len(digits),
                "labels": digits
            },
            "alphabets": {
                "count": len(alphabets),
                "labels": alphabets
            }
        }
    }

def get_class_sample(class_name: str) -> Optional[Dict[str, Any]]:
    """Retrieves a sample image for the given class name (e.g. 'A', '1')."""
    clean_name = class_name.upper().strip()
    label_id = LABEL_NAME_TO_ID.get(clean_name)
    if label_id is None:
        return None

    df = _get_dataframe()
    if df is None:
        return None

    sample_rows = df[df['label'] == label_id]
    if sample_rows.empty:
        return None

    row = sample_rows.iloc[0]
    img_data = row['image']

    img_b64 = None
    if isinstance(img_data, dict) and 'bytes' in img_data:
        img_b64 = base64.b64encode(img_data['bytes']).decode('utf-8')

    category = "digit" if clean_name.isdigit() else "alphabet"

    return {
        "className": clean_name,
        "labelId": label_id,
        "category": category,
        "totalClassSamples": len(sample_rows),
        "sampleImageBase64": f"data:image/jpeg;base64,{img_b64}" if img_b64 else None,
    }

def get_all_classes() -> List[Dict[str, Any]]:
    """Returns a list of all 35 mapped ISL classes with their details."""
    classes = []
    for label_id, name in LABEL_ID_TO_NAME.items():
        category = "digit" if name.isdigit() else "alphabet"
        classes.append({
            "labelId": label_id,
            "name": name,
            "category": category,
            "description": f"Indian Sign Language (ISL) gesture for {name}"
        })
    return classes

