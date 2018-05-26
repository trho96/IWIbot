import {Component, HostListener, Input} from '@angular/core';
import { ThemeManagerService } from "./shared/services/theme-manager.service";
import {ToolbarComponent} from "./toolbar/toolbar.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  opened: boolean = true;

  constructor(public themeManager: ThemeManagerService) {

  }


}
