import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { HomepageComponent } from "./homepage.component";
import { AuthGuardService } from "../auth/auth-guard.service";

const routes: Routes = [
  {
    path: "",
    component: HomepageComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomepageRoutingModule {}
