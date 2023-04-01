import { NgModule } from "@angular/core";
import { CreateStudySetComponent } from "./study-set/create-study-set.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { CreateCardComponent } from "./study-set/create-card/create-card.component";
import { CreateCardDirective } from "./study-set/create-card/create-card.directive";
import { CommonModule } from "@angular/common";
import { CreateRoutingModule } from "./create-routing.module";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  imports: [FontAwesomeModule, CreateRoutingModule, CommonModule, SharedModule],
  declarations: [CreateStudySetComponent, CreateCardComponent, CreateCardDirective]
})
export class CreateModule {}
