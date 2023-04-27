import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomepageComponent } from "./homepage.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { RouterModule } from "@angular/router";
import { HomepageRoutingModule } from "./homepage-routing.module";

@NgModule({
  declarations: [HomepageComponent],
  imports: [
    CommonModule,
    HomepageRoutingModule,
    FontAwesomeModule,
    TooltipModule,
    RouterModule
  ]
})
export class HomepageModule { }
