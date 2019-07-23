import { Component, Element, h, Host, Method, State } from '@stencil/core';

interface MessageOptions {
  readonly text: string;
  readonly duration: number;
}

@Component({
  tag: 'bce-root',
  styleUrl: 'bce-root.scss',
  shadow: false
})
export class BceRoot {
  @Element()
  private el!: HTMLBceRootElement;

  @State()
  private registeredFAB = false;

  private messageCurrent = false;
  private messageQueue: MessageOptions[] = [];

  @Method()
  public async registerFAB(register: boolean) {
    this.registeredFAB = register;
  }

  @Method()
  public async message(text: string, duration = 2) {
    if (!text) return;

    // Messages have a minimum duration of 1 second and a maximum of 10 seconds
    duration = duration < 1 ? 1 : duration;
    duration = duration > 10 ? 10 : duration;

    // Either render or queue the message
    if (!this.messageCurrent) this.renderMessage({ text, duration });
    else this.messageQueue.push({ text, duration });
  }

  private renderMessage({ text, duration }: MessageOptions) {
    this.messageCurrent = true;

    // Create and append message
    const message = document.createElement('bce-message');
    message.innerText = text;
    this.el.appendChild(message);

    const onRemove = () => {
      // Remove current message
      message.parentElement!.removeChild(message);

      // Render next message if one is queued
      const next = this.messageQueue.shift();
      if (next) this.renderMessage(next);
      else this.messageCurrent = false;
    };

    // Remove message after the specified amount of time
    setTimeout(onRemove, duration * 1000);
  }

  render() {
    return (
      <Host fab={this.registeredFAB}>
        <slot />
      </Host>
    );
  }
}
