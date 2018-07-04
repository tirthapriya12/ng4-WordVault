import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  @Input() currentPageNum: number;
  @Input() totalPages: any;
  constructor() { }

  rounds: any = [];
  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes.currentPageNum && changes.currentPageNum.currentValue) {
      this.currentPageNum = changes.currentPageNum.currentValue

    }
    if (changes.totalPages && changes.totalPages.currentValue) {
      this.totalPages = changes.totalPages.currentValue;

      for (let round = 0; round < this.totalPages; round++) {
        this.rounds.push(round)
      }
    }
  }


}
