import Dexie, { type Table } from "dexie";
import type { AttendanceItem } from "./loader";

const STORAGE_IDB_NAME = "AttendanceAppDB"
const STORAGE_IDB_VERSION = 1

export interface Person extends AttendanceItem {
    id?: number,
}

export interface Metadata {
    id: number,
    lastUpdated: number, 
    filename: string,
    totalPeople: number,
    importCounter: number,
    hasImported: boolean
}

export class StorageDB extends Dexie {
    metadata!: Table<Metadata, number>;
    people!: Table<Person, number>;

    constructor() {
        super(STORAGE_IDB_NAME);

        this.version(STORAGE_IDB_VERSION).stores(
            {
                people: "++id, lastName, firstName, middleName",
                metadata: "id"
            }
        )
    }
}

async function initStorage() {
    const exists = await storageDB.metadata.get(1);

    if (!exists) {
        await storageDB.metadata.put({
            id: 1,
            filename: "",
            lastUpdated: Date.now(),
            totalPeople: 0,
            importCounter: 0,
            hasImported: false
        })
    }
}

export const storageDB = new StorageDB();
initStorage();
