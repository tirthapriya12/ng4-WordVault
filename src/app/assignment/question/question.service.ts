import { Injectable } from '@angular/core';
import { TemplateDataService } from '../../services/template-data.service';
import { EventManager } from '../../services/event-manager.service';

@Injectable()
export class QuestionService {

  questions: Array<any> = [];
  constructor(private templateDataService: TemplateDataService, private eventManager: EventManager) { }

  fetchQuestions(roundData: Array<any>) {
    this.questions = []
    for (let i in roundData) {
      this.questions.push(roundData[i].text.p);
    }
  }
}
