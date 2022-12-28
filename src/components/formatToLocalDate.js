function formatToLocalDate(timeStampInSec){
    const creationDate_In_MS = new Date(timeStampInSec * 1000)
    const local_creation_date = {date: creationDate_In_MS.toLocaleDateString(), time: creationDate_In_MS.toLocaleTimeString()}
    return local_creation_date
}

export default formatToLocalDate