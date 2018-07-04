import { Injectable } from '@angular/core';

@Injectable()
export class ValidatorService {

  validators: Array<any> = [];
  constructor() { }

  prepareValidators(roundData) {
    this.validators = [];
    for (let qId in roundData) {
      this.validators.push(roundData[qId].answers.text[parseInt(roundData[qId].correctAnswer) - 1]);
    }
  }

  getValidator(index: number) {
    return (this.validators[index]) ? this.validators[index] : null;
  }


}


