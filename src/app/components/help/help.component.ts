import { Component, EventEmitter, OnInit, Input, SimpleChanges, Output, ViewChild } from '@angular/core';



@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

  helpText: string = '';
  helpVideoSrc: string = '';
  @Input() helpData: any;
  @Output() closeHelp = new EventEmitter<boolean>();
  @ViewChild('close') close;
  @ViewChild('modal') modal;
  constructor() { }

  ngOnInit() {
    this.modal.nativeElement.setAttribute('tabindex','-1');
    setTimeout(()=>{
      this.modal.nativeElement.focus();
      this.modal.nativeElement.removeAttribute('tabindex');
    })
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes.helpData.currentValue) {
      this.helpData = changes.helpData.currentValue;
      this.helpText = this.helpData.help.text;
      this.helpVideoSrc = this.helpData.help.video;
    }
  }

  emitClose() {
    this.closeHelp.emit(true);
  }

  handleFocus(){
    this.close.nativeElement.setAttribute('tabindex',-1);
    setTimeout(()=>{
      this.close.nativeElement.focus();
      this.close.nativeElement.setAttribute('tabindex',0)
    },100);
    
  }
}
