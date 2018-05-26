import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeManagerService {

  isDarkTheme: boolean = false;

  constructor() {
    this.setThemeFromLocalStorage();
    this.saveCurrentTheme();
  }

  changeTheme() {
    this.isDarkTheme = !this.isDarkTheme;
  }

  saveCurrentTheme() {
    window.onbeforeunload = () => {
      window.localStorage.setItem("isDarkTheme", String(this.isDarkTheme));
    }
  }

  setThemeFromLocalStorage() {
    const theme = window.localStorage.getItem("isDarkTheme");
    if (theme) {
      this.isDarkTheme = (theme == 'true');
    }
  };

}

