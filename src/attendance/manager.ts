import type { ColItem } from "../grid/ColItem";
import { GridManager } from "../grid/GridManager";
import { AttendanceLoader } from "./loader";

export class AttendanceManager {
    constructor() {

    }
}

export const people: ColItem[] = []
const gridManager = new GridManager()
document.querySelector("#grid")?.appendChild(gridManager.container)

export const loader = new AttendanceLoader()
export async function initializeAttendaceList() {
    await loader.startLoadProcess()
    const json = loader.attendance

    if (typeof json == "object" && Array.isArray(json)) {
        const names = new Set()

        json.forEach(person => {
            let nickname = "[template]"

            if (names.has(person.firstName)) {
                nickname = person.lastName
            } else {
                nickname = person.firstName
            }
            names.add(nickname)

            const item = gridManager.createItem(nickname)
            people.push(item.col)

            item.col.button.addEventListener("click", () => item.col.toggle())
            
        })
    }
}
