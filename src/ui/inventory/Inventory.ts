import Item from "gameObject/item/Item";

class Inventory {
    private isOpen: boolean = false;
    private uiContainer: HTMLElement;

    constructor() {
        this.uiContainer = document.getElementById("ui");
    }

    private handleUse(item: Item) {
        console.log("handleUse: ", item);
    }

    private handleRemove(item: Item) {
        console.log("handleRemove: ", item);
    }

    private getHtml(items: Item[]): HTMLElement {
        const container = document.createElement("div");

        items.forEach(item => {
            const p = document.createElement("p");

            const span = document.createElement("span");
            span.textContent = item.getId();
            p.appendChild(span);

            const buttonUse = document.createElement("button")
            buttonUse.textContent = "USE";
            buttonUse.onclick = () => this.handleUse(item);
            p.appendChild(buttonUse);

            const buttonRemove = document.createElement("button")
            buttonRemove.textContent = "REMOVE";
            buttonRemove.onclick = () => this.handleRemove(item)
            p.appendChild(buttonRemove);

            container.appendChild(p);
        });

        return container;
    }

    private open(items: Item[]): void {
        const html = this.getHtml(items);
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
}

export default Inventory;
