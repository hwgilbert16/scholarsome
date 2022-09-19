import { Component, OnInit } from '@angular/core';
import { faClone } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'quizletbutfree-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor() {}

  faClone = faClone;

  ngOnInit(): void {}
}
