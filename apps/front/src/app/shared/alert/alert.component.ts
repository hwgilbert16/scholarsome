import { Component, Input } from '@angular/core';

@Component({
  selector: 'scholarsome-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  @Input() type: string;
  @Input() dismiss: boolean;
  @Input() message: string;
}
