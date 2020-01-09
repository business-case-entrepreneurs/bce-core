import * as Preact from 'preact';

import Title from '../components/title';

export default class Select extends Preact.Component {
  private checkbox = [
    '<bce-select type="checkbox" label="Filter Chips" center>',
    '  <bce-chip>Drenthe</bce-chip>',
    '  <bce-chip>Flevoland</bce-chip>',
    '  <bce-chip>Friesland</bce-chip>',
    '  <bce-chip>Gelderland</bce-chip>',
    '  <bce-chip>Groningen</bce-chip>',
    '  <bce-chip>Limburg</bce-chip>',
    '  <bce-chip>North Brabant</bce-chip>',
    '  <bce-chip>North Holland</bce-chip>',
    '  <bce-chip>Overijssel</bce-chip>',
    '  <bce-chip>South Holland</bce-chip>',
    '  <bce-chip>Utrecht</bce-chip>',
    '  <bce-chip>Zeeland</bce-chip>',
    '</bce-select>',
    '<bce-select type="checkbox" label="Checkbox">',
    '  <bce-option>Drenthe</bce-option>',
    '  <bce-option>Flevoland</bce-option>',
    '  <bce-option>Friesland</bce-option>',
    '  <bce-option>Gelderland</bce-option>',
    '  <bce-option>Groningen</bce-option>',
    '  <bce-option>Limburg</bce-option>',
    '</bce-select>'
  ];

  private radio = [
    '<bce-select type="radio" label="Choice Chips" center>',
    '  <bce-chip>Drenthe</bce-chip>',
    '  <bce-chip>Flevoland</bce-chip>',
    '  <bce-chip>Friesland</bce-chip>',
    '  <bce-chip>Gelderland</bce-chip>',
    '  <bce-chip>Groningen</bce-chip>',
    '  <bce-chip>Limburg</bce-chip>',
    '  <bce-chip>North Brabant</bce-chip>',
    '  <bce-chip>North Holland</bce-chip>',
    '  <bce-chip>Overijssel</bce-chip>',
    '  <bce-chip>South Holland</bce-chip>',
    '  <bce-chip>Utrecht</bce-chip>',
    '  <bce-chip>Zeeland</bce-chip>',
    '</bce-select>',
    '<bce-select type="radio" label="Radio">',
    '  <bce-option>North Brabant</bce-option>',
    '  <bce-option>North Holland</bce-option>',
    '  <bce-option>Overijssel</bce-option>',
    '  <bce-option>South Holland</bce-option>',
    '  <bce-option>Utrecht</bce-option>',
    '  <bce-option>Zeeland</bce-option>',
    '</bce-select>'
  ];

  public render() {
    const urls = [
      'https://material.io/components/selection-controls/#checkboxes',
      'https://material.io/components/selection-controls/#radio-buttons'
    ];

    return (
      <main>
        <Title url={urls}>BCE Select</Title>

        <h4>Checkbox</h4>
        <bce-select type="checkbox" label="Filter Chips" center={true}>
          <bce-chip>Drenthe</bce-chip>
          <bce-chip>Flevoland</bce-chip>
          <bce-chip>Friesland</bce-chip>
          <bce-chip>Gelderland</bce-chip>
          <bce-chip>Groningen</bce-chip>
          <bce-chip>Limburg</bce-chip>
          <bce-chip>North Brabant</bce-chip>
          <bce-chip>North Holland</bce-chip>
          <bce-chip>Overijssel</bce-chip>
          <bce-chip>South Holland</bce-chip>
          <bce-chip>Utrecht</bce-chip>
          <bce-chip>Zeeland</bce-chip>
        </bce-select>
        <bce-select type="checkbox" label="Regular checkbox">
          <bce-option>Drenthe</bce-option>
          <bce-option>Flevoland</bce-option>
          <bce-option>Friesland</bce-option>
          <bce-option>Gelderland</bce-option>
          <bce-option>Groningen</bce-option>
          <bce-option>Limburg</bce-option>
        </bce-select>

        <h4>Radio</h4>
        <bce-select type="radio" label="Choice Chips" center={true}>
          <bce-chip>Drenthe</bce-chip>
          <bce-chip>Flevoland</bce-chip>
          <bce-chip>Friesland</bce-chip>
          <bce-chip>Gelderland</bce-chip>
          <bce-chip>Groningen</bce-chip>
          <bce-chip>Limburg</bce-chip>
          <bce-chip>North Brabant</bce-chip>
          <bce-chip>North Holland</bce-chip>
          <bce-chip>Overijssel</bce-chip>
          <bce-chip>South Holland</bce-chip>
          <bce-chip>Utrecht</bce-chip>
          <bce-chip>Zeeland</bce-chip>
        </bce-select>
        <bce-select type="radio" label="Regular Radio">
          <bce-option>North Brabant</bce-option>
          <bce-option>North Holland</bce-option>
          <bce-option>Overijssel</bce-option>
          <bce-option>South Holland</bce-option>
          <bce-option>Utrecht</bce-option>
          <bce-option>Zeeland</bce-option>
        </bce-select>

        <h4>Dropdown</h4>
        <p>TODO</p>

        <h4>Code</h4>
        <bce-code content={this.checkbox} language="html"></bce-code>
        <br />
        <bce-code content={this.radio} language="html"></bce-code>
      </main>
    );
  }
}
