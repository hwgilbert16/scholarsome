import { Routes } from "@angular/router";
import { LandingComponent } from "./landing/landing.component";
import { CreateComponent } from "./create/create.component";

export const AppRoutes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'create-study-set', component: CreateComponent }
];
