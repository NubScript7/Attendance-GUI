import { RowItem } from "./RowItem";
import { ColItem } from "./ColItem";

export class GridManager {
    container: HTMLDivElement;
    rows: RowItem[];
    
    constructor() {
        const container = document.createElement("div")
        container.classList.add("container-fluid", "text-center")

        const defaultRow = new RowItem()

        this.container = container
        this.rows = []

        this.rows.push(
            defaultRow
        )
        container.appendChild(defaultRow.container)
    }

    getFreeRow() {
        for(const row of this.rows) {
            const size = row.items.length

            if (size < RowItem.maxSize) {
                return row
            }
        }

        return null
    }

    getOrCreateRow() {
        const freeRow = this.getFreeRow()

        if (freeRow == null) {
            const row = new RowItem()
            this.rows.push(row)
            this.container.appendChild(row.container)

            return row
        }

        return freeRow
    }

    createItem(label: string) {
        const col = new ColItem(label)
        // const row = this.getOrCreateRow()
        
        // row.append(col)
        this.rows[0].container.appendChild(col.element)


        // return {row, col}
        return {col}
    }

}