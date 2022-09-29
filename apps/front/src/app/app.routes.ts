import { Routes } from "@angular/router";
import { LandingComponent } from "./landing/landing.component";
import { CreateStudySetComponent } from "./create-study-set/create-study-set.component";

export const AppRoutes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'create-study-set', component: CreateStudySetComponent }
];
