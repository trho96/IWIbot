import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class NewsbulletinboardService {

  bulletinBoardNewsUrl = "https://www.iwi.hs-karlsruhe.de/Intranetaccess/REST/newsbulletinboard";

  constructor(private http: HttpClient) { }

  getBulletinBoardNews() {
    return this.http.get(this.bulletinBoardNewsUrl);
  }
}
