import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Conversation } from '../models/conversation';
import { Observable, Subject } from 'rxjs';
import { Message } from '../models/message';
import { LoginService } from "./login.service";

@Injectable()
export class ConversationService {

  private static CONVERSATION_API_URL = 'https://service.us.apiconnect.ibmcloud.com/gws/apigateway/api/' +
                                        'c9f88de3acb5a4648e4f118769d019c8df8797d1777c4342f43260626b4c51bf/iwibot/router';
  private newMessagesSubject: Subject<Message[]>;
  private newResponseMessageSubject: Subject<Message>;

  constructor(
    private http: HttpClient,
    private conversation: Conversation,
    private loginService: LoginService,
  )
  {
    this.newMessagesSubject = new Subject();
    this.newResponseMessageSubject = new Subject();
    this.initConversation();
  }

  /**
   * Initializes the conversation
   *
   * initial request to the conversation service to set the context of the conversation
   * and get the first message
   *
   */
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

  /**
   * Sends a request with the message to the conversation service and processes the response
   * @param {string} message
   */
  public sendMessage(message: string) {
    const sendMessage = new Message(message, true);
    this.conversation.addMessage(sendMessage);
    this.newMessagesSubject.next(this.getConversationMessages());

    const request = this.createRequest(message);
    this.getResponse(request).subscribe(response => {
      this.processResponse(response);
    });
  }

  /**
   * Creates a request object with information from the message and the conversation.
   * @params (Message) message  the message that gets send with the request
   * @returns {any}
   */
  private createRequest(message: string) {
    let requestObject: any;
    requestObject = {};
    requestObject.context = this.conversation.getContext();
    requestObject.context.iwibotCreds = this.loginService.getCookie('iwibot-creds');
    requestObject.payload = message;
    if (this.getConversation().getUserInformation()) {
      requestObject.semester = this.conversation.getUserInformation().getSemester();
      requestObject.courseOfStudies = this.conversation.getUserInformation().getCourseOfStudies();
    }
    return requestObject;
  }

  /**
   * Processes the response from the conversation service
   * @param response
   * @return Message
   */
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

  /**
   * Sends a request to the conversation service
   * @param {Object} requestObject
   * @returns {Observable<any>}
   */
  private getResponse(requestObject: Object): Observable<any> {
    return this.http.post(ConversationService.CONVERSATION_API_URL, requestObject);
  }

  /**
   * Returns the current conversation
   * @returns {Conversation}
   */
  public getConversation(): Conversation {
    return this.conversation;
  }

  /**
   * Returns the messages from the conversation
   * @returns {Message[]}
   */
  public getConversationMessages() {
    return this.conversation.getMessages();
  }

  /**
   * Returns the newMessageSubject
   * @returns {Subject<Message[]>}
   */
  public getNewMessageSubject(): Subject<Message[]> {
    return this.newMessagesSubject;
  }

  /**
   * Returns the newResponseMessageSubject
   * @returns {Subject<Message>}
   */
  public getNewResponseMessageSubject(): Subject<Message> {
    return this.newResponseMessageSubject;
  }
}
