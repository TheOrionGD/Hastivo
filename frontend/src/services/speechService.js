/**
 * Hastivo — Speech Recognition Service Adapter
 * Real speech recognition via Web Speech API or supported platform runtime.
 * Never fabricates speech transcripts or simulates listening.
 */

export const SpeechServiceStatus = {
  IDLE: 'IDLE',
  CHECKING: 'CHECKING',
  READY: 'READY',
  REQUESTING_PERMISSION: 'REQUESTING_PERMISSION',
  LISTENING: 'LISTENING',
  PROCESSING: 'PROCESSING',
  ERROR: 'ERROR',
  UNSUPPORTED: 'UNSUPPORTED',
};

class SpeechService {
  constructor() {
    this.recognition = null;
    this.status = SpeechServiceStatus.IDLE;
    this.onTranscriptCallback = null;
    this.onErrorCallback = null;
    this.onStatusChangeCallback = null;
    this.activeStream = null;

    this.isSupported =
      typeof window !== 'undefined' &&
      !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  setStatus(newStatus, detail = null) {
    this.status = newStatus;
    if (this.onStatusChangeCallback) {
      this.onStatusChangeCallback(newStatus, detail);
    }
  }

  isSpeechSupported() {
    return this.isSupported;
  }

  async checkMicrophonePermission() {
    if (!navigator?.mediaDevices?.getUserMedia) {
      return { supported: false, error: 'Media devices API unavailable in this browser environment.' };
    }
    try {
      if (navigator.permissions && navigator.permissions.query) {
        const result = await navigator.permissions.query({ name: 'microphone' });
        return { supported: true, state: result.state }; // 'granted' | 'prompt' | 'denied'
      }
      return { supported: true, state: 'prompt' };
    } catch {
      return { supported: true, state: 'prompt' };
    }
  }

  async startListening({ onTranscript, onError, onStatusChange }) {
    this.onTranscriptCallback = onTranscript;
    this.onErrorCallback = onError;
    this.onStatusChangeCallback = onStatusChange;

    if (!this.isSupported) {
      const err = 'Speech recognition is not supported in this browser or desktop runtime.';
      this.setStatus(SpeechServiceStatus.UNSUPPORTED, err);
      if (this.onErrorCallback) this.onErrorCallback(err);
      return;
    }

    try {
      this.setStatus(SpeechServiceStatus.REQUESTING_PERMISSION);

      // Verify actual microphone permission via getUserMedia
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.activeStream = stream;

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.setStatus(SpeechServiceStatus.LISTENING);
      };

      this.recognition.onresult = (event) => {
        let transcript = '';
        let isFinal = false;
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            isFinal = true;
          }
        }
        if (this.onTranscriptCallback) {
          this.onTranscriptCallback({ transcript, isFinal });
        }
      };

      this.recognition.onerror = (event) => {
        let errorMsg = 'Speech recognition error: ' + event.error;
        if (event.error === 'not-allowed') {
          errorMsg = 'Microphone permission denied by user or system.';
        } else if (event.error === 'no-speech') {
          errorMsg = 'No speech detected. Please try speaking again.';
        } else if (event.error === 'network') {
          errorMsg = 'Speech service network connection failure.';
        }
        this.setStatus(SpeechServiceStatus.ERROR, errorMsg);
        if (this.onErrorCallback) this.onErrorCallback(errorMsg);
        this.stopListening();
      };

      this.recognition.onend = () => {
        if (this.status === SpeechServiceStatus.LISTENING) {
          this.setStatus(SpeechServiceStatus.IDLE);
        }
        this.cleanupMicrophone();
      };

      this.recognition.start();
    } catch (err) {
      let message = 'Failed to access microphone.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        message = 'Microphone permission denied. Please allow microphone access.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        message = 'No microphone device was detected on your system.';
      } else {
        message = err.message || message;
      }
      this.setStatus(SpeechServiceStatus.ERROR, message);
      if (this.onErrorCallback) this.onErrorCallback(message);
      this.cleanupMicrophone();
    }
  }

  stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // Ignored
      }
      this.recognition = null;
    }
    this.cleanupMicrophone();
    this.setStatus(SpeechServiceStatus.IDLE);
  }

  cleanupMicrophone() {
    if (this.activeStream) {
      this.activeStream.getTracks().forEach((track) => track.stop());
      this.activeStream = null;
    }
  }
}

export const speechService = new SpeechService();
