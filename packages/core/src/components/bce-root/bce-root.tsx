import {
  Component,
  Element,
  h,
  Host,
  Method,
  Prop,
  State
} from '@stencil/core';

import { MessageOptions } from '../../models/message-options';
import { injectCSS } from '../../utils/stylesheet';
import { UUID } from '../../utils/uuid';

@Component({
  tag: 'bce-root',
  styleUrl: 'bce-root.scss',
  shadow: true
})
export class Root {
  @Element()
  private el!: HTMLBceRootElement;

  @Prop({ reflect: true })
  public mode?: 'default' | 'bucket';

  @State()
  private _fab = false;

  @State()
  private _messageQueue: ({ text: string } & MessageOptions)[] = [];

  private _messageTimer = 0;
  private _padding = 0;

  private handleSlotChange = (event: Event | HTMLSlotElement) => {
    const slot = 'target' in event ? (event.target as HTMLSlotElement) : event;
    if (!slot || slot.tagName !== 'SLOT') return;

    this._fab = !!this.el.querySelector('bce-fab:not([inline]');
    const header = this.el.querySelector('bce-header') ? 56 : 0;
    const status = this.el.querySelector('bce-status-bar') ? 20 : 0;
    const padding = header + status;

    if (this._padding !== padding) {
      this._padding = padding;

      const { id } = this.el;
      injectCSS(id, [
        `bce-root#${id} {`,
        `  --bce-padding-top: ${padding}px;`,
        '}'
      ]);
    }
  };

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
    action.type = 'submit';
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
    action2.design = 'text';
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

  @Method()
  public async success(text: string, options: Partial<MessageOptions> = {}) {
    return this.message(text, { color: 'success', duration: 2, ...options });
  }

  @Method()
  public async error(text: string, options: Partial<MessageOptions> = {}) {
    return this.message(text, { color: 'error', duration: 5, ...options });
  }

  @Method()
  public async warning(text: string, options: Partial<MessageOptions> = {}) {
    return this.message(text, { color: 'warning', duration: 2, ...options });
  }

  @Method()
  public async info(text: string, options: Partial<MessageOptions> = {}) {
    return this.message(text, { color: 'info', duration: 2, ...options });
  }

  @Method()
  public async message(text: string, options: Partial<MessageOptions> = {}) {
    if (!text) return;

    // Messages have a minimum duration of 1 second and a maximum of 10 seconds
    let duration = options.duration || 2;
    duration = duration < 1 ? 1 : duration;
    duration = duration > 10 ? 10 : duration;

    const color = options.color || 'dark';
    this._messageQueue = [...this._messageQueue, { text, color, duration }];
    this.messageCheck();
  }

  private messageCheck() {
    // Skip if there is no message or already displaying a message
    const [message] = this._messageQueue;
    if (!message || !!this._messageTimer) return;

    // Remove message after specified duration
    this._messageTimer = window.setTimeout(
      () => this.messageTimeout(),
      message.duration * 1000
    );
  }

  private messageTimeout() {
    // Remove current message from queue
    this._messageQueue = this._messageQueue.slice(1);

    // Clear timer & check remaining queue
    this._messageTimer = 0;
    this.messageCheck();
  }

  componentDidLoad() {
    const slot = this.el.shadowRoot!.querySelector('slot');
    if (slot) {
      slot.addEventListener('slotchange', this.handleSlotChange);
      this.handleSlotChange(slot);
    }

    if (!this.el.id) this.el.id = UUID.v4();
  }

  renderMessage() {
    const [message] = this._messageQueue;
    if (!message) return;

    return (
      <bce-message
        key={this._messageTimer}
        color={message.color}
        fab={this._fab}
      >
        {message.text}
      </bce-message>
    );
  }

  render() {
    return (
      <Host>
        <slot />
        {this.renderMessage()}
      </Host>
    );
  }
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
