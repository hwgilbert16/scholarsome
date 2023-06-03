import { RouterModule, Routes } from "@angular/router";
import { ProfileComponent } from "./profile.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
  {
    path: ":id",
    component: ProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule {}
