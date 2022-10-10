import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudySetComponent } from './study-set/study-set.component';
import { ViewComponent } from './view.component';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ViewRoutingModule } from "./view-routing.module";

@NgModule({
  declarations: [StudySetComponent, ViewComponent],
  imports: [CommonModule, FontAwesomeModule, ViewRoutingModule],
})
export class ViewModule {}
