import { RouterModule, Routes } from "@angular/router";
import { LandingComponent } from "./landing.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingRoutingModule {}
