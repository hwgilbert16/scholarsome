import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewComponent } from './view.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ViewRoutingModule } from './view-routing.module';
import { ViewStudySetsComponent } from './study-set/view-study-sets.component';
import { StudySetDescriptionComponent } from './study-set-description/study-set-description.component';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { StudySetCardComponent } from './study-set/study-set-card/study-set-card.component';
import { StudySetFlashcardsComponent } from './study-set/study-set-flashcards/study-set-flashcards.component';
import { TooltipModule } from "ngx-bootstrap/tooltip";

@NgModule({
  declarations: [
    ViewStudySetsComponent,
    ViewComponent,
    StudySetDescriptionComponent,
    StudySetCardComponent,
    StudySetFlashcardsComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    ViewRoutingModule,
    PopoverModule,
    TooltipModule
  ]
})
export class ViewModule {}
