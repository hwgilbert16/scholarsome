import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { StudySetComponent } from "./study-set/study-set.component";
import { ViewComponent } from "./view.component";
import { AuthGuardService } from "../auth/auth-guard.service";

const routes: Routes = [
  {
    path: '',
    component: ViewComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'set/:setId',
    component: StudySetComponent,
    canActivate: [AuthGuardService],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewRoutingModule {}
