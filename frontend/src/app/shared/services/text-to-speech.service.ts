import { Injectable } from '@angular/core';

@Injectable()
export class TextToSpeechService {

  private message: SpeechSynthesisUtterance;
  private germanVoice: SpeechSynthesisVoice;
  private englishVoice: SpeechSynthesisVoice;

  constructor() {
    this.initVoices();
    this.initSpeechSynthesis();
    speechSynthesis.onvoiceschanged = () => {
      this.initVoices();
    }
  }

  /**
   * Initializes the speech synthesis
   * @returns void
   */
  private initSpeechSynthesis(): void {
    this.message = new SpeechSynthesisUtterance();
    //Cancel speech synthesis when the page gets reloaded
    window.onunload = () => {
      speechSynthesis.cancel();
    };
  }

  /**
   * Starts the speech synthesis
   * @param {string} message      the message that gets spoken
   * @param {string} language     the language in which the message is spoken
   */
  public speak(message: string, language = 'de-DE'): void {
    this.message.text = message;
    this.message.lang = language;
    this.message.voice = this.getVoice(language);
    speechSynthesis.speak(this.message);
  }

  /**
   * Returns for a given language a voice in which later the message gets spoken.
   * @param {string} language             language of the voice e.g de-DE, en-US
   * @returns {SpeechSynthesisVoice}
   */
  private getVoice(language: string): SpeechSynthesisVoice {
    switch (language) {
      case 'de-DE':
        return this.germanVoice;
      case 'en-US':
        return this.englishVoice;
      default:
        return null;
    }
  }

  /**
   * Initializes the voices for specific languages.
   * @returns void
   */
  private initVoices(): void {
    const voices = speechSynthesis.getVoices();
    for (let voice of voices) {
      if (voice.name === 'Google Deutsch') {
        this.germanVoice = voice;
      }
      if (voice.name === 'Google US English') {
        this.englishVoice = voice;
      }
    }
  }

  /**
   * Stops speech synthesis
   * @returns void
   */
  public stopSpeech(): void {
    speechSynthesis.cancel();
  }
}
