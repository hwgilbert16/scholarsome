import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomepageComponent } from "./homepage.component";
import { HomepageSetDescriptionComponent } from "./homepage-set-description/homepage-set-description.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { RouterModule } from "@angular/router";
import { HomepageRoutingModule } from "./homepage-routing.module";

@NgModule({
  declarations: [HomepageComponent, HomepageSetDescriptionComponent],
  imports: [
    CommonModule,
    HomepageRoutingModule,
    FontAwesomeModule,
    TooltipModule,
    RouterModule
  ]
})
export class HomepageModule { }
