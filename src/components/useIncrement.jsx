import {useState} from 'react'

function useIncrement({step}){
    const [i,stetI] = useState(0)

    step = step ?? 1

    function increment(){
        stetI(i => i + step)
    }

    return [
        i,
        increment
    ]
}

export default useIncrement