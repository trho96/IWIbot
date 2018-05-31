import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulletinboardComponent } from './bulletinboard.component';

describe('BulletinboardComponent', () => {
  let component: BulletinboardComponent;
  let fixture: ComponentFixture<BulletinboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulletinboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulletinboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
