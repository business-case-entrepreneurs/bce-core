import * as Preact from 'preact';

import Title from '../components/title';

export default class Switch extends Preact.Component {
  private colors = [
    '<bce-switch value="true" color="primary"></bce-switch>',
    '<bce-switch value="true" color="secondary"></bce-switch>',
    '<bce-switch value="true" color="tertiary"></bce-switch>',
    '<br />',
    '<bce-switch value="true" color="success"></bce-switch>',
    '<bce-switch value="true" color="error"></bce-switch>',
    '<bce-switch value="true" color="warning"></bce-switch>',
    '<bce-switch value="true" color="info"></bce-switch>',
    '<br />',
    '<bce-switch value="true" color="dark"></bce-switch>',
    '<bce-switch value="true" color="light"></bce-switch>'
  ].join('\n');

  private label = [
    '<bce-switch label="Switch Element"></bce-switch>',
    '<bce-switch label="Switch Element" tooltip="Tooltip"></bce-switch>'
  ].join('\n');

  public render() {
    return (
      <main>
        <Title url="https://material.io/components/selection-controls/#switches">
          BCE Switch
        </Title>
        <h4>Colors</h4>
        <div>
          <bce-switch value={true} color="primary"></bce-switch>
          <bce-switch value={true} color="secondary"></bce-switch>
          <bce-switch value={true} color="tertiary"></bce-switch>

          <br />
          <bce-switch value={true} color="success"></bce-switch>
          <bce-switch value={true} color="error"></bce-switch>
          <bce-switch value={true} color="warning"></bce-switch>
          <bce-switch value={true} color="info"></bce-switch>

          <br />
          <bce-switch value={true} color="dark"></bce-switch>
          <bce-switch value={true} color="light"></bce-switch>
        </div>
        <br />
        <bce-code content={this.colors} language="html"></bce-code>

        <h4>Label</h4>
        <div>
          <bce-switch label="Switch Element"></bce-switch>
          <bce-switch label="Switch Element" tooltip="Tooltip"></bce-switch>
        </div>
        <bce-code content={this.label} language="html"></bce-code>
      </main>
    );
  }
}
