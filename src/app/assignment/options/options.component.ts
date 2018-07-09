import { Renderer, Component, OnInit, Input, SimpleChanges, ChangeDetectorRef, ViewChildren } from '@angular/core';
import { EventManager } from '../../services/event-manager.service';
import { OptionsService } from './options.service';


@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css'],
  providers: [OptionsService]
})
export class OptionsComponent implements OnInit {

  @Input() roundData: any;
  @ViewChildren('optionElms') optionElms: HTMLElement;

  options: Array<any> = [];
  readonly highlightTime: number = 1800;
  currentAttempt: EventTarget;

  constructor(private eventManager: EventManager, private optionService: OptionsService, private changeDetector: ChangeDetectorRef, private renderer: Renderer) { }

  ngOnInit() {
    this.eventManager.on('loadnextoption', (index) => { this.setRoundIndexOption(index) });
    this.eventManager.on('removeactive', (active) => { this.removeActives(); });
    this.eventManager.on('highlightcorrect', (data) => {
      this.highlightCorrect(data);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.roundData.currentValue) {
      this.roundData = changes.roundData.currentValue;
      this.optionService.prepareOptions(this.roundData);
      this.resetAttempt();
    }
  }

  setRoundIndexOption(index: number) {
    if (this.optionService.getCurrentIndexOption(index))
      this.options = (this.optionService.getCurrentIndexOption(index));
    this.changeDetector.detectChanges();
    this.removeActives();
  }

  onOptionClick(option: string, event: Event) {
    event.stopPropagation();
    this.setActive(event.target);
    this.currentAttempt = event.target;
    this.sendUserResponse(option);
  }
  sendUserResponse(option: string) {
    this.eventManager.broadcast('userresponse', option);
  }

  setActive(element: EventTarget) {
    this.removeActives();
    this.renderer.setElementClass(element, 'active', true);
  }
  removeActives() {
    for (let element of this.optionElms['_results']) {

      this.renderer.setElementClass(element.nativeElement, 'active', false);
    }
  }

  highlightCorrect(resp: any) {
    console.log(resp)
    for (let option of this.optionElms['_results']) {

      if (option.nativeElement.innerText.trim() === resp) {

        this.renderer.setElementClass(option.nativeElement, 'highlight-correct', true);
        this.renderer.setElementClass(this.currentAttempt, 'highlight-incorrect', true);
        this.removeAfterTimeOut(option.nativeElement, this.currentAttempt);

      }
    }
  }

  removeAfterTimeOut(correctElement, incorrectElement) {
    setTimeout(() => {

      this.renderer.setElementClass(correctElement, 'highlight-correct', false);
      this.renderer.setElementClass(incorrectElement, 'highlight-incorrect', false);
      this.eventManager.broadcast('highlightcomplete', true);

    }, this.highlightTime);
  }

  resetAttempt(){
    this.currentAttempt = null;
  }

  accessibleSelect(event){
      this.onOptionClick(event.target.innerText.trim(),event);
  }
}
