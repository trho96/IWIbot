import { TestBed, inject } from '@angular/core/testing';

import { NewsbulletinboardService } from './newsbulletinboard.service';

describe('NewsbulletinboardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewsbulletinboardService]
    });
  });

  it('should be created', inject([NewsbulletinboardService], (service: NewsbulletinboardService) => {
    expect(service).toBeTruthy();
  }));
});
