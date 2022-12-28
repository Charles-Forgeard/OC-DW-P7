import {Fragment, useRef} from 'react'
import AddPictureSvg from './AddPictureSvg'
import useIncrement from './useIncrement'
import PictureLink from './PictureLink'

function InputFilePicture({picturesView, filesToSend, setFilesToSend, setPicturesInView}){

    const [fileId,incrementFileId] = useIncrement(0)

    const imgInput = useRef(null)

    function onChangeInput(event){
        event.preventDefault()
        console.log('input event')
        let { files } = event.target

        console.log(files)
    
        for(let i =0; i < files.length; i++){
    
            const file = event.target.files[i]
            const customFile ={
                localId: fileId,
                name: file.name,
                type: file.type,
                size: file.size,
                buffer: file
            }

            console.log(setFilesToSend)    

            setFilesToSend(filesToSend => [...filesToSend, customFile])

            function onClickRemoveInputFile(event){
                event.preventDefault()
                const newData = new DataTransfer()
                for (let i = 0; i < filesToSend.length; i++) {
                    if (filesToSend[i].id != event.target.id){
                        newData.items.add(filesToSend[i].buffer)
                    }else{
                        setFilesToSend(filesToSend => filesToSend.filter(customFile => customFile.id != event.target.id))
                    }
                }
                imgInput.current.files = newData.files // Assign the updates list
                event.target.remove()
            }
            
            const pictureComp = <PictureLink url={URL.createObjectURL(file)} key={fileId} pictureId={fileId} onClick={onClickRemoveInputFile}/>
            // const img = document.createElement('img')
            // img.className = 'imgPreview'
            //img.src = URL.createObjectURL(file)
    
            incrementFileId()
    
            setPicturesInView(picturesInView => [...picturesInView, pictureComp])
        }
    }


    return <Fragment>
        <label for="imgFileInput">
            <AddPictureSvg/>
        </label>
        <input id="imgFileInput" ref={imgInput} onChange={onChangeInput} type="file" class="opacity-0" multiple="true" accept="image/jpeg,image/png,image/svg+xml,image/webp,image/avif"></input>
    </Fragment>
}


export default InputFilePicture