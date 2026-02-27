import { storageDB } from "./storage";

export type AttendanceItem = {
    firstName: string;
    lastName: string;
    middleName: string | null;
}

export type attendanceList = AttendanceItem[]

const DEFAULT_ATTENDANCE_LIST_URL = "json/attendanceList.json"

export class AttendanceLoader {
    attendance: attendanceList = []

    async startLoadProcess() {
        const hasImported = await storageDB.metadata.get(1);

        if(hasImported) {
            this.attendance = await storageDB.people.toArray();
            return
        }

        const response = await fetch(DEFAULT_ATTENDANCE_LIST_URL);
        const list: attendanceList = await response.json();

        this.attendance = list
    }
}
