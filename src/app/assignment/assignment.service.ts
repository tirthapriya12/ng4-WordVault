import { Injectable } from '@angular/core';
import { EventManager } from '../services/event-manager.service';

@Injectable()
export class AssignmentService {

  roundsArr: Array<any> = [];
  constructor(private eventManager: EventManager) { }

  prepareRoundsData(templateData: any) {
    if (!templateData) return;
    let rounds = templateData.rounds;

    for (let i in rounds) {
      this.roundsArr.push(rounds[i].questions.question);

    }


  }

  getRoundData(pageIndex: number) {
    return this.roundsArr[pageIndex] ? this.roundsArr[pageIndex] : null;
  }

  getRoundQuestionAnimationData(pageIndex: number, qId: number) {

    return this.roundsArr[pageIndex] ? this.roundsArr[pageIndex][qId].frameRange : null;
  }
}
