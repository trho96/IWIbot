import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private hskaStudentInfoUrl = 'https://www.iwi.hs-karlsruhe.de/Intranetaccess/REST/credential/v2/info';

  constructor(private http: HttpClient) { }

  public setCookie(cname:string, cvalue:string, exdays:number) {
      const d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      const expires = "expires="+d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  public getCookie(cname:string) {
      const name = cname + "=";
      let ca = document.cookie.split(';');
      for(let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) == ' ') {
              c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
              return c.substring(name.length, c.length);
          }
      }
      return "";
  }

  public checkCookie(cname:string) {
      if (this.getCookie(cname) == "") {
          return false;
      } else {
          return true;
      }
  }

  public getStudentInformation(username: string, password: string) {
    const token = btoa(username + ':' + password);
    this.setCookie("iwibot-creds", token, 365);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Basic ' + token
      })
    };
    return this.http.get(this.hskaStudentInfoUrl, httpOptions);
  }
}
