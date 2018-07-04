import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { EventManager } from './event-manager.service';

@Injectable()
export class TemplateDataService {

  templateData: any;
  constructor(private http: HttpClient, private eventManager: EventManager) { }

  getData() {
    if (this.templateData) {
      return this.templateData;
    }
    else {
      return this.fetchData()
    }
  }

  fetchData(): Observable<any> {

    return this.http.get('./assets/data/data.json').map((data) => {
      this.templateData = data;
      this.eventManager.broadcast('templateData',this.templateData);
      return data;
    });
  }

  getTotalRounds(){
    let count=0;
    for(let round in this.templateData['word_vault'].rounds){
      count++;
    }
    return count;
  }
}
