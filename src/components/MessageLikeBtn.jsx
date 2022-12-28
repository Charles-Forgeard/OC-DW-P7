import LikeHeartBtn from './LikeHeartBtn.jsx'
import useToggle from './useToggle.jsx'
import socket from '../index.js'

import React, { useState, useEffect, useCallback} from 'react';

function MessageLikeBtn({message}){
    const [likeValue, setLikeValue] = useState(message.likes ?? 0)
    const [btnIsPressed, pressBtn] = useToggle(message.liked_by_user ? true : false)

    const increment = useCallback(()=>{
        setLikeValue(like => like + 1)
    },[])

    const decrement = useCallback(()=>{
        setLikeValue(like => like - 1)
    },[])

    useEffect(()=>{
        socket.on('msg:like', ({postID, operation})=>{
            if(postID === message.id){
                console.log({postID, operation})
                if(operation === 'increment'){
                    increment()
                }else{
                    decrement()
                }
            } 
        })
        return ()=>socket.off('msg:like')
    },[])

    function onlikesClickSendLike(event){
        event.preventDefault()
        pressBtn()
        socket.emit('msg:like', message.id)
    }

    return <div className="heart-container">
        <button href="#" onClick={onlikesClickSendLike} className="heart-btn" aria-label="Like post" aria-pressed={btnIsPressed}>
            <LikeHeartBtn color={btnIsPressed ? 'red' : '#FFD7D7'}/>
        </button>
        {likeValue > 0 ? <div className="Like_count">{likeValue}</div> : null}
    </div>
    
    

}

export default MessageLikeBtn