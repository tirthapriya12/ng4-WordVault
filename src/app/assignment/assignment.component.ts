import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { AssignmentService } from './assignment.service';
import { EventManager } from '../services/event-manager.service';
import { UserResponseService } from '../services/user-response.service';
import { SpriteAnimationDataService } from '../services/sprite-animation-data.service';
import { SoundService } from '../services/sound.service';
import { CommonConstants } from '../constants/constants';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css'],
  providers: [AssignmentService]
})

export class AssignmentComponent implements OnInit {

  @Input() templateData: any;
  @Input() totalPages: number;
  direction: string;
  directionAudioUrl: string;
  pageIndex: number;
  currentRoundData: any;
  animDataPath: string = './assets/data/vault-sprite.json';
  currentAnimation: string = '';
  correctAudio = CommonConstants.correctAttemptAudio;
  incorrectAudio = CommonConstants.incorrectAttemptAudio;
  secondAttemptAudio = {
    correct: CommonConstants.secondAttemptCorrectAudio,
    incorrect: CommonConstants.secondAttemptWrongAudio
  }

  @Output() pageChanged: EventEmitter<number> = new EventEmitter<number>();

  constructor(private assignmentService: AssignmentService, private eventManager: EventManager, private userResponseService: UserResponseService, private spriteAnimationDatServc: SpriteAnimationDataService, private soundService: SoundService) { }

  ngOnInit() {

    this.init();
    this.spriteAnimationDatServc.fetchAnimationData(this.animDataPath).subscribe(() => { });
    this.eventManager.on('animationcomplete', () => { this.onAnimationComplete() });
    this.eventManager.on('playquestionanimation', (qId) => {
      this.playQuestionAnimation(qId);
    });

    this.eventManager.on('playcorrectattemptaudio', (isSecondattempt) => {
      this.playValidationSound(isSecondattempt, true);
    });
    this.eventManager.on('playincorrectattemptaudio', (isSecondattempt) => {
      this.playValidationSound(isSecondattempt, false);
    })

    this.eventManager.on('loadnextpage', (data) => {

      if (data) {
        this.onLoadNextPage(data)
      }
    });

  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes.templateData.currentValue) {
      this.templateData = changes.templateData.currentValue;
      this.setDirection();
      this.assignmentService.prepareRoundsData(this.templateData);
      this.currentRoundData = this.getRoundsData();
    }
  }

  init() {
    this.pageIndex = 0;

  }

  setDirection(): void {
    this.direction = this.templateData.directions;
    this.directionAudioUrl = !!this.templateData.directionsAudio ? this.templateData.directionsAudio : '';
  }

  getRoundsData() {
    return this.assignmentService.getRoundData(this.pageIndex);
  }

  onLoadNextPage(event) {

    if (this.pageIndex < this.assignmentService.roundsArr.length - 1) {
      this.pageIndex++;
      this.currentRoundData = this.getRoundsData();
      this.pageChanged.emit(this.pageIndex);
    }
  }

  playQuestionAnimation(qId) {
    let frameData = this.assignmentService.getRoundQuestionAnimationData(this.pageIndex, qId),
      showReward = false;
    if (this.isLastpagequestion(qId)) {
      showReward = true;
    }
    this.eventManager.broadcast('animate', { data: this.spriteAnimationDatServc.getAnimationData(frameData.start, frameData.end), showReward: showReward });
  }

  onAnimationComplete() {

    this.eventManager.broadcast('questionanimationplayed', true);

  }

  playValidationSound(isSecondattempt, isCorrect) {

    if (isCorrect && isSecondattempt) {
      this.soundService.play(this.secondAttemptAudio.correct);
    }
    if (!isCorrect && isSecondattempt) {
      this.soundService.play(this.secondAttemptAudio.incorrect);
    }
    if (isCorrect && !isSecondattempt) {
      this.soundService.play(this.correctAudio[Math.round(Math.random() * (this.correctAudio.length - 1))]);
    }
    if (!isCorrect && !isSecondattempt) {
      this.soundService.play(this.incorrectAudio[Math.round(Math.random() * (this.correctAudio.length - 1))]);
    }
  }

  isLastpagequestion(qId) {

    return this.pageIndex === this.totalPages -1 && qId === this.currentRoundData.length -1;
  }

  playDirectionAudio(){
    this.soundService.play('assets/sfx/'+this.directionAudioUrl);
  }
}
