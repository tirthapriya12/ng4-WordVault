import { Component, OnInit, Input, SimpleChange, SimpleChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() templateData: any;
  @Input() helpData: any;
  @Output() helpopened = new EventEmitter();
  title: string;
  helpOpened: boolean = false;
  constructor() { }

  ngOnInit() {


  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.templateData && changes.templateData.currentValue) {
      this.templateData = changes.templateData.currentValue;
      this.setTemplateData();
    }
    if (changes.helpData && changes.helpData.currentValue) {
      this.helpData = changes.helpData.currentValue;
    }
  }

  setTemplateData(): void {
    this.title = this.templateData.title;
  }

  toggleHelp() {

    this.helpOpened = !this.helpOpened;
    this.helpopened.emit(this.helpOpened);
  }



}
