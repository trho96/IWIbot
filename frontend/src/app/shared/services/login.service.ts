import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private hskaStudentInfoUrl = 'https://www.iwi.hs-karlsruhe.de/Intranetaccess/REST/credential/v2/info';

  constructor(private http: HttpClient) { }

  public getStudentInformation(username: string, password: string) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Basic ' + btoa(username + ':' + password)
      })
    };
    return this.http.get(this.hskaStudentInfoUrl, httpOptions);
  }
}
