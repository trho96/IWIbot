import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatToolbarModule,
  MatIconModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatSidenavModule, MatCardModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from '@angular/cdk/layout';
import { AppComponent } from './app.component';
import { SpeechToTextService } from './shared/services/speech-to-text-service.service';
import { ChatComponent } from './chat/chat.component';
import { ConversationService } from './shared/services/conversation.service';
import { Conversation} from './shared/models/conversation';
import { TextToSpeechService } from './shared/services/text-to-speech.service';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { LoginService } from './shared/services/login.service';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ThemeManagerService } from "./shared/services/theme-manager.service";
import { BulletinboardComponent } from './bulletinboard/bulletinboard.component';


@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    LoginDialogComponent,
    ToolbarComponent,
    BulletinboardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CdkTableModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSidenavModule,
    MatCardModule,
    LayoutModule
  ],
  providers: [
    SpeechToTextService,
    ConversationService,
    Conversation,
    TextToSpeechService,
    LoginService,
    ThemeManagerService,
  ],
  bootstrap: [
    AppComponent,
  ],
  entryComponents: [
    LoginDialogComponent
  ],
})
export class AppModule { }
