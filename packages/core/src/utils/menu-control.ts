import { modulo } from './modulo';

type Item = HTMLBceChipElement | HTMLBceButtonElement | HTMLBceOptionElement;

type OnToggle = (active?: boolean) => Promise<void> | void;

type Trigger =
  | HTMLBceButtonElement
  | HTMLButtonElement
  | HTMLBceInputElement
  | HTMLInputElement;

interface MenuControlOptions {
  listbox?: boolean;
  onToggle: OnToggle;
  parent: HTMLElement;
  trigger: Trigger;
}

export class MenuControl {
  #elItems: Item[] = [];
  #elParent: HTMLElement;
  #elTrigger: Trigger;
  #listbox?: boolean;
  #onToggle: OnToggle;
  #selected?: Item;
  #value?: Item;

  private handleClickDocument = (event: MouseEvent) => {
    const parent = this.#elParent;
    if (parent.contains(event.target as Node)) return;
    if (event.composedPath().indexOf(parent) >= 0) return;

    this.toggle(false);
  };

  private handleClickTrigger = () => {
    this.toggle();
  };

  private handleClickItem = () => {
    this.toggle(false);
    this.selectTrigger();
  };

  private handleKeyDownTrigger = (event: Event) => {
    return this.handleKeyDown(event as KeyboardEvent, true);
  };

  private handleKeyDownItem = (event: Event) => {
    return this.handleKeyDown(event as KeyboardEvent, false);
  };

  constructor(options: MenuControlOptions) {
    this.#elParent = options.parent;
    this.#listbox = options.listbox;
    this.#elTrigger = options.trigger;
    this.#onToggle = options.onToggle;

    document.addEventListener('click', this.handleClickDocument);
    this.#elTrigger.addEventListener('click', this.handleClickTrigger);
    this.#elTrigger.addEventListener('keydown', this.handleKeyDownTrigger);
  }

  public dispose() {
    document.removeEventListener('click', this.handleClickDocument);
    this.#elTrigger.removeEventListener('click', this.handleClickTrigger);
    this.#elTrigger.removeEventListener('keydown', this.handleKeyDownTrigger);
  }

  public next(current = this.#selected) {
    const e = this.#elItems.filter(e => !e.disabled);
    const i = current ? this.#elItems.indexOf(current) : -1;
    const target = current ? e[modulo(i + 1, e.length)] : e[0];
    this.selectItem(target);
  }

  public prev(current = this.#selected) {
    const e = this.#elItems.filter(e => !e.disabled);
    const i = current ? this.#elItems.indexOf(current) : -1;
    const target = current ? e[modulo(i - 1, e.length)] : e[e.length - 1];
    this.selectItem(target);
  }

  public setItems(items: Item[]) {
    const role = this.#listbox ? 'option' : 'menuitem';
    this.#elItems = items;

    for (const item of items) {
      item.removeEventListener('keydown', this.handleKeyDownItem);
      item.removeEventListener('click', this.handleClickItem);

      item.addEventListener('keydown', this.handleKeyDownItem);
      item.addEventListener('click', this.handleClickItem);

      item.a11yRole = item.a11yRole || role;
      item.tabIndex = item.tabIndex ?? -1;
    }
  }

  public setValue(item: Item) {
    this.#value = item;
  }

  private getNative(
    el: Trigger | Item
  ): HTMLBceButtonElement | HTMLBceInputElement {
    return el.shadowRoot
      ? (el.shadowRoot.querySelector('button, input') as any)
      : el;
  }

  private handleKeyDown(event: KeyboardEvent, trigger: boolean) {
    switch (event.key) {
      case 'Tab':
        return this.toggle(false);
      case 'Enter':
        const target = event.target as Trigger | Item | null;
        if (this.isDropdownOption(target)) this.getNative(target).click();
      case ' ':
        if (!trigger) return;
        if (this.#value) this.selectItem(this.#value);
        else this.next();
        event.preventDefault();
        return;
      case 'Esc':
      case 'Escape':
        this.toggle(false);
        this.selectTrigger();
        return;
      case 'End':
        if (!trigger) return;
        const last = this.#elItems[this.#elItems.length - 1];
        return this.selectItem(last);
      case 'Home':
        if (!trigger) return;
        const first = this.#elItems[0];
        return this.selectItem(first);
      case 'Left':
      case 'ArrowLeft':
        if (trigger && this.#listbox) return this.toggle(true);
      case 'Up':
      case 'ArrowUp':
        return this.prev(this.#selected || this.#value);
      case 'Right':
      case 'ArrowRight':
        if (trigger && this.#listbox) return this.toggle(true);
      case 'Down':
      case 'ArrowDown':
        return this.next(this.#selected || this.#value);
      default:
        if (trigger && this.#listbox) return this.toggle(true);
    }
  }

  private isDropdownOption(
    el: Trigger | Item | null
  ): el is HTMLBceOptionElement {
    return !!el && el.type === 'dropdown';
  }

  private selectItem(item?: Item) {
    if (!item) return;

    this.toggle(true);
    this.#selected = item;
    setTimeout(() => this.getNative(item).focus(), 100);
  }

  private selectTrigger() {
    this.toggle(false);
    this.getNative(this.#elTrigger).focus();
  }

  private toggle(active?: boolean) {
    this.#selected = undefined;
    this.#onToggle(active);
  }
}
