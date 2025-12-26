import type { ColItem } from "./ColItem";

export class RowItemLengthOverflowError extends Error {
    constructor(message: string) {
        super(message)
        
        this.message = message
        this.name = this.constructor.name
    }
}

export class RowItem {
    static maxSize = 5;
    items: ColItem[];
    container: HTMLDivElement;

    constructor(...elements: ColItem[]) {
        if (elements.length > 5) {
            throw new RowItemLengthOverflowError(`Cannot create a new instance, max size of ${RowItem.maxSize} exceeded.`);
        }

        const container = document.createElement("div")
        container.classList.add("row")

        this.items = []
        this.container = container
        
        for (const col of elements) {
            this.append(col)
        }
    }

    append(item: ColItem) {
        if (this.items.length >= RowItem.maxSize) {
            throw new RowItemLengthOverflowError("Cannot append new element, this container has reached max size.")
        }

        this.items.push(item)
        this.container.appendChild(item.element)
    }

    /**
     * A safe version of append, returns items that cant be added when size limit has been reached
     */
    appendSafe(colItems: ColItem[]) {
        const rest = []

        for (const item of colItems) {
            if (this.items.length < 5) {
                this.append(item)
            } else {
                rest.push(item)
            }
        }

        return rest
    }


}
