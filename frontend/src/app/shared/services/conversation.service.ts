import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Conversation } from '../models/conversation';
import { Observable, Subject } from 'rxjs';
import { Message } from '../models/message';
import {LoginService} from "./login.service";

@Injectable()
export class ConversationService {

  private static CONVERSATION_API_URL = 'https://service.us.apiconnect.ibmcloud.com/gws/apigateway/api/'
    + 'c9f88de3acb5a4648e4f118769d019c8df8797d1777c4342f43260626b4c51bf/iwibot/router';
  private newMessagesSubject;
  private newResponseMessageSubject;

  constructor(
    private http: HttpClient,
    private conversation: Conversation,
    private loginService: LoginService
  ) {
    this.newMessagesSubject = new Subject();
    this.newResponseMessageSubject = new Subject();
    this.initConversation();
  }
  private initConversation(): void {
    let initObject: any;
    initObject = {};
    initObject.payload = 'init';
    this.getResponse(initObject)
      .subscribe(
        response => {
          const message = new Message(response.payload, false);
          this.conversation.addMessage(message);
          this.newMessagesSubject.next(this.getConversationMessages());
          this.conversation.setContext(response.context);
        }
      );
  }

  public sendMessage(content: string) {
    const request = this.createRequest(content);
    this.getResponse(request).subscribe(response => {
      this.processResponse(response);
    });
  }
  public getConversation(): Conversation {
    return this.conversation;
  }
  public getConversationMessages() {
    return this.conversation.getMessages();
  }
  public getNewMessageSubject() {
    return this.newMessagesSubject;
  }
  public getNewResponseMessageSubject() {
    return this.newResponseMessageSubject;
  }
  private getResponse(requestObject: Object): Observable<any> {
    return this.http.post(ConversationService.CONVERSATION_API_URL, requestObject);
  }
  private processResponse(response: any) {
    const responseMessage = new Message(response.payload, false);
    responseMessage.setHtml(response.htmlText);
    responseMessage.setLanguage(response.language);
    responseMessage.setData(response.data);
    this.conversation.setContext(response.context);
    this.conversation.addMessage(responseMessage);
    this.newResponseMessageSubject.next(responseMessage);
    this.newMessagesSubject.next(this.getConversationMessages());
  }
  private createRequest(content: string) {
    const sendMessage = new Message(content, true);
    this.conversation.addMessage(sendMessage);
    this.newMessagesSubject.next(this.getConversationMessages());
    let requestObject: any;
    requestObject = {};
    requestObject.context = this.conversation.getContext();
    Object.assign(requestObject.context, {'iwibotCreds': this.loginService.getCookie('iwibot-creds')});
    requestObject.payload = content;
    if (this.getConversation().getUserInformation() != null) {
      requestObject.semester = this.conversation.getUserInformation().getSemester();
      requestObject.courseOfStudies = this.conversation.getUserInformation().getCourseOfStudies();
    }
    return requestObject;
  }
}
