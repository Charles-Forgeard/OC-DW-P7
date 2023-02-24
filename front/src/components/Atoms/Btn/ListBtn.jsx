import {useRef, useEffect} from 'react'

function ListBtn({children, onClickEvent,autoFocus}){

    const refToFocus = useRef(null)

    useEffect(()=>{
        if(autoFocus){
            refToFocus?.current?.focus()
        }
    },[refToFocus?.current])
    
    return <button ref={refToFocus} className="btn text-secondary fw-bold px-2 py-0 d-inline-flex align-items-center rounded" onClick={onClickEvent}>{children}</button>
}

export default ListBtn