/**
 * Hastivo — Translation Service Interface
 * Prepares clean service interfaces for Text-to-Sign and Sign-to-Text.
 * Enforces strict data integrity: no simulated translations or fake confidence scores.
 */
import config from '../config/env';

export const translationService = {
  isConfigured() {
    return config.isConfigured.api;
  },

  async translateTextToSign(text, dialect = 'standard') {
    if (!text || !text.trim()) {
      throw new Error('Please enter text to translate.');
    }
    if (!this.isConfigured()) {
      throw new Error(
        'Translation service is not configured. Backend API URL is not set in environment.'
      );
    }
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/v1/translate/text-to-sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim(), dialect }),
      });
      if (!response.ok) {
        throw new Error(`Translation API error: HTTP ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (err) {
      throw new Error(err.message || 'Failed to connect to sign translation service.');
    }
  },

  async recognizeSignLandmarks(landmarks) {
    if (!this.isConfigured()) {
      throw new Error('Sign recognition service is not configured.');
    }
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/v1/recognize/landmarks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ landmarks }),
      });
      if (!response.ok) {
        throw new Error(`Recognition API error: HTTP ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      throw new Error(err.message || 'Recognition service request failed.');
    }
  },

  async translateSignToText(signs) {
    if (!signs || !signs.length) {
      return { sentence: '', synthesizedSentence: '', confidence: 0 };
    }
    if (!this.isConfigured()) {
      throw new Error('Sign recognition service is not configured.');
    }
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/v1/translation/sign-to-text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signs }),
      });
      if (!response.ok) {
        throw new Error(`Sign-to-Text API error: HTTP ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      throw new Error(err.message || 'Failed to synthesize sign gloss sequence.');
    }
  },
};
