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

    this._fab = !!this.el.querySelector('bce-fab');
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
