import { NgModule } from "@angular/core";
import { LandingComponent } from "./landing.component";
import { SharedModule } from "../shared/shared.module";
import { LandingRoutingModule } from "./landing-routing.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { CommonModule } from "@angular/common";
import { ResetComponent } from "./reset/reset.component";
import { FormsModule } from "@angular/forms";

@NgModule({
  imports: [
    SharedModule,
    LandingRoutingModule,
    FontAwesomeModule,
    CommonModule,
    FormsModule
  ],
  declarations: [LandingComponent, ResetComponent]
})
export class LandingModule {}
