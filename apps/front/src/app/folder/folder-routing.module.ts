import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { FolderComponent } from "./folder.component";

const routes: Routes = [
  {
    path: ":folderId",
    component: FolderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FolderRoutingModule {}
