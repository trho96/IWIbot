import { Component, OnInit } from '@angular/core';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { MatDialog } from '@angular/material';
import { ThemeManagerService } from "../shared/services/theme-manager.service";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private themeManager: ThemeManagerService
  ) {

  }

  ngOnInit() {

  }

  /**
   * Toggle theme
   */
  changeTheme() {
    this.themeManager.changeTheme();
  }

  /**
   * Opens the login dialog
   */
  openDialog(): void {
    this.dialog.open(LoginDialogComponent, {
      width: '300px',
      data: {}
    });
  }

}
