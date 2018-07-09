import { Component, OnInit, Input, SimpleChanges, Output, ViewChild } from '@angular/core';
import { EventManager } from '../../services/event-manager.service';
import { ValidatorService } from './validator.service';
import { EventEmitter } from 'events';
import { UserResponseService } from '../../services/user-response.service';

@Component({
  selector: 'app-validator',
  templateUrl: './validator.component.html',
  styleUrls: ['./validator.component.css'],
  providers: [ValidatorService]
})
export class ValidatorComponent implements OnInit {

  @Input() roundData: any;
  @ViewChild('OKBtn') OKBtn: any;
  currentResponse: string;
  currentAttemptIndex: number;
  attempt: string = 'first';
  disableOkButton: boolean = true;

  constructor(private eventManager: EventManager, private validatorService: ValidatorService, private userResponseService: UserResponseService) { }

  ngOnInit() {
    this.eventManager.on('userresponse', (response) => { this.storeUserResponse(response) });
    this.currentAttemptIndex = 0;
    this.eventManager.broadcast('loadnextquestion', this.currentAttemptIndex);
    this.eventManager.broadcast('loadnextoption', this.currentAttemptIndex);
    this.eventManager.on('highlightcomplete', (truce) => { this.shouldLoadNextPage(); });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.roundData.currentValue) {
      this.roundData = changes.roundData.currentValue;
      this.validatorService.prepareValidators(this.roundData);
      this.currentAttemptIndex = 0;
      this.attemptOrder();
      this.eventManager.broadcast('loadnextquestion', this.currentAttemptIndex);
      this.eventManager.broadcast('loadnextoption', this.currentAttemptIndex);
      this.disableOkButton = true;
    }
  }

  storeUserResponse(response: string) {
    this.currentResponse = response;
    this.userResponseService.setResponse(this.currentAttemptIndex, this.roundData, response, this.attempt);
    this.disableOkButton = false;
  }

  validateUserResponse() {
    let correct = false,
      userResponse = this.userResponseService.getUserResponse(this.currentAttemptIndex, this.roundData, this.attempt),
      isSecondAttempt = this.attempt === 'second';
    if (this.validatorService.getValidator(this.currentAttemptIndex) && userResponse) {

      correct = userResponse === this.validatorService.getValidator(this.currentAttemptIndex);

      //if attempt < no. of questions && correct load next question of the page
      if (this.currentAttemptIndex < this.validatorService.validators.length - 1 && correct) {

        this.eventManager.broadcast('playcorrectattemptaudio', isSecondAttempt);
        this.eventManager.off('questionanimationplayed').on('questionanimationplayed', () => {
          this.loadNextPageQuestion(); //load next question when animation completes 

        });
        this.eventManager.broadcast('playquestionanimation', this.currentAttemptIndex);

      } else if (correct) {
        this.eventManager.broadcast('playcorrectattemptaudio', isSecondAttempt);
        this.eventManager.off('questionanimationplayed').on('questionanimationplayed', () => {
          this.loadNextPage(); //loadNextPage after animation completes
        });
        this.eventManager.broadcast('playquestionanimation', this.currentAttemptIndex);
      } else {
        this.eventManager.broadcast('playincorrectattemptaudio', isSecondAttempt);
        this.resetAttempt();
      }

      //if incorrect and second attempt , show the correct answer to the user
      if (isSecondAttempt && !correct) {
        this.eventManager.broadcast('playincorrectattemptaudio', isSecondAttempt);
        this.eventManager.broadcast('highlightcorrect', this.validatorService.getValidator(this.currentAttemptIndex));
      }
      this.attemptOrder();
    }
    this.OKBtn.nativeElement.disabled = true;
  }

  loadNextPageQuestion() {
    this.currentAttemptIndex++;
    this.disableOkButton = true;
    this.eventManager.broadcast('loadnextquestion', this.currentAttemptIndex);
    this.eventManager.broadcast('loadnextoption', this.currentAttemptIndex);
    this.resetAttemptOrder();
  }

  loadNextPage() {
    this.resetAttemptOrder();
    this.disableOkButton = true;
    this.eventManager.broadcast('loadnextpage', true);
  }

  resetAttempt() {
    this.eventManager.broadcast('removeactive', true);
    this.userResponseService.setResponse(this.currentAttemptIndex, this.roundData, null, this.attempt);
    this.disableOkButton = true;
  }

  attemptOrder() {
    if (!this.currentAttemptIndex && this.currentAttemptIndex != 0) return;

    if (!this.roundData[this.currentAttemptIndex]['first']) {
      this.attempt = 'first';
    } else {
      this.attempt = 'second';
    }
  }

  resetAttemptOrder() {
    this.attempt = 'first';

  }

  shouldLoadNextPage() {

    let callBack;
    if (this.currentAttemptIndex < this.validatorService.validators.length - 1) {

      callBack = this.loadNextPageQuestion;
    } else {

      callBack = this.loadNextPage;
    }

    this.eventManager.off('questionanimationplayed').on('questionanimationplayed', () => {
      callBack.call(this);
    });
    this.eventManager.broadcast('playquestionanimation', this.currentAttemptIndex);
  }

}
