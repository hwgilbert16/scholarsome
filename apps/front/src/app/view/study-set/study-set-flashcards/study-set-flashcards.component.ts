import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SetsService } from "../../../shared/http/sets.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'scholarsome-study-set-flashcards',
  templateUrl: './study-set-flashcards.component.html',
  styleUrls: ['./study-set-flashcards.component.scss'],
})
export class StudySetFlashcardsComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private sets: SetsService,
    private router: Router
  ) {}

  @ViewChild('spinner', { static: true }) spinner: ElementRef;
  @ViewChild('container', { static: true }) container: ElementRef;

  async ngOnInit(): Promise<void> {
    const setId = this.route.snapshot.paramMap.get('setId');
    if (!setId) {
      await this.router.navigate(['404']);
      return;
    }

    const set = await this.sets.set(setId);
    if (!set) {
      await this.router.navigate(['404']);
      return;
    }

    this.spinner.nativeElement.remove();
    this.container.nativeElement.removeAttribute('hidden');
  }

}
