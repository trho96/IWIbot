import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Conversation } from '../models/conversation';
import { Observable, Subject } from 'rxjs';
import { Message } from '../models/message';
import { LoginService } from "./login.service";
import { ConversationResponseObject } from "../models/conversation-response-object";

@Injectable()
export class ConversationService {

  private static CONVERSATION_API_URL = 'https://service.eu-de.apiconnect.ibmcloud.com/gws/apigateway/api/' +
                                        '05228ef049045b87490b99e65d97270739d670d9ebb2ea5d5684c205ebd7deb6/iwibot/router';
  private readonly newMessagesSubject: Subject<Message>;

  constructor(
    private http: HttpClient,
    private conversation: Conversation,
    private loginService: LoginService,
  ) {
    this.newMessagesSubject = new Subject();
    this.initConversation();
  }

  /**
   * Initializes the conversation
   *
   * initial request to the conversation service to set the context of the conversation
   * and get the first message
   * @returns void
   */
  private initConversation(): void {
    let initObject: any = {};
    initObject.conInit = true;
    this.getResponse(initObject)
      .subscribe(
        response => {
          const message = new Message(response.payload, false);
          this.conversation.addMessage(message);
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
    this.addNewMessageToConversation(sendMessage);

    const request = this.createRequest(message);
    this.getResponse(request).subscribe(response => {
      this.processResponse(response);
    });
  }

  /**
   * Creates a request object with information from the message and the conversation.
   * @params (string) message  the message that gets send with the request
   * @returns {any}
   */
  private createRequest(message: string) {
    let requestObject: any = {};
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
   *
   * creates a news  message, sets the new context and adds the message
   * to the conversation.
   * @param (conversationResponseObject) conversationResponseObject
   */
  private processResponse(conversationResponseObject: ConversationResponseObject): void {
    const responseMessage = new Message(
                            conversationResponseObject.payload,
                            false,
                            conversationResponseObject.htmlText,
                            conversationResponseObject.language
                            );
    this.conversation.setContext(conversationResponseObject.context);
    this.addNewMessageToConversation(responseMessage);
  }

  /**
   * Sends a request to the conversation service
   * @param {Object} requestObject
   * @returns {Observable<ConversationResponseObject>}
   */
  private getResponse(requestObject: Object): Observable<ConversationResponseObject> {
    return this.http.post<ConversationResponseObject>(ConversationService.CONVERSATION_API_URL, requestObject);
  }

  /**
   * Adds a message to the conversation and emits the message under the newMessageSubject
   * @param {Message} message   the message that gets added to the conversation
   */
  private addNewMessageToConversation(message: Message): void {
    this.conversation.addMessage(message);
    this.newMessagesSubject.next(message);
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
  public getConversationMessages(): Message[] {
    return this.conversation.getMessages();
  }

  /**
   * Returns the newMessageSubject
   * @returns {Subject<Message[]>}
   */
  public getNewMessageSubject(): Subject<Message> {
    return this.newMessagesSubject;
  }
}
