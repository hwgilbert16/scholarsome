import { NgModule } from "@angular/core";
import { LandingComponent } from "./landing.component";
import { LandingRoutingModule } from "./landing-routing.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@NgModule({
  imports: [
    LandingRoutingModule,
    FontAwesomeModule
  ],
  declarations: [LandingComponent]
})
export class LandingModule {}
