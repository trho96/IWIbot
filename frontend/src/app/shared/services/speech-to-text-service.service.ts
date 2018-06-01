import { Injectable } from '@angular/core';
import { SpeechNotification } from '../models/speech-notification';
import { SpeechError } from '../models/speech-error';
import { Observable } from 'rxjs';

export interface IWindow extends Window {
  webkitSpeechRecognition: any;
}

@Injectable()
export class SpeechToTextService {

  private recognition: any;
  private ignoreOnEnd: boolean;

  constructor() {
    const { webkitSpeechRecognition } = (window as any);
    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'de-DE';
  }

  /**
   * Set the language that should get recognized.
   * @param {string} language   the language to be recognized
   * @returns void
   */
  setLanguage(language: string) {
    this.recognition.lang = language;
  }
  /**
   * Starts the speech recognition.
   * @returns void
   */
  start() {
    this.recognition.start();
  }

  onStart(): Observable<SpeechNotification> {
    return new Observable(observer => {
      this.recognition.onstart = () => {
        observer.next({
          info: 'info_speak_now'
        });
      };
    });
  }

  onEnd(): Observable<SpeechNotification> {
    return new Observable(observer => {
      this.recognition.onend = () => {
        if (this.ignoreOnEnd) {
          return;
        }
        observer.next({
          info: 'info_start'
        });
      };
    });
  }

  onSpeechEnd(): Observable<SpeechNotification> {
    return new Observable(observer => {
      this.recognition.onspeechend = () => {
        if (this.ignoreOnEnd) {
          return;
        }
        observer.next({
          info: 'speech_end'
        });
      };
    });
  }

  onResult(): Observable<SpeechNotification> {
    return new Observable(observer => {
      this.recognition.onresult = (event) => {
        let interimTranscript = '',
          finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        observer.next({
          info: 'final_transcript',
          content: this.capitalizeFirstLetter(finalTranscript)
        });
        observer.next({
          info: 'interim_transcript',
          content: interimTranscript
        });
      };
    });
  }

  onError(): Observable<SpeechNotification> {
    return new Observable(observer => {
      this.recognition.onerror = (event) => {
        let result: SpeechError;
        if (event.error === 'no-speech') {
          result = SpeechError.NO_SPEECH;
          this.ignoreOnEnd = true;
        }
        if (event.error === 'audio-capture') {
          result = SpeechError.NO_MICROPHONE;
          this.ignoreOnEnd = true;
        }
        if (event.error === 'not-allowed') {
          result = SpeechError.NOT_ALLOWED;
          this.ignoreOnEnd = true;
        }
        observer.next({
          error: result
        });
      };
    });
  }

  /**
   * Stops the speech recognition
   * @returns void
   */
  stop() {
    this.recognition.stop();
  }

  /**
   * Capitalize first letter of a string
   * @param {string} message
   * @returns {string}
   */
  private capitalizeFirstLetter(message: string): string {
    return message.charAt(0).toUpperCase() + message.slice(1);
  }
}
