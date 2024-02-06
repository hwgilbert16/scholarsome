import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { SettingsRoutingModule } from "./settings-routing.module";
import { SettingsComponent } from "./settings.component";
import { AvatarSettingsComponent } from "./avatar-settings/avatar-settings.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ChangePasswordSettingsComponent } from "./change-password-settings/change-password-settings.component";
import { ChangeEmailSettingsComponent } from "./change-email-settings/change-email-settings.component";

@NgModule({
  imports: [
    CommonModule,
    SettingsRoutingModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    SettingsComponent,
    AvatarSettingsComponent,
    ChangePasswordSettingsComponent,
    ChangeEmailSettingsComponent
  ]
})
export class SettingsModule {}
