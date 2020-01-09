import * as Preact from 'preact';

import Title from '../components/title';

export default class Chip extends Preact.Component {
  private action = [
    '<bce-chip>Action Chip</bce-chip>',
    '<bce-chip icon="square">Icon</bce-chip>',
    '<bce-chip thumbnail="#6f42c1">Color</bce-chip>',
    '<bce-chip thumbnail="https://via.placeholder.com/24">Image</bce-chip>',
    '<bce-chip icon="square" thumbnail="https://via.placeholder.com/24">Image + Icon</bce-chip>'
  ];

  private choice = [
    '<bce-chip type="choice" name="choice1">Choice Chip X</bce-chip>',
    '<bce-chip type="choice" name="choice1">Choice Chip Y</bce-chip>',
    '<br />',
    '<bce-chip type="choice" name="choice2">Option 1</bce-chip>',
    '<bce-chip type="choice" name="choice2">Option 2</bce-chip>',
    '<bce-chip type="choice" name="choice2">Option 3</bce-chip>',
    '<br />',
    '<bce-chip type="choice" name="choice3">Option A</bce-chip>',
    '<bce-chip type="choice" name="choice3">Option B</bce-chip>',
    '<bce-chip type="choice" name="choice3">Option C</bce-chip>'
  ];

  private filter = [
    '<bce-chip type="filter">',
    '  Filter Chip',
    '</bce-chip>',
    '<bce-chip type="filter" icon="square">',
    '  Custom Icon',
    '</bce-chip>',
    '<bce-chip type="filter" thumbnail="#3e8ebf">',
    '  Color Chip',
    '</bce-chip>',
    '<bce-chip type="filter" thumbnail="https://via.placeholder.com/24">',
    '  Image Chip',
    '</bce-chip>'
  ];

  public render() {
    return (
      <main>
        <Title url="https://material.io/components/chips/">BCE Chip</Title>
        <h4>Action</h4>
        <div>
          <bce-chip>Action Chip</bce-chip>
          <bce-chip icon="square">Icon</bce-chip>
          <bce-chip thumbnail="#6f42c1">Color</bce-chip>
          <bce-chip thumbnail="https://via.placeholder.com/24">Image</bce-chip>
          <bce-chip icon="square" thumbnail="https://via.placeholder.com/24">
            Image + Icon
          </bce-chip>
        </div>
        <bce-code content={this.action} language="html"></bce-code>

        <h4>Choice</h4>
        <div>
          <bce-chip type="choice" name="choice1">
            Choice Chip X
          </bce-chip>
          <bce-chip type="choice" name="choice1">
            Choice Chip Y
          </bce-chip>
          <br />
          <bce-chip type="choice" name="choice2">
            Option 1
          </bce-chip>
          <bce-chip type="choice" name="choice2">
            Option 2
          </bce-chip>
          <bce-chip type="choice" name="choice2">
            Option 3
          </bce-chip>
          <br />
          <bce-chip type="choice" name="choice3">
            Option A
          </bce-chip>
          <bce-chip type="choice" name="choice3">
            Option B
          </bce-chip>
          <bce-chip type="choice" name="choice3">
            Option C
          </bce-chip>
        </div>
        <bce-code content={this.choice} language="html"></bce-code>

        <h4>Filter</h4>
        <div>
          <bce-chip type="filter">Filter Chip</bce-chip>
          <bce-chip type="filter" icon="square">
            Custom Icon
          </bce-chip>
          <bce-chip type="filter" thumbnail="#3e8ebf">
            Color Chip
          </bce-chip>
          <bce-chip type="filter" thumbnail="https://via.placeholder.com/24">
            Image Chip
          </bce-chip>
        </div>
        <bce-code content={this.filter} language="html"></bce-code>

        <h4>Input</h4>
        <p>Unimplemented</p>
      </main>
    );
  }
}
