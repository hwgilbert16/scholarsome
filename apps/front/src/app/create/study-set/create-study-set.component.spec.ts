import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CreateStudySetComponent } from "./create-study-set.component";

describe("CreateStudySetComponent", () => {
  let component: CreateStudySetComponent;
  let fixture: ComponentFixture<CreateStudySetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateStudySetComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateStudySetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
