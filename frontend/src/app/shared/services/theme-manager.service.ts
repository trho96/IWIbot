import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeManagerService {

  isDarkTheme: boolean = false;

  constructor() {
    this.setThemeFromLocalStorage();
    this.saveCurrentTheme();
  }

  /**
   * Toggle between themes
   * @returns void
   */
  changeTheme() {
    this.isDarkTheme = !this.isDarkTheme;
  }

  /**
   * Saves the current selected theme to the local storage before the page is closed.
   * @returns void
   */
  saveCurrentTheme() {
    window.onbeforeunload = () => {
      window.localStorage.setItem("isDarkTheme", String(this.isDarkTheme));
    }
  }

  /**
   * Sets isDarkTheme to the value from local storage if it is set.
   * @returns void
   */
  setThemeFromLocalStorage() {
    const theme = window.localStorage.getItem("isDarkTheme");
    if (theme) {
      this.isDarkTheme = (theme == 'true');
    }
  };

}

