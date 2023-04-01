import { ComponentFixture, TestBed } from "@angular/core/testing";

import { StudySetFlashcardsComponent } from "./study-set-flashcards.component";

describe("StudySetFlashcardsComponent", () => {
  let component: StudySetFlashcardsComponent;
  let fixture: ComponentFixture<StudySetFlashcardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudySetFlashcardsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StudySetFlashcardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
