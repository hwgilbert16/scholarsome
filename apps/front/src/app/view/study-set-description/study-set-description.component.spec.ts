import { ComponentFixture, TestBed } from "@angular/core/testing";

import { StudySetDescriptionComponent } from "./study-set-card.component";

describe("StudySetCardComponent", () => {
  let component: StudySetDescriptionComponent;
  let fixture: ComponentFixture<StudySetDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudySetDescriptionComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StudySetDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
