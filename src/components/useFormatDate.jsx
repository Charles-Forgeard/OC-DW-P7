import {useState} from 'react'
import formatToLocalDate from './formatToLocalDate.js'

function useFormatDate(timeStampInSec){

    const [formatedDate, setFormatedDate] = useState(timeStampInSec && formatToLocalDate(timeStampInSec))

    function setNewDate(newTimeStampInSec){
        console.log(`New timeStamp: ${newTimeStampInSec}`)
        console.log(formatToLocalDate(newTimeStampInSec))
        setFormatedDate(formatedDate => formatToLocalDate(newTimeStampInSec))
    }

    return [formatedDate, setNewDate]
}

export default useFormatDate