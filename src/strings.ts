type StringsJSON = {
    exportNoticeCopyText: string,
    exportNoticeDownloadFile: string,
    invalidJSONFileWrongType: string,
    invalidJSONFileReadingError: string,
    genuinelyHowTheFuckYouGotThis: string,
    importJSONFileSuccess: string,
    stopSelectingRandomFile: string,
}

export const StringContent = {
    strings: {} as StringsJSON,
    hasParsed: false,

    async parseStrings() {
        const respString = await fetch("json/strings.json")
        const strings: StringsJSON = await respString.json()

        this.strings = strings

        this.hasParsed = true
    }
}
