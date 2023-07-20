import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProfileComponent } from "./profile.component";
import { ProfileRoutingModule } from "./profile-routing.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@NgModule({
  imports: [
    CommonModule,
    ProfileRoutingModule,
    FontAwesomeModule
  ],
  declarations: [ProfileComponent]
})
export class ProfileModule {}
