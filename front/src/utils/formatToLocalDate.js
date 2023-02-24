function formatToLocalDate(timeStampInSec) {
  const creationDateInMS = new Date(timeStampInSec * 1000)
  const localCreationDate = {
    date: creationDateInMS.toLocaleDateString(),
    time: creationDateInMS.toLocaleTimeString(),
  }
  return localCreationDate
}

export default formatToLocalDate
