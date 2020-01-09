import * as Preact from 'preact';

interface Props {
  src: string;
}

export default class Preview extends Preact.Component<Props> {
  public render() {
    const { src } = this.props;
    return <iframe class="preview" src={src} width={414} height={736}></iframe>;
  }
}
