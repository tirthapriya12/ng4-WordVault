import { Component, OnInit, Input, SimpleChange, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() templateData: any;
  title: string;
  
  constructor() { }

  ngOnInit() {


  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.templateData.currentValue) {
    this.templateData = changes.templateData.currentValue;
      this.setTemplateData();
    }
  }

  setTemplateData(): void {
    this.title = this.templateData.title;
  }



}
