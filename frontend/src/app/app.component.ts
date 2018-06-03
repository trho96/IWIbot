import { Component, HostListener, Input } from '@angular/core';
import { ThemeManagerService } from "./shared/services/theme-manager.service";
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(public themeManager: ThemeManagerService, private breakpointObserver: BreakpointObserver) {
  }

  /**
   * Checks if the screen is small
   * @returns {boolean}  true if max-width of 599px is not exceeded
   */
  getIsSmallScreen() {
    return this.breakpointObserver.isMatched('(max-width: 599px)');
  }

}
