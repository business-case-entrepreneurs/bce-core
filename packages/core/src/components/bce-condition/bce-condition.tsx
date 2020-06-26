import { Component, Element, h, Prop } from '@stencil/core';

import {
  ConditionGroup,
  ConditionInput,
  ConditionInputType,
  ConditionProperty,
  ConditionRow,
  ConditionTemplate
} from '../../models/condition';

// Temporary translations
const TRANSLATIONS = {
  match: {
    and: 'Alle',
    or: 'Een'
  },
  matchParagraph: {
    and: 'onderstaande condities zijn waar',
    or: 'van de onderstaande condities is waar'
  },
  check: {
    is: 'is',
    'is-before': 'is voor',
    'is-after': 'is na',
    'is-on-or-before': 'is op of voor',
    'is-on-or-after': 'is op of na',
    'is-empty': 'is leeg',
    'is-not-empty': 'is niet leeg',
    equals: 'is gelijk aan',
    'not-equals': 'is niet gelijk aan',
    contains: 'bevat',
    'not-contains': 'bevat niet',
    'starts-with': 'begint met',
    'not-starts-with': 'begint niet met',
    'ends-with': 'eindigd met',
    'not-ends-with': 'eindigd niet met'
  }
};

@Component({
  tag: 'bce-condition',
  styleUrl: 'bce-condition.scss',
  shadow: true
})
export class Condition {
  @Element()
  private el!: HTMLBceConditionElement;

  @Prop()
  public template: ConditionTemplate[] = [
    { name: 'date', label: 'Date', input: 'date' }
  ];

  @Prop()
  public value: ConditionGroup = {
    match: 'and',
    condition: [
      { data: this.template[0]?.name || '', property: '', check: '', value: '' }
    ]
  };

  private handleAddCondition = () => {
    const condition = [...this.value.condition, this.createRow()];
    const update = { ...this.value, condition };
    this.set(update);
  };

  // private handleAddGroup = () => {
  //   const condition = [...this.value.condition, this.createGroup()];
  //   const update = { ...this.value, condition };
  //   this.set(update);
  // };

  private handleRemoveCondition = (_: Event, path: number[]) => {
    const update = this.remove(path, this.value);
    this.set(update);
  };

  private handleInput = (event: Event, path: number[], name: string) => {
    const select = event.target as HTMLBceSelectElement;
    const value = (select.value as any) || '';
    const update = this.update(path, { [name]: value }, this.value);
    this.set(update);
  };

  // private createGroup(): ConditionGroup {
  //   return { match: 'and', condition: [this.createRow()] };
  // }

  private createRow(): ConditionRow {
    return {
      data: this.template[0]?.name || '',
      property: '',
      check: '',
      value: ''
    };
  }

  private remove(path: number[], current: ConditionGroup): ConditionGroup {
    if (!path.length) return current;

    const index = path[0];
    const next = current.condition[index];
    const condition = [...current.condition];
    if (path.length === 1 || !this.isGroup(next)) condition.splice(index, 1);
    else condition[index] = this.remove(path.slice(1), next);
    return { ...current, condition };
  }

  public set(value: ConditionGroup) {
    this.value = value;
    const event = new Event('input', { bubbles: true, composed: true });
    this.el.dispatchEvent(event);
  }

  private update<T extends ConditionGroup | ConditionRow>(
    path: number[],
    value: Partial<ConditionGroup | ConditionRow>,
    current: T
  ): T {
    if (!path.length || !this.isGroup(current)) return { ...current, ...value };

    const index = path[0];
    const next = current.condition[index];
    const condition = [...current.condition];
    condition[index] = this.update(path.slice(1), value, next);
    return { ...current, condition };
  }

  private isGroup(c: ConditionGroup | ConditionRow): c is ConditionGroup {
    return 'condition' in c;
  }

