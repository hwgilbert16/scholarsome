import { RouterModule, Routes } from "@angular/router";
import { CreateStudySetComponent } from "./study-set/create-study-set.component";
import { AuthGuardService } from "../auth/auth-guard.service";
import { NgModule } from "@angular/core";
import { CreateFolderComponent } from "./create-folder/create-folder.component";

const routes: Routes = [
  {
    path: "set",
    component: CreateStudySetComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "folder",
    component: CreateFolderComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateRoutingModule {}
