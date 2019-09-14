import { Component, Element, h, Host, Method, State } from '@stencil/core';

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
  public async success(text: string, duration = 2) {
    return this.message(text, duration, 'success');
  }

  @Method()
  public async error(text: string, duration = 5) {
    return this.message(text, duration, 'error');
  }

  @Method()
  public async warning(text: string, duration = 2) {
    return this.message(text, duration, 'warning');
  }

  @Method()
  public async info(text: string, duration = 2) {
    return this.message(text, duration, 'info');
  }

  @Method()
  public async message(text: string, duration = 2, color = 'dark') {
    if (!text) return;

    // Messages have a minimum duration of 1 second and a maximum of 10 seconds
    duration = duration < 1 ? 1 : duration;
    duration = duration > 10 ? 10 : duration;

    // Either render or queue the message
    if (!this.messageCurrent) this.renderMessage({ text, duration, color });
    else this.messageQueue.push({ text, duration, color });
  }

  @Method()
  public confirm(title: string, message: string, options: ConfirmOptions = {}) {
    const dialog = document.createElement('bce-dialog');
    dialog.active = true;
    dialog.required = true;
    dialog.innerHTML = `<h3>${title}</h3><p>${message}</p>`;

    const action2 = document.createElement('bce-button');
    action2.type = 'text';
    action2.slot = 'action';
    action2.innerText = options.cancel || 'Cancel';
    dialog.appendChild(action2);

    const action1 = document.createElement('bce-button');
    action1.type = 'text';
    action1.slot = 'action';
    action1.innerText = options.ok || 'Ok';
    dialog.appendChild(action1);

    const result = new Promise<boolean>(res => {
      dialog.addEventListener('backdrop', () => res(false));
      action1.addEventListener('click', () => res(true));
      action2.addEventListener('click', () => res(false));
    });

    this.el.appendChild(dialog);
    result.then(() => this.el.removeChild(dialog));

    return result;
  }

  @Method()
  public execute<T>(el: HTMLElement, exec: Executor<T>): Promise<T> {
    el.style.display = 'none';

    const result = new Promise<T>((res, rej) => {
      const execution = exec(res, rej);
      if (execution) res(execution);
    });

    this.el.appendChild(el);
    result.then(() => this.el.removeChild(el));

    return result;
  }

  private renderMessage({ text, duration, color }: MessageOptions) {
    this.messageCurrent = true;

    // Create and append message
    const message = document.createElement('bce-message');
    message.innerText = text;
    message.color = color;
    this.el.appendChild(message);

    const onRemove = () => {
      // Remove current message
      this.el.removeChild(message);

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

interface MessageOptions {
  readonly text: string;
  readonly duration: number;
  readonly color: string;
}

export interface ConfirmOptions {
  readonly cancel?: string;
  readonly ok?: string;
}

export type Executor<T> = (
  resolve: (value?: T | PromiseLike<T>) => void,
  reject: (reason?: any) => void
) => Promise<any> | void;