  renderCheck(row: ConditionRow, path: number[], type: ConditionInputType) {
    let checks: string[] = [];
    switch (type) {
      case 'date':
        checks = [
          'is',
          'is-before',
          'is-after',
          'is-on-or-before',
          'is-on-or-after',
          'is-empty',
          'is-not-empty'
        ];
        break;
      default:
        checks = [
          'equals',
          'not-equals',
          'contains',
          'not-contains',
          'starts-with',
          'not-starts-with',
          'ends-with',
          'not-ends-with',
          'is-empty',
          'is-not-empty'
        ];
        break;
    }

    return (
      <bce-select
        key={row.data}
        type="dropdown"
        value={row.check}
        onInput={e => this.handleInput(e, path, 'check')}
      >
        {checks.map(check => (
          <bce-option value={check}>
            {/* {check.replace(/-/g, ' ')} */}
            {(TRANSLATIONS.check as any)[check]}
          </bce-option>
        ))}
      </bce-select>
    );
  }

  renderInput(row: ConditionRow, path: number[], template?: ConditionInput) {
    if (!template) return;

    const type = typeof template === 'string' ? template : template.type;
    switch (type) {
      // case 'dropdown':
      //   return [
      //     this.renderCheck(row, path, type),
      //     <bce-select
      //       type={type}
      //       value={row.value}
      //       onInput={e => this.handleInput(e, path, 'value')}
      //     />
      //   ];
      default:
        return [
          this.renderCheck(row, path, type),
          <bce-input
            type={type}
            value={row.value}
            onInput={e => this.handleInput(e, path, 'value')}
          />
        ];
    }
  }

  renderProperty(
    row: ConditionRow,
    path: number[],
    template?: ConditionProperty[]
  ) {
    if (!template?.length) return;
    const current = template.find(i => i.name === row.property);

    return [
      <bce-select
        key={row.data}
        type="dropdown"
        value={row.property}
        onInput={e => this.handleInput(e, path, 'property')}
      >
        {template.map(v => (
          <bce-option value={v.name}>{v.label}</bce-option>
        ))}
      </bce-select>,
      current && this.renderInput(row, path, current.input)
    ];
  }

  renderRow(row: ConditionRow, path: number[], deletable: boolean) {
    const template = this.template.find(t => t.name === row.data);

    return (
      <li key={path.join('-') + '-' + row.data}>
        <bce-select
          type="dropdown"
          value={row.data}
          onInput={e => this.handleInput(e, path, 'data')}
        >
          {this.template.map(v => (
            <bce-option value={v.name}>{v.label || v.name}</bce-option>
          ))}
        </bce-select>

        {this.renderProperty(row, path, template?.property)}
        {this.renderInput(row, path, template?.input)}

        {deletable && (
          <bce-menu>
            <bce-button
              icon="fas:trash"
              onClick={e => this.handleRemoveCondition(e, path)}
            >
              Remove
            </bce-button>
          </bce-menu>
        )}
      </li>
    );
  }

  renderGroup(group: ConditionGroup, path: number[]) {
    const classes = { multiple: group.condition.length > 1 };

    return (
      <ul class={classes}>
        {group.condition.length > 1 && (
          <header>
            <bce-select
              type="dropdown"
              value={group.match}
              onInput={e => this.handleInput(e, path, 'match')}
            >
              <bce-option value="and">{TRANSLATIONS.match.and}</bce-option>
              <bce-option value="or">{TRANSLATIONS.match.or}</bce-option>
            </bce-select>
            <p>{TRANSLATIONS.matchParagraph[group.match]}</p>
          </header>
        )}

        {group.condition.map((row, i) =>
          this.isGroup(row)
            ? this.renderGroup(row, [...path, i])
            : this.renderRow(row, [...path, i], group.condition.length > 1)
        )}

        <footer>
          <bce-button
            design="text"
            icon="fas:plus"
            onClick={this.handleAddCondition}
          >
            Conditie Toevoegen
          </bce-button>

          {/* <bce-button
            design="text"
            icon="fas:layer-group"
            onClick={this.handleAddGroup}
          >
            Add Group
          </bce-button> */}
        </footer>
      </ul>
    );
  }

  render() {
    return [
      this.renderGroup(this.value, [])
      // Temporary state preview
      // <br />,
      // <bce-code
      //   language="js"
      //   value={JSON.stringify(this.state, undefined, 2)}
      //   key={JSON.stringify(this.state)}
      // />
    ];
  }
}
