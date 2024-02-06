import { NgModule } from "@angular/core";
import { CreateStudySetComponent } from "./study-set/create-study-set.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { CommonModule } from "@angular/common";
import { CreateRoutingModule } from "./create-routing.module";
import { FormsModule } from "@angular/forms";

@NgModule({
  imports: [
    FontAwesomeModule,
    CreateRoutingModule,
    CommonModule,
    FormsModule
  ],
  declarations: [CreateStudySetComponent],
  exports: []
})
export class CreateModule {}
