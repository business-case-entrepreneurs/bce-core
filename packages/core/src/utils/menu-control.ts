import { modulo } from './modulo';

type OnToggle = (active?: boolean) => Promise<void> | void;

type AnyButton = HTMLBceButtonElement | HTMLButtonElement;

export class MenuControl {
  #items: HTMLBceButtonElement[] = [];
  #onToggle: OnToggle;
  #parent: HTMLElement;
  #selected?: HTMLBceButtonElement;
  #trigger: AnyButton;

  private handleClickDocument = (event: MouseEvent) => {
    const parent = this.#parent;
    if (parent.contains(event.target as Node)) return;
    if ('path' in event && (event as any).path.indexOf(parent) >= 0) return;

    this.toggle(false);
  };

  private handleClickTrigger = () => {
    this.toggle();
  };

  private handleClickItem = () => {
    this.toggle(false);
    this.select(this.#trigger);
  };

  private handleKeyDownTrigger = (event: Event) => {
    return this.handleKeyDown(event as KeyboardEvent, true);
  };

  private handleKeyDownItem = (event: Event) => {
    return this.handleKeyDown(event as KeyboardEvent, false);
  };

  private get selectedIndex() {
    return this.#selected ? this.#items.indexOf(this.#selected) : -1;
  }

  constructor(parent: HTMLElement, trigger: AnyButton, onToggle: OnToggle) {
    this.#onToggle = onToggle;
    this.#parent = parent;
    this.#trigger = trigger;

    document.addEventListener('click', this.handleClickDocument);
    this.#trigger.addEventListener('click', this.handleClickTrigger);
    this.#trigger.addEventListener('keydown', this.handleKeyDownTrigger);
  }

  public dispose() {
    document.removeEventListener('click', this.handleClickDocument);
    this.#trigger.removeEventListener('click', this.handleClickTrigger);
    this.#trigger.removeEventListener('keydown', this.handleKeyDownTrigger);

    for (const item of this.#items) {
      item.removeEventListener('keydown', this.handleKeyDownItem);
      item.removeEventListener('click', this.handleClickItem);
    }
  }

  public next() {
    const target = this.#selected
      ? this.#items[modulo(this.selectedIndex + 1, this.#items.length)]
      : this.#items[0];
    this.select(target);
  }

  public prev() {
    const target = this.#selected
      ? this.#items[modulo(this.selectedIndex - 1, this.#items.length)]
      : this.#items[this.#items.length - 1];
    this.select(target);
  }

  public setItems(items: HTMLBceButtonElement[]) {
    this.#items = items;

    for (const item of items) {
      item.removeEventListener('keydown', this.handleKeyDownItem);
      item.removeEventListener('click', this.handleClickItem);

      item.addEventListener('keydown', this.handleKeyDownItem);
      item.addEventListener('click', this.handleClickItem);

      item.a11yRole = item.a11yRole || 'menuitem';
      item.a11yTabIndex = item.a11yTabIndex ?? -1;
    }
  }

  private handleKeyDown(event: KeyboardEvent, trigger: boolean) {
    switch (event.keyCode) {
      case 9: // Tab
        return this.toggle(false);
      case 13: // Enter
      case 32: // Space
        if (!trigger) return;
        this.next();
        event.preventDefault();
        return;
      case 27: // Escape
        this.toggle(false);
        this.select(this.#trigger);
        return;
      case 35: // End
        return !trigger && this.select(this.#items[this.#items.length - 1]);
      case 36: // Home
        return !trigger && this.select(this.#items[0]);
      case 37: // Arrow Left
      case 38: // Arrow Up
        return this.prev();
      case 39: // Arrow Right
      case 40: // Arrow Down
        return this.next();
    }
  }

  private isBceButton(el: AnyButton): el is HTMLBceButtonElement {
    return 'design' in el;
  }

  private select(el: AnyButton) {
    if (!el) return;

    if (this.isBceButton(el) && el.a11yRole === 'menuitem') {
      this.toggle(true);
      this.#selected = el;
    }

    if (el.shadowRoot) el.shadowRoot.querySelector('button')!.focus();
    else el.focus();
  }

  private toggle(active?: boolean) {
    this.#selected = undefined;
    this.#onToggle(active);
  }
}
