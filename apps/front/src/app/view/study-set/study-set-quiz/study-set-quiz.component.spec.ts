import { ComponentFixture, TestBed } from "@angular/core/testing";
import { StudySetQuizComponent } from "./study-set-quiz.component";

describe("StudySetQuizComponent", () => {
  let component: StudySetQuizComponent;
  let fixture: ComponentFixture<StudySetQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudySetQuizComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StudySetQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
