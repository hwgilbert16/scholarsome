import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStudySetsComponent } from './view-study-sets.component';

describe('StudySetComponent', () => {
  let component: ViewStudySetsComponent;
  let fixture: ComponentFixture<ViewStudySetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewStudySetsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewStudySetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
