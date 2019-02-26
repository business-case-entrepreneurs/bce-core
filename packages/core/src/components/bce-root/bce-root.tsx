import { Component, Element, Method, State } from '@stencil/core';

@Component({
  tag: 'bce-root',
  styleUrl: 'bce-root.scss'
})
export class BceRoot {
  @Element()
  private el!: HTMLBceRootElement;

  @State()
  private registeredFAB = false;

  private messageCurrent: string = '';
  private messageQueue: string[] = [];

  @Method()
  public message(text: string) {
    if (!text) return;

    if (!this.messageCurrent) this.renderMessage(text);
    else this.messageQueue.push(text);
  }

  @Method()
  public registerFAB(register: boolean) {
    this.registeredFAB = register;
  }

  private renderMessage(text: string) {
    // Set current message
    this.messageCurrent = text;

    // Create and append message
    const message = document.createElement('bce-message');
    message.innerText = text;
    this.el.append(message);

    // Remove current message and show queued message if needed
    setTimeout(() => {
      message.parentElement!.removeChild(message);
      const next = this.messageQueue.shift();
      if (next) this.renderMessage(next);
      else this.messageCurrent = '';
    }, 2 * 1000);
  }

  hostData() {
    return { fab: this.registeredFAB };
  }

  render() {
    return <slot />;
  }
}
