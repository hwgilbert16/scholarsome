import { Routes } from "@angular/router";
import { LandingComponent } from "./landing/landing.component";
import { CreateStudySetComponent } from "./create/study-set/create-study-set.component";
import { StudySetComponent } from "./study-set/study-set.component";

export const AppRoutes: Routes = [
  { path: "", component: LandingComponent },
  { path: "study-set", component: StudySetComponent },
  { path: "create-study-set", component: CreateStudySetComponent }
];
