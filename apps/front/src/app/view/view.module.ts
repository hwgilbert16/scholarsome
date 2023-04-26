import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ViewComponent } from "./view.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ViewRoutingModule } from "./view-routing.module";
import { StudySetDescriptionComponent } from "./study-set-description/study-set-description.component";
import { PopoverModule } from "ngx-bootstrap/popover";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    ViewComponent,
    StudySetDescriptionComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    ViewRoutingModule,
    PopoverModule,
    TooltipModule,
    FormsModule
  ]
})
export class ViewModule {}
