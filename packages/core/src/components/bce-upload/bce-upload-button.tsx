import { library } from '@fortawesome/fontawesome-svg-core';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Method,
  Prop
} from '@stencil/core';

import { ButtonType } from '../../models/button-type';
import { Color } from '../../models/color';
import { File } from '../../utils/file';
import { UUID } from '../../utils/uuid';

library.add(faUpload);

@Component({
  tag: 'bce-upload-button',
  styleUrl: 'bce-upload-button.scss',
  shadow: false
})
export class BceCard {
  @Element()
  public el!: HTMLElement;

  @Prop({ reflect: true })
  public color?: Color;

  @Prop({ reflect: true })
  public type: ButtonType = 'text';

  @Prop({ reflect: true })
  public icon: string = 'fas:upload';

  @Prop({ reflect: true })
  public iconSpin?: boolean;

  @Prop({ reflect: true })
  public block?: boolean;

  @Prop({ reflect: true })
  public disabled = false;

  @Prop({ attribute: 'focus', reflect: true, mutable: true })
  public hasFocus = false;

  @Prop({ reflect: true })
  public accept?: string;

  @Prop({ reflect: true })
  public multiple = false;

  @Event({ bubbles: true })
  private file!: EventEmitter<File[]>;

  private handleChange = (event: Event) => {
    const input = event.target as HTMLInputElement | null;
    if (!input || !input.files) return;

    // Extract required data and generate id
    const files = Array.from(input.files).map(file => {
      return new File(UUID.v4(), file.name, file);
    });

    // Dispatch custom event
    this.file.emit(files);
  };

  private handleClick = () => {
    this.upload();
  };

  @Method()
  public async upload() {
    const input = this.el.querySelector('input') as HTMLInputElement | null;
    if (input) input.click();
  }

  render() {
    return [
      <input
        type="file"
        accept={this.accept}
        multiple={this.multiple}
        onChange={this.handleChange}
        tabIndex={-1}
      />,
      <bce-button
        color={this.color}
        type={this.type}
        icon={this.icon}
        iconSpin={this.iconSpin}
        block={this.block}
        disabled={this.disabled}
        hasFocus={this.hasFocus}
        onClick={this.handleClick}
      >
        <slot>Upload</slot>
      </bce-button>
    ];
  }
}
