import { NgModule } from "@angular/core";
import { LandingComponent } from "./landing.component";
import { LandingRoutingModule } from "./landing-routing.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { CommonModule } from "@angular/common";

@NgModule({
  imports: [
    LandingRoutingModule,
    FontAwesomeModule,
    CommonModule
  ],
  declarations: [LandingComponent]
})
export class LandingModule {}
