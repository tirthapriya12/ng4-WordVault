import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { AssignmentService } from './assignment.service';
import { EventManager } from '../services/event-manager.service';
import { UserResponseService } from '../services/user-response.service';
import { SpriteAnimationDataService } from '../services/sprite-animation-data.service';
import { SoundService } from '../services/sound.service';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css'],
  providers: [AssignmentService]
})

export class AssignmentComponent implements OnInit {

  @Input() templateData: any;
  direction: string;
  directionAudioUrl: string;
  pageIndex: number;
  currentRoundData: any;
  animDataPath: string = './assets/data/vault-sprite.json';
  currentAnimation: string = '';

  @Output() pageChanged: EventEmitter<number> = new EventEmitter<number>();

  constructor(private assignmentService: AssignmentService, private eventManager: EventManager, private userResponseService: UserResponseService, private spriteAnimationDatServc: SpriteAnimationDataService, private soundService: SoundService) { }

  ngOnInit() {

    this.init();
    this.spriteAnimationDatServc.fetchAnimationData(this.animDataPath).subscribe(() => { });
    this.eventManager.on('animationcomplete', () => { this.onAnimationComplete() });
    this.eventManager.on('playquestionanimation', (qId) => {
      this.playQuestionAnimation(qId);
    });

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
    let frameData = this.assignmentService.getRoundQuestionAnimationData(this.pageIndex, qId);
    this.eventManager.broadcast('animate', this.spriteAnimationDatServc.getAnimationData(frameData.start, frameData.end));
  }

  onAnimationComplete() {

    this.eventManager.broadcast('questionanimationplayed', true);

  }
}
