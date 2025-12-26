import { getParsedDate } from "./exportDate";

export enum ExportFormat {
    JSON,
    ABSENT,
    PRESENT,
    NEUTRAL,
}

export const exportFormatMap: Record<string, ExportFormat> = {
    "json": ExportFormat.JSON,
    "absent": ExportFormat.ABSENT,
    "present": ExportFormat.PRESENT,
    "neutral": ExportFormat.NEUTRAL,
}

export enum ExportType {
    FILE,
    TEXT
}

export type ExportOptions = {
    date: string,
    type: ExportType | string,
    format: ExportFormat | string
}

// const exportTypeFile: HTMLInputElement = document.querySelector("#export-type-file")!
const exportTypeText: HTMLInputElement = document.querySelector("#export-type-text")!

const exportFormatSelect: HTMLSelectElement = document.querySelector("#export-format")!

export function getExportType() {
    let type: ExportType
    
    if(exportTypeText.checked) {
        type = ExportType.TEXT
    } else {
        type = ExportType.FILE
    }

    return type
}

export function getExportFormat() {
    const formatValue = exportFormatSelect.value
    for (const option of Object.keys(exportFormatMap)) {
        if (formatValue == option) {
            return exportFormatMap[option]
        }
    }

    return ExportFormat.JSON
}

export function getExportOptions() {

    const option: ExportOptions = {
        date: getParsedDate(),
        type: getExportType(),
        format: getExportFormat()
    }

    return option
}