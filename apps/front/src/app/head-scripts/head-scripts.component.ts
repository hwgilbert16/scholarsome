import { Component, OnInit } from "@angular/core";

@Component({
  selector: "scholarsome-head-scripts",
  template: ""
})
export class HeadScriptsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    if (process.env["SCHOLARSOME_HEAD_SCRIPTS_BASE64"]) {
      const decoded = atob(process.env["SCHOLARSOME_HEAD_SCRIPTS_BASE64"]);
      const element = new DOMParser().parseFromString(decoded, "text/html");

      document.getElementsByTagName("head")[0].appendChild(element.firstChild?.firstChild?.firstChild as HTMLElement);
    }
  }
}
