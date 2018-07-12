import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TemplateDataService } from './services/template-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'Word-Vault';
  templateData: any;
  helpData: any;
  currentPage: number = 0;
  totalPages: number = 0;
  aria_hidden:boolean = false;

  constructor(private templateDataService: TemplateDataService, private changeDetector: ChangeDetectorRef) {

    this.templateDataService.getData().subscribe((data) => {
      console.log(data);
      this.templateData = data['word_vault'];
      this.totalPages = this.templateDataService.getTotalRounds();
    });

    this.templateDataService.fetchHelpData().subscribe((data) => {
      this.helpData = data;
    });

  }

  ngOnInit() {
    console.log('init app')

  }

  onPageChanged(page) {
    this.currentPage = page;

  }

  onHelpOpened(data){
      this.aria_hidden = data;
  }

}

