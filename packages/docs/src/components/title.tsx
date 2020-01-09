import * as Preact from 'preact';

interface Props {
  url?: string | string[];
}

export default class Title extends Preact.Component<Props> {
  public renderURL(url?: string) {
    return url && [<a href={url}>{url}</a>, <br />];
  }

  public render() {
    const { children, url } = this.props;

    const urls = Array.isArray(url)
      ? url.map(u => this.renderURL(u)).filter(v => !!v)
      : this.renderURL(url);

    return [<h2>{children}</h2>, urls];
  }
}
