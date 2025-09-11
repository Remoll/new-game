import Item from "gameObject/item/Item";

class Inventory {
    private isOpen: boolean = false;
    private uiContainer: HTMLElement;
    private items: Item[] = [];
    private selectedItemIndex: number;
    private itemsFromHotkeys: Item[] = [];

    constructor() {
        this.uiContainer = document.getElementById("ui");
    }

    private getHtml(items: Item[]): HTMLElement {
        this.items = items;
        const container = document.createElement("div");

        items.forEach((item, index) => {
            const p = document.createElement("p");
            if (index === 0) {
                p.style.border = "1px solid black";
            }
            p.id = `item-${index}`

            const span = document.createElement("span");
            span.textContent = item.getId();
            p.appendChild(span);

            container.appendChild(p);
        });

        return container;
    }

    private open(items: Item[]): void {
        const html = this.getHtml(items);
        this.selectedItemIndex = 0;
        this.uiContainer.appendChild(html);
        this.uiContainer.style.display = "block"
        this.isOpen = true;
    }

    private close(): void {
        this.uiContainer.style.display = "none"
        this.uiContainer.removeChild(this.uiContainer.firstChild);
        this.isOpen = false;
    }

    toggle(items: Item[]): void {
        if (this.isOpen) {
            this.close();
        } else {
            this.open(items || [])
        }
    }

    getIsOpen() {
        return this.isOpen;
    }

    private setSelectedItem(oldItemIndex, newItemIndex) {
        const oldItem = document.getElementById(`item-${oldItemIndex}`)
        const newItem = document.getElementById(`item-${newItemIndex}`)

        oldItem.style.border = "none";
        newItem.style.border = "1px solid black";

        this.selectedItemIndex = newItemIndex;
    }

    selectNext() {
        const oldItemIndex = this.selectedItemIndex;
        let newItemIndex;

        if (this.selectedItemIndex + 1 === this.items.length) {
            newItemIndex = 0
        } else {
            newItemIndex = this.selectedItemIndex + 1;
        }

        this.setSelectedItem(oldItemIndex, newItemIndex);
    }

    selectPrev() {
        const oldItemIndex = this.selectedItemIndex;
        let newItemIndex;

        if (this.selectedItemIndex === 0) {
            newItemIndex = this.items.length - 1
        } else {
            newItemIndex = this.selectedItemIndex - 1;
        }

        this.setSelectedItem(oldItemIndex, newItemIndex);
    }

    setHotkey(key: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 0) {
        const selectedItem = this.items[this.selectedItemIndex];

        const itemExistInHotkeyIndex = this.itemsFromHotkeys.findIndex((item) => item && item.getId() === selectedItem.getId())

        if (itemExistInHotkeyIndex > -1) {
            this.itemsFromHotkeys[itemExistInHotkeyIndex] = null
            const oldHotkeyElement = document.querySelector(`#hotkey-${itemExistInHotkeyIndex} div`);
            oldHotkeyElement.textContent = '';
        }

        this.itemsFromHotkeys[key] = selectedItem;

        const hotkeyElement = document.querySelector(`#hotkey-${key} div`);
        hotkeyElement.textContent = selectedItem.getId();
    }

    getItemFromHotkey(key: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 0) {
        return this.itemsFromHotkeys[key];
    }
}

export default Inventory;
