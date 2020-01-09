import * as Preact from 'preact';

import Title from '../components/title';

export default class Input extends Preact.Component {
  private mixed = [
    '<bce-input type="password" label="Password"></bce-input>',
    '<bce-input type="color" label="Color"></bce-input>',
    '<bce-input type="date" label="Date"></bce-input>',
    '<bce-input type="email" label="E-mail"></bce-input>',
    '<bce-input type="number" label="Number"></bce-input>',
    '<bce-input type="tel" label="Phone"></bce-input>',
    '<bce-input type="url" label="URL"></bce-input>'
  ];

  public render() {
    return (
      <main>
        <Title url="https://material.io/components/text-fields/">
          BCE Input
        </Title>

        <h4>Mixed</h4>
        <div>
          <bce-input type="password" label="Password"></bce-input>
          <bce-input type="color" label="Color"></bce-input>
          <bce-input type="date" label="Date"></bce-input>
          <bce-input type="email" label="E-mail"></bce-input>
          <bce-input type="number" label="Number"></bce-input>
          <bce-input type="tel" label="Phone"></bce-input>
          <bce-input type="url" label="URL"></bce-input>
        </div>
        <bce-code language="html" content={this.mixed}></bce-code>
      </main>
    );
  }
}
