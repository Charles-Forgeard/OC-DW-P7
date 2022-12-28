import Picture from './Picture.jsx'
import {Fragment} from 'react'
import useToggle from './useToggle.jsx'

function PictureLink({url, altText, pictureId, onClick}){

    const [isShow, toggleShow] = useToggle(true)

    function onClickToggle(event){
        onClick(event)
        toggleShow()
    }

    return <Fragment>
                {onClick && isShow ? <button onClick={onClickToggle} className="p-0 border-0 bg-transparent" style={{'width' : '100px', 'height' : '100px'}}><Picture pictureId={pictureId} url={url} altText={altText}/></button>
                 : null}
                
                {!onClick && <a href={url} target="_blanck">
                        <Picture url={url} altText={altText}/>
                    </a>}
            </Fragment>
}

export default PictureLink
