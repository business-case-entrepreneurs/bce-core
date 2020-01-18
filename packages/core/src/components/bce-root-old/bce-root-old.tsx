import {
  Component,
  Element,
  h,
  Host,
  Method,
  Prop,
  State
} from '@stencil/core';

@Component({
  tag: 'bce-root-old',
  styleUrl: 'bce-root-old.scss',
  shadow: false
})
export class BceRoot {
  @Element()
  private el!: HTMLBceRootOldElement;

  @Prop({ reflect: true })
  public mode?: 'default' | 'bucket';

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
  public alert(title: string, message: string, options: AlertOptions = {}) {
    const dialog = document.createElement('bce-dialog');
    dialog.active = true;
    dialog.required = options.required == undefined ? true : options.required;
    dialog.innerHTML = `
      <h3>${title}</h3>
      <p>${message}</p>
    `;

    const action = document.createElement('bce-button');
    action.design = 'text';
    action.slot = 'action';
    action.formType = 'submit';
    action.innerText = options.ok || 'Ok';
    if (options.ok !== false) dialog.appendChild(action);

    return this.execute<void>(
      dialog,
      res => {
        dialog.addEventListener('submit', () => res());
        dialog.addEventListener('backdrop', () => res());
        dialog.addEventListener('close', () => res());
      },
      { display: true }
    );
  }

  @Method()
  public confirm(title: string, message: string, options: ConfirmOptions = {}) {
    const dialog = document.createElement('bce-dialog');
    dialog.active = true;
    dialog.required = options.required == undefined ? true : options.required;
    dialog.innerHTML = `<h3>${title}</h3><p>${message}</p>`;

    const action2 = document.createElement('bce-button');
    action2.slot = 'action';
    action2.color = 'light';
    action2.style.opacity = '0.7';
    action2.innerText = options.cancel || 'Cancel';
    dialog.appendChild(action2);

    const action1 = document.createElement('bce-button');
    action1.slot = 'action';
    action1.innerText = options.ok || 'Ok';
    if (options.ok !== false) dialog.appendChild(action1);

    return this.execute<boolean>(
      dialog,
      res => {
        dialog.addEventListener('backdrop', () => res(false));
        action1.addEventListener('click', () => res(true));
        action2.addEventListener('click', () => res(false));
      },
      { display: true }
    );
  }

  @Method()
  public execute<T>(
    el: HTMLElement,
    exec: Executor<T>,
    options: ExecuteOptions = {}
  ): Promise<T> {
    const defaults: ExecuteOptions = { display: false };
    options = Object.assign({}, defaults, options);

    if (!options.display) el.style.display = 'none';

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

export interface AlertOptions {
  readonly required?: boolean;
  readonly ok?: string | false;
}

export interface ConfirmOptions {
  readonly required?: boolean;
  readonly cancel?: string;
  readonly ok?: string | false;
}

export interface ExecuteOptions {
  readonly display?: boolean;
}

export type Executor<T> = (
  resolve: (value?: T | PromiseLike<T>) => void,
  reject: (reason?: any) => void
) => Promise<any> | void;
