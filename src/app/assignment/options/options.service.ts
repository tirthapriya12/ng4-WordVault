import { Injectable } from '@angular/core';

@Injectable()
export class OptionsService {

  optionsArr: Array<any> = [];
  constructor() { }

  prepareOptions(roundData: Array<any>) {

    this.optionsArr = [];
    for (let i in roundData) {
      this.optionsArr.push(roundData[i].answers.text);
    }

  }

  getCurrentIndexOption(index: number) {
    return this.optionsArr[index];
  }
}
