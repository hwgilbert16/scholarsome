import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FolderComponent } from "./folder.component";
import { FolderRoutingModule } from "./folder-routing.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [FolderComponent],
  imports: [CommonModule, FolderRoutingModule, FontAwesomeModule, ReactiveFormsModule]
})
export class FolderModule {}
