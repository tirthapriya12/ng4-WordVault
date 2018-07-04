import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SpriteAnimationDataService {

  animationData: any;
  constructor(private http: HttpClient) { }

  fetchAnimationData(path: string) {
    return this.http.get(path).map((data) => { this.animationData = data; })
  }

  getAnimationData(start, end) {
    let spriteArr = [];
    for (var i = start; i <= end; i++) {
      let img = '';
      if (i < 10) {
        img = 'lock000' + i;
      }
      else if (i >= 10 && i < 100) {
        img = 'lock00' + i;
      }
      else {
        img = 'lock0' + i;
      }
      spriteArr.push({x: -this.animationData.frames[img].frame.x , y: -this.animationData.frames[img].frame.y}); 
    }
    return spriteArr;
  }
}
