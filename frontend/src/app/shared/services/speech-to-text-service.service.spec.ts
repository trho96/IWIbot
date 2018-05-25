import { TestBed, inject } from '@angular/core/testing';

import { SpeechToTextService } from './speech-to-text-service.service';

describe('SpeechToTextServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpeechToTextService]
    });
  });

  it('should be created', inject([SpeechToTextService], (service: SpeechToTextService) => {
    expect(service).toBeTruthy();
  }));
});
