import { Modal } from "bootstrap";
import { htmlElement, optionAttendanceFile, optionLoadAtendanceModal, optionLoadAtendanceText, optionTheme, settingForm, settingToggleBtn, settingToggleBtnIcon } from "./elements";
import { StringContent } from "./strings";
import { storageDB } from "./attendance/storage";
import type { AttendanceItem } from "./attendance/loader";
import { refreshPage } from "./navigation";

const NO_VISIBLE = "d-none"

enum SettingBtnState {
    OPEN,
    CLOSE
}

const SettingBtnToIconState = {
    [SettingBtnState.CLOSE]: "bi-arrow-bar-right",
    [SettingBtnState.OPEN]: "bi-gear"
}

enum SettingFormState {
    VISIBLE,
    CLOSED
}

function setState(state: SettingFormState) {
    switch(state) {
        case SettingFormState.CLOSED:
            settingForm.classList.add(NO_VISIBLE);
            settingToggleBtnIcon.classList.replace(SettingBtnToIconState[SettingBtnState.CLOSE], SettingBtnToIconState[SettingBtnState.OPEN])
            break;
        
        case SettingFormState.VISIBLE:
            settingForm.classList.remove(NO_VISIBLE);
            settingToggleBtnIcon.classList.replace(SettingBtnToIconState[SettingBtnState.OPEN], SettingBtnToIconState[SettingBtnState.CLOSE])
            break;
    }
}

function toggleState(override?: SettingFormState) {
    if(override) {
        return setState(override)
    }

    const isClosed = settingForm.classList.contains(NO_VISIBLE);

    if (isClosed) {
        setState(SettingFormState.VISIBLE)
    } else {
        setState(SettingFormState.CLOSED)
    }
}

settingToggleBtn.addEventListener("click", () => toggleState())

// options

// theme option
enum ThemeState {
    LIGHT,
    DARK
}

const ThemeToStringState = {
    [ThemeState.DARK]: "light",
    [ThemeState.LIGHT]: "dark"
}

const DATA_BS_THEME = "bsTheme"

function setTheme(theme: ThemeState) {
    switch(theme) {
        case ThemeState.DARK:
            htmlElement.dataset[DATA_BS_THEME] = ThemeToStringState[ThemeState.DARK]
            break;
        case ThemeState.LIGHT:
            htmlElement.dataset[DATA_BS_THEME] = ThemeToStringState[ThemeState.LIGHT]
            break;
    }
}

function toggleTheme(override?: ThemeState) {
    if (override) {
        return setTheme(override)
    }

    const theme = htmlElement.dataset[DATA_BS_THEME]

    if (theme == ThemeToStringState[ThemeState.DARK]) {
        setTheme(ThemeState.LIGHT)
    } else {
        setTheme(ThemeState.DARK)
    }
}

optionTheme.addEventListener("change", () => toggleTheme())

// load attendance file

const JSON_FILE_TYPE = "application/json"
const optionInvalidFileModal = new Modal(optionLoadAtendanceModal)

function showImportNoticeModal(overrideReason?: string) {
    if (typeof overrideReason == "string" && overrideReason.length >= 1) {
        optionLoadAtendanceText.textContent = overrideReason
    } else {
        optionLoadAtendanceText.textContent = StringContent.strings.invalidJSONFileReadingError
    }
    optionInvalidFileModal.show()
}

function parseValidItems(json: string) {
    const parsed = JSON.parse(json);
    
    if(typeof parsed != "object" || !Array.isArray(parsed)) return false;

    const valid = [];
    for (const people of parsed) {
        const item: AttendanceItem = {
            lastName: people.lastName,
            firstName: people.firstName,
            middleName: people.middleName,
        }

        if (!item.lastName || !item.firstName) continue;
        valid.push(item);
    }

    return valid;
}

function loadAttendanceFile() {
    const files = optionAttendanceFile.files;
    const strings = StringContent.strings;
    
    if (files == null || files.length == 0) return;
    const file = files[0];
    console.log({files})

    if (file.type != JSON_FILE_TYPE) return showImportNoticeModal(strings.invalidJSONFileWrongType)

    try {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            if (typeof reader.result == "string") {
                const parsed = parseValidItems(reader.result);
                
                if (parsed) {
                    if (parsed.length < 1) return showImportNoticeModal("We could not parse a single item in the json list.")
                    
                    showImportNoticeModal(strings.importJSONFileSuccess)
                    
                    savePeopleToDB(parsed, file.name);
                    console.log("have you written yet?")

                    return;
                }
            }

            showImportNoticeModal(strings.stopSelectingRandomFile);
        })
        reader.readAsText(file)
    } catch {
        showImportNoticeModal(strings.invalidJSONFileReadingError)
    }
}

async function savePeopleToDB(list: AttendanceItem[], filename: string) {
    const normalized = list.map(e => {
        e.middleName = e.middleName ?? null
        return e
    })

    await storageDB.transaction("rw", [storageDB.people, storageDB.metadata], async () => {
        await storageDB.people.clear();
        await storageDB.people.bulkAdd(normalized);

        // update metadata
        const metadata = await storageDB.metadata.get(1);
        const impCount = metadata?.importCounter ?? 0;

        await storageDB.metadata.put({
            id: 1,
            lastUpdated: Date.now(),
            filename,
            totalPeople: normalized.length,
            importCounter: impCount + 1,
            hasImported: true
        })


    })
    
    
    const people = await storageDB.people.toArray();
    console.log({people});

    refreshPage();
}

optionAttendanceFile.addEventListener("change", () => loadAttendanceFile())
