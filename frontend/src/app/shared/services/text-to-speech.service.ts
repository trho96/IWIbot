import {Injectable} from '@angular/core';

@Injectable()
export class TextToSpeechService {

  private message: SpeechSynthesisUtterance;
  private germanVoice: SpeechSynthesisVoice;
  private enghlishVoice: SpeechSynthesisVoice;

  constructor() {
    this.initVoices();
    this.initSpeechSynthesis();
    speechSynthesis.onvoiceschanged = () => {
      this.initVoices();
    }
  }

  private initSpeechSynthesis(): void {
    this.message = new SpeechSynthesisUtterance();
    this.message.lang = 'de-DE';
    this.selectVoice(this.message.lang);
    window.onunload = () => {
      speechSynthesis.cancel();
    };
  }

  public speak(message: string, language = 'de-DE'): void {
    this.message.text = message;
    this.message.lang = language;
    this.message.voice = this.selectVoice(language);
    speechSynthesis.speak(this.message);
  }

  private selectVoice(language: string): SpeechSynthesisVoice {
    switch (language) {
      case 'de-DE':
        return this.germanVoice;
      case 'en-US':
        return this.enghlishVoice;
      default:
        return null;
    }
  }

  private initVoices(): void {
    const voices = speechSynthesis.getVoices();
    for (let voice of voices) {
      if (voice.name === 'Google Deutsch') {
        this.germanVoice = voice;
      }
      if (voice.name === 'Google US English') {
        this.enghlishVoice = voice;
      }
    }
  }

  public stopSpeech(): void {
    speechSynthesis.cancel();
  }
}
