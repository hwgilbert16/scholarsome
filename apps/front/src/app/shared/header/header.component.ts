import { Component, OnInit, TemplateRef } from '@angular/core';
import { faClone } from '@fortawesome/free-regular-svg-icons';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";

@Component({
  selector: 'quizletbutfree-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor(private modalService: BsModalService) {}

  faClone = faClone;

  modalRef?: BsModalRef;

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  ngOnInit(): void {}
}
