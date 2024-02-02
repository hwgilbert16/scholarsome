import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { SettingsRoutingModule } from "./settings-routing.module";
import { SettingsComponent } from "./settings.component";
import { ProfilePictureSettingsComponent } from "./profile-picture-settings/profile-picture-settings.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    SettingsRoutingModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [SettingsComponent, ProfilePictureSettingsComponent]
})
export class SettingsModule {}
