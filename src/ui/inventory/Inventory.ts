import Item from '@/gameObject/item/Item.ts';
import { InventorySlot } from './types.ts';

class Inventory {
  private isOpen: boolean = false;
  private uiContainer: HTMLElement;
  private items: Item[] = [];
  private selectedItemIndex: number;
  private itemsFromHotkeys: Item[] = [];

  constructor() {
    this.uiContainer = document.getElementById('ui');
  }

  private getHtml(): HTMLElement {
    const container = document.createElement('div');

    this.items.forEach((item, index) => {
      const p = document.createElement('p');
      if (index === 0) {
        p.style.border = '1px solid black';
      }
      p.id = `item-${index}`;

      const span = document.createElement('span');
      span.textContent = item.getType();
      p.appendChild(span);

      container.appendChild(p);
    });

    return container;
  }

  private open(items: Item[]): void {
    this.items = items;
    const html = this.getHtml();
    this.selectedItemIndex = 0;
    this.uiContainer.appendChild(html);
    this.uiContainer.style.display = 'block';
    this.isOpen = true;
  }

  private close(): void {
    this.uiContainer.style.display = 'none';
    this.uiContainer.removeChild(this.uiContainer.firstChild);
    this.isOpen = false;
  }

  toggle(items: Item[]): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open(items || []);
    }
  }

  getIsOpen(): boolean {
    return this.isOpen;
  }

  private setSelectedItem(oldItemIndex, newItemIndex) {
    const oldItem = document.getElementById(`item-${oldItemIndex}`);
    const newItem = document.getElementById(`item-${newItemIndex}`);

    oldItem.style.border = 'none';
    newItem.style.border = '1px solid black';

    this.selectedItemIndex = newItemIndex;
  }

  selectNext() {
    const oldItemIndex = this.selectedItemIndex;
    let newItemIndex;

    if (this.selectedItemIndex + 1 === this.items.length) {
      newItemIndex = 0;
    } else {
      newItemIndex = this.selectedItemIndex + 1;
    }

    this.setSelectedItem(oldItemIndex, newItemIndex);
  }

  selectPrev() {
    const oldItemIndex = this.selectedItemIndex;
    let newItemIndex;

    if (this.selectedItemIndex === 0) {
      newItemIndex = this.items.length - 1;
    } else {
      newItemIndex = this.selectedItemIndex - 1;
    }

    this.setSelectedItem(oldItemIndex, newItemIndex);
  }

  setHotkey(key: InventorySlot, newItem?: Item) {
    const selectedItem = newItem || this.items[this.selectedItemIndex];

    if (!selectedItem) {
      console.log('no item to bind to hotkey');
      return;
    }

    const itemExistInHotkeyIndex = this.itemsFromHotkeys.findIndex(
      (item) => item && item.getId() === selectedItem.getId()
    );

    if (itemExistInHotkeyIndex > -1) {
      this.itemsFromHotkeys[itemExistInHotkeyIndex] = null;
      const oldHotkeyElement = document.querySelector(
        `#hotkey-${itemExistInHotkeyIndex} div`
      );
      oldHotkeyElement.textContent = '';
    }

    this.itemsFromHotkeys[key] = selectedItem;

    const hotkeyElement = document.querySelector(`#hotkey-${key} div`);
    hotkeyElement.textContent = selectedItem.getType();
  }

  getItemFromHotkey(key: InventorySlot): Item {
    return this.itemsFromHotkeys[key];
  }

  removeItemFromHotkey(itemToRemove: Item) {
    const itemIndex = this.itemsFromHotkeys.findIndex(
      (itemFromHotkey) => itemFromHotkey?.getId() === itemToRemove.getId()
    );
    if (itemIndex === -1) {
      console.log('no item index in hotkey to remove');
      return;
    }
    this.itemsFromHotkeys[itemIndex] = undefined;
    const hotkeyElement = document.querySelector(`#hotkey-${itemIndex} div`);
    hotkeyElement.textContent = '';
  }
}

export default Inventory;
