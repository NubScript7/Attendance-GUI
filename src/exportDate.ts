const dateInput: HTMLInputElement = document.querySelector("#date-input")!

export function setDateToCurrent() {
    const today = new Date();
    const formattedDate = today.toISOString().substring(0, 10);
    dateInput.value = formattedDate
}

export function getParsedDate() {
    let date = Date.parse(dateInput.value) || Date.now()

    const parsed = new Date()
    parsed.setTime(date)
    
    return parsed.toDateString()
}