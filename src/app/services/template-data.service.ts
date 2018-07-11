import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { EventManager } from './event-manager.service';

@Injectable()
export class TemplateDataService {

  templateData: any;
  helpData: any;
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
      this.eventManager.broadcast('templateData', this.templateData);
      return data;
    });
  }

  getTotalRounds() {

    return Object.keys(this.templateData['word_vault'].rounds).length;
  }

  fetchHelpData() {
    return this.http.get('./assets/data/word_vault_help.json').map((data) => {

      return this.helpData = data;
    });
  }

  getHelpData(){
    return this.helpData;
  }
}
