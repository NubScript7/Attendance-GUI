import Clipboard from "clipboard"
import { Modal } from "bootstrap"
import { ExportFormat, getExportOptions } from "./export";
import { ItemState, type ColItem } from "./grid/ColItem";
import { GridManager } from "./grid/GridManager";

import "~bootstrap-icons/font/bootstrap-icons.scss"
import "./styles/default.scss"
import { absentOnlyFormat, jsonFormat, neutralOnlyFormat, presentOnlyFormat } from "./formats";
import { setDateToCurrent } from "./exportDate";
import { StringContent } from "./strings";
import { exportButton, copyTextButton, exportNoticeModal, exportedText, exportNoticeText, exportDownload } from "./elements";

export type PersonState = {
    name: string
    state: ItemState
}

const gridManager = new GridManager()
document.querySelector("#grid")?.appendChild(gridManager.container)

const people: ColItem[] = []
setDateToCurrent()

exportButton.addEventListener("click", () => {
    const setting = getExportOptions()

    const state: PersonState[] = []

    for (const person of people) {

        state.push(
            {
                name: person.label,
                state: person.state
            }
        )
    }

    switch (setting.format) {
        case ExportFormat.JSON:
            jsonFormat(setting, state)
            break;
        
        case ExportFormat.PRESENT:
            presentOnlyFormat(setting, state)
            break;
            
        case ExportFormat.ABSENT:
            absentOnlyFormat(setting, state)
            break;

        case ExportFormat.NEUTRAL:
            neutralOnlyFormat(setting, state)
            break;
    }
})

async function initializeAttendaceList() {
    const json = StringContent.attendance

    if (typeof json == "object" && Array.isArray(json)) {
        const names = new Set()

        json.forEach(person => {
            let nickname = "[template]"

            if (names.has(person.firstName)) {
                nickname = person.lastName
                names.add(nickname)
            } else {
                nickname = person.firstName
                names.add(nickname)
            }

            const item = gridManager.createItem(nickname)
            people.push(item.col)

            item.col.button.addEventListener("click", () => item.col.toggle())
            
        })
    }
}


async function setupStrings() {
    const strings = StringContent.strings

    copyTextButton.classList.remove("visually-hidden")
    const ENModal = new Modal(exportNoticeModal)
    const copyButton = new Clipboard(copyTextButton, {
        text: () => {
            return exportedText.value
        }
    })

    exportDownload.addEventListener("click", () => {
        exportNoticeText.textContent = strings.exportNoticeDownloadFile
        ENModal.show()
    })

    copyButton.on("success", () => {
        exportNoticeText.textContent = strings.exportNoticeCopyText
        ENModal.show()
    })

    console.log("Strings are loaded!")
}

(async function() {
    await StringContent.parseStrings()
    console.log("Loaded strings!")

    await setupStrings()
    console.log("Setup complete!")

    await initializeAttendaceList()
    console.log("Attendance list initialized!")
})();