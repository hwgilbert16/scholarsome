import { RouterModule, Routes } from "@angular/router";
import { SettingsComponent } from "./settings.component";
import { NgModule } from "@angular/core";
import { AuthGuardService } from "../auth/auth-guard.service";

const routes: Routes = [
  {
    path: "",
    component: SettingsComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
