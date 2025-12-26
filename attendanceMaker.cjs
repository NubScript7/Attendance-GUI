"use strict"

const prompt = require("prompt-sync")()
const { writeFileSync } = require("node:fs")
const { join } = require("node:path")

function toCapitalCase(str) {
    let string = null

    if(typeof str == "string") {
        string = str.toLowerCase().split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    }
    
    return string
}

let isDone = false

/**
 * the person object must be:
 * firstName: String
 * lastName: String
 * middleName: String | null
 * hasMiddleName: Boolean
 */
const peopleList = []

console.log("Attendance GUI list compiler")
console.log("type '.save' too save & exit the program.")

function promptWithCancel(text) {
    const reply = prompt(text)
    if(reply == ".save") {
        isDone = true
        throw new Error("save and exit")
    }
    return reply
}

function createPeople() {
    while(!isDone) {
        const lastName = promptWithCancel("Enter last name: ")
        const firstName = promptWithCancel("Enter first name: ")
        const middleName = promptWithCancel("Enter middle name: ")
    
        const person = {}
    
        person.lastName = toCapitalCase(lastName)
        person.firstName = toCapitalCase(firstName)
    
        console.log(person)
    
        if(typeof middleName == "string" && middleName.length >= 1) {
            person.middleName = toCapitalCase(middleName)
        } else {
            person.middleName = null
        }
    
        person.hasMiddleName = person.middleName != null
    
        peopleList.push(person)
        console.log("\n\n")
    }
}

try {
    createPeople()
} catch(e) {
    console.log("returning...")
}

let fileName = prompt("file name (blank for default): ") || "attendanceList.json"


writeFileSync(join(__dirname, fileName), JSON.stringify(peopleList))
console.log("program done.")