import { Component, OnInit, Input, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { QuestionService } from './question.service';
import { EventManager } from '../../services/event-manager.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
  providers: [QuestionService]
})

export class QuestionComponent implements OnInit {

  @Input() roundData: any;

  questionText: string = '';
  dashReplaceString = `<span aria-label='student reponse line' class='underline'>&nbsp;</span>`;
  constructor(private questionService: QuestionService, private eventManager: EventManager, private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.eventManager.on('loadnextquestion', (index) => { this.setRoundIndexQuestion(index) });

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.roundData.currentValue) {
      this.roundData = changes.roundData.currentValue;
      this.questionService.fetchQuestions(this.roundData);
    }
  }

  setRoundIndexQuestion(index: number) {
    this.questionText = (this.questionService.questions[index]) ? this.questionService.questions[index] : '';
    this.changeDetector.detectChanges();
  }

}
