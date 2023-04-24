import { ComponentFixture, TestBed } from "@angular/core/testing";
import { StudySetQuizQuestionComponent } from "./study-set-quiz-question.component";

describe("StudySetQuizQuestionComponent", () => {
  let component: StudySetQuizQuestionComponent;
  let fixture: ComponentFixture<StudySetQuizQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudySetQuizQuestionComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StudySetQuizQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
