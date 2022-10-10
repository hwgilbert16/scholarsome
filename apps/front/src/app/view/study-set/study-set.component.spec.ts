import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudySetComponent } from './study-set.component';

describe('StudySetComponent', () => {
  let component: StudySetComponent;
  let fixture: ComponentFixture<StudySetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudySetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StudySetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
