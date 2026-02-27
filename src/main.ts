import Clipboard from "clipboard"
import { Modal } from "bootstrap"
import { ExportFormat, getExportOptions } from "./export";
import { ItemState } from "./grid/ColItem";
import "./setting"

import "./styles/style"
import { absentOnlyFormat, jsonFormat, neutralOnlyFormat, presentOnlyFormat } from "./formats";
import { setDateToCurrent } from "./exportDate";
import { StringContent } from "./strings";
import { exportButton, copyTextButton, exportNoticeModal, exportedText, exportNoticeText, exportDownload } from "./elements";
import { initializeAttendaceList, people } from "./attendance/manager";

export type PersonState = {
    name: string
    state: ItemState
}

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
