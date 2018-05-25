import {Component, OnInit} from '@angular/core';
import {LoginDialogComponent} from '../login-dialog/login-dialog.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  constructor(public dialog: MatDialog) {

  }

  ngOnInit() {

  }

  openDialog(): void {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '300px',
      data: {}
    });
  }


}
