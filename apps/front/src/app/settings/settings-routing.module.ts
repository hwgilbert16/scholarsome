import { RouterModule, Routes } from "@angular/router";
import { SettingsComponent } from "./settings.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
  {
    path: "",
    component: SettingsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
