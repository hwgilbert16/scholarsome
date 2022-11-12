import { RouterModule, Routes } from "@angular/router";
import { LandingComponent } from "./landing.component";
import { NgModule } from "@angular/core";
import { ResetComponent } from "./reset/reset.component";

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
  },
  {
    path: 'reset',
    component: ResetComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingRoutingModule {}
