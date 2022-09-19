import { Component, OnInit } from '@angular/core';
import { faGithub } from "@fortawesome/free-brands-svg-icons";

@Component({
  selector: 'quizletbutfree-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  constructor() {}

  faGithub = faGithub;

  ngOnInit(): void {}
}
