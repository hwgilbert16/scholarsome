import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudySetCardComponent } from './study-set-card.component';

describe('StudySetCardComponent', () => {
  let component: StudySetCardComponent;
  let fixture: ComponentFixture<StudySetCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudySetCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StudySetCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
