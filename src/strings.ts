type StringsJSON = {
    exportNoticeCopyText: string,
    exportNoticeDownloadFile: string,
}

export const StringContent = {
    strings: {} as StringsJSON,
    hasParsed: false,

    async parseStrings() {
        const response = await fetch("/json/strings.json")
        const strings: StringsJSON = await response.json()

        this.strings = strings
        this.hasParsed = true
    }
}