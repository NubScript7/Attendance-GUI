import { type ExportOptions, ExportType } from "./export";
import { getParsedDate } from "./exportDate";
import { ItemState } from "./grid/ColItem";
import { type PersonState } from "./main";
import { exportDownload, exportedText, exportTextContainer, includeFormatCount, includeFormatDate, includeFormatLabel } from "./elements";

export function commonLabels(state: ItemState, size: number, content: string) {

    const header = []

    if (includeFormatLabel.checked) header.push(ItemState[state]);
    if (includeFormatDate.checked) header.push(getParsedDate());
    if (includeFormatCount.checked) header.push("count: " + size);

    if (content.length < 1) {
        content = "[NO DATA]"
    }

    return `${header.join(' : ')}\n\n${content}`
}

export function exportCommonJson(o: any) {
        const json = JSON.stringify(o);

        const blob = new Blob([json], {
            type: "application/json"
        });
        const url = URL.createObjectURL(blob);

        const date = new Date().toLocaleDateString();

        exportDownload.href = url;
        exportDownload.download = `attendance-${date}.json`;
        exportDownload.classList.remove("visually-hidden");
}

export function exportCommonText(text: string) {
    exportedText.value = text;
    exportTextContainer.classList.remove("visually-hidden");
}

export function hideAllExportElements() {
    exportDownload.classList.add("visually-hidden");
    exportTextContainer.classList.add("visually-hidden");
}

export function jsonFormat(settings: ExportOptions, state: PersonState[]) {
    const type = settings.type;

    hideAllExportElements();
    const data = state.map(({name, state}) => {
        return {
            name,
            state: ItemState[state]
        }
    })

    if (type == ExportType.FILE) {
        exportCommonJson(data)
    } else {
        const json = JSON.stringify(data, null, 2);
        exportCommonText(json)
    }
}

export function presentOnlyFormat(settings: ExportOptions, state: PersonState[]) {
    const type = settings.type;

    hideAllExportElements();
    const present = state.filter(person => person.state == ItemState.PRESENT)
        .map(person => person.name)
    const str = commonLabels(ItemState.PRESENT, present.length, present.join('\n'))

    if (type == ExportType.FILE) {
        exportCommonJson(present)
    } else {
        exportCommonText(str)
    }
}

export function absentOnlyFormat(settings: ExportOptions, state: PersonState[]) {
    const type = settings.type;

    hideAllExportElements();
    const absent = state.filter(person => person.state == ItemState.ABSENT)
        .map(person => person.name)
    const str = commonLabels(ItemState.ABSENT, absent.length, absent.join('\n'))
    
    if (type == ExportType.FILE) {
        exportCommonJson(absent)
    } else {
        exportCommonText(str)
    }
}

export function neutralOnlyFormat(settings: ExportOptions, state: PersonState[]) {
    const type = settings.type;

    hideAllExportElements();
    const neutral = state.filter(person => person.state == ItemState.UNSPECIFIED)
        .map(person => person.name)
    const str = commonLabels(ItemState.UNSPECIFIED, neutral.length, neutral.join('\n'))

    if (type == ExportType.FILE) {
        exportCommonJson(neutral)
    } else {
        exportCommonText(str)
    }
}