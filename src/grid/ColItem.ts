export enum ItemState {
    PRESENT,
    ABSENT,
    UNSPECIFIED,
}

export const itemStateToClass = {
    [ItemState.PRESENT]: "btn-outline-success",
    [ItemState.ABSENT]: "btn-outline-danger",
    [ItemState.UNSPECIFIED]: "btn-outline-light",
}

export class ColItem {
    element: HTMLDivElement;
    button: HTMLButtonElement;
    span: HTMLSpanElement;
    state: ItemState;
    label: string;


    constructor(label: string) {

        const container = document.createElement("div")
        // container.classList.add("col", "col-lg-3", "my-3")
        // container.classList.add("col", "my-3")
        container.classList.add("col-sm-6", "col-md-3", "my-3")

        const button = document.createElement("button")
        button.classList.add("btn", itemStateToClass[ItemState.UNSPECIFIED])
        container.appendChild(button)

        const span = document.createElement("span")
        span.textContent = label
        button.appendChild(span)

        this.element = container
        this.button = button
        this.span = span
        this.state = ItemState.UNSPECIFIED
        this.label = label
    }

    clearAllStateTags() {
        for (const state of Object.values(itemStateToClass)) {
            this.button.classList.remove(state)
        }
    }

    setToActive() {
        this.clearAllStateTags()

        const state = ItemState.PRESENT
        this.button.classList.add(itemStateToClass[state])
        this.state = state
    }

    setToInactive() {
        this.clearAllStateTags()

        const state = ItemState.ABSENT
        this.button.classList.add(itemStateToClass[state])
        this.state = state
    }

    toggle() {
        if (this.button.classList.contains(itemStateToClass[ItemState.PRESENT])) {
            this.setToInactive()
        } else {
            this.setToActive()
        }
    }
}