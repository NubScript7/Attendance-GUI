type StringsJSON = {
    exportNoticeCopyText: string,
    exportNoticeDownloadFile: string,
}

export type AttendanceItem = {
    firstName: string;
    lastName: string;
} & ({ hasMiddleName: true; middleName: string; } |
{ hasMiddleName: false; middleName: null; });

export type attendanceList = AttendanceItem[]

export const StringContent = {
    attendance: [] as attendanceList,
    strings: {} as StringsJSON,
    hasParsed: false,

    async parseStrings() {
        const respString = await fetch("json/strings.json")
        const strings: StringsJSON = await respString.json()

        const respList = await fetch("json/attendanceList.json")
        const list: attendanceList = await respList.json()

        this.strings = strings
        this.attendance = list

        this.hasParsed = true
    }
}