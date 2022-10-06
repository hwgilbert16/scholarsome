import { NgModule } from '@angular/core';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { CreateComponent } from './create.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CreateCardComponent } from './create-card/create-card.component';
import { CreateCardDirective } from "./create-card/create-card.directive";
import { NgIf } from "@angular/common";

@NgModule({
  imports: [PopoverModule, FontAwesomeModule, NgIf],
  declarations: [CreateComponent, CreateCardComponent, CreateCardDirective],
})
export class CreateModule {}
