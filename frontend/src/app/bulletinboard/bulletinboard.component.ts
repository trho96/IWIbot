import { Component, OnInit } from '@angular/core';
import { NewsbulletinboardService } from "../shared/services/newsbulletinboard.service";
import { NewsBulletinBoard } from "../shared/models/news-bulletin-board";

@Component({
  selector: 'app-bulletinboard',
  templateUrl: './bulletinboard.component.html',
  styleUrls: ['./bulletinboard.component.css']
})
export class BulletinboardComponent implements OnInit {
  newsList: NewsBulletinBoard[];

  constructor(private newsBulletin: NewsbulletinboardService) {
    this.newsBulletin.getBulletinBoardNews().subscribe((news: NewsBulletinBoard[]) => {
      this.newsList = news;
    })

  }

  ngOnInit() {
  }

}
