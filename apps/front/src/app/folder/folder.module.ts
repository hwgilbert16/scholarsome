import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FolderComponent } from "./folder.component";
import { FolderRoutingModule } from "./folder-routing.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@NgModule({
  declarations: [FolderComponent],
  imports: [CommonModule, FolderRoutingModule, FontAwesomeModule]
})
export class FolderModule {}
