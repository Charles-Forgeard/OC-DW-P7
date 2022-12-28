
function Picture ({url,altText,formats, pictureId}){
    if(formats){
        const fileName = url.split('.').slice(-1)
        const sources = []
        formats.forEach(format => sources.push(<source srcSet={`${fileName}.${format}`}/>))
    }
    return <picture>
                {formats}
                <img id={pictureId} src={url} alt={altText}/>
            </picture>
}

export default Picture