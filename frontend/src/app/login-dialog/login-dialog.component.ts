import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LoginService } from '../shared/services/login.service';
import { ConversationService } from '../shared/services/conversation.service';
import { UserInformation } from '../shared/models/user-information';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent implements OnInit {

  dialogTitle: string = 'Login';
  username: string;
  password: string;
  semester: string  = '1';
  errorOccurred = false;
  errorText: string;

  constructor(
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private loginService: LoginService,
    private conversationService: ConversationService
  ) {
  }

  /**
   * Closes the Login dialog
   */
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
