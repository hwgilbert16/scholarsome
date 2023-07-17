import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ResendEmailComponent } from "./resend-email.component";

describe("ResendEmailComponent", () => {
  let component: ResendEmailComponent;
  let fixture: ComponentFixture<ResendEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResendEmailComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ResendEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
