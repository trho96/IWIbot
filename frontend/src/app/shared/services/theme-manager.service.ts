import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeManagerService {

  isDarkTheme: boolean = false;

  constructor() { }

  changeTheme() {
    this.isDarkTheme = !this.isDarkTheme;
  }




}

