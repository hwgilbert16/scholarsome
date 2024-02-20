import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { AuthGuardService } from "../auth/auth-guard.service";
import { FolderComponent } from "./folder.component";

const routes: Routes = [
  {
    path: ":folderId",
    component: FolderComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FolderRoutingModule {}
