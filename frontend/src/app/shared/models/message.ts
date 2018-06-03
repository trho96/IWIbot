export class Message {

  constructor(
    private payload: string,
    private isSendMessage: boolean,
    private html: string = '',
    private lang?: string
  ) {
  }

  public setHtml(html: string): void {
    if (html === undefined) {
      return;
    }
    this.html = html;
  }

  public getHtml(): string {
    return this.html;
  }

  public getPayload(): string {
    return this.payload;
  }

  public getLanguage(): string {
    return this.lang;
  }

  public setLanguage(lang: string): void {
    if (lang === undefined) {
      return;
    }
    this.lang = lang;
  }

  public getIsSendMessage(): boolean {
    return this.isSendMessage;
  }
}
