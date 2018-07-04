import { Injectable } from '@angular/core';

@Injectable()
export class UserResponseService {

  userResponse = [];
  constructor() { }

  setResponse(index: number, roundData: Array<any>, response: string, attempt: string) {
    roundData[index][attempt] = { userResponse: response };

  }

  getUserResponse(index: number, roundData: Array<any>, attempt: string) {
    return (roundData[index][attempt]) ? roundData[index][attempt].userResponse : null;
  }
}
