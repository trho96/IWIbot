import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';
import { FormControl } from '@angular/forms';
import { LoginService } from '../shared/services/login.service';
import { ConversationService } from '../shared/services/conversation.service';
import { UserInformation } from '../shared/models/user-information';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent implements OnInit {

  dialogTitle = 'Login';
  username: string;
  password: string;
  semester = '1';
  errorOccurred = false;
  errorText: string;

  constructor(
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private loginService: LoginService,
    private conversationService: ConversationService
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  login(): void {
    this.loginService.getStudentInformation(this.username, this.password).subscribe(
      (data: any) => {
        const conversation = this.conversationService.getConversation();
        const userInformation = new UserInformation(this.semester, data.student.courseOfStudies);
        conversation.setUserInformation(userInformation);
        this.dialogRef.close();
      },
      error => {
        if (error.status === 401) {
          this.errorOccurred = true;
          this.errorText = 'Benutzername und/oder Passwort falsch';
        }
        console.log(error);
      }
    );
  }

  ngOnInit() {
  }

}
