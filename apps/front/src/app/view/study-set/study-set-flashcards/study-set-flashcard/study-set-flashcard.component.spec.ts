import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudySetFlashcardComponent } from './study-set-flashcard.component';

describe('StudySetFlashcardComponent', () => {
  let component: StudySetFlashcardComponent;
  let fixture: ComponentFixture<StudySetFlashcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudySetFlashcardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StudySetFlashcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
