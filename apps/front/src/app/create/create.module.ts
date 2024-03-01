import { NgModule } from "@angular/core";
import { CreateStudySetComponent } from "./study-set/create-study-set.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { CommonModule } from "@angular/common";
import { CreateRoutingModule } from "./create-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CreateFolderComponent } from "./create-folder/create-folder.component";

@NgModule({
  imports: [FontAwesomeModule, CreateRoutingModule, CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [CreateStudySetComponent, CreateFolderComponent],
  exports: []
})
export class CreateModule {}
