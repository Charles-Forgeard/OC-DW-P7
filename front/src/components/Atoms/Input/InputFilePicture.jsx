import { Fragment, useRef } from 'react'
import AddPictureSvg from '../Icons/AddPictureSvg'
import PictureLink from '../Picture/PictureLink'

function setKey(key, keyArray) {
  if (keyArray.indexOf(key) !== -1) {
    return setKey(++key, keyArray)
  } else {
    return key
  }
}

function InputFilePicture({ picturesComp, setFilesToSend, setPicturesInView }) {
  const imgInputRef = useRef(null)

  async function onChangeInput(event) {
    event.preventDefault()
    // console.log('input event')
    let { files } = event.target

    console.log(files)

    const picturesCompKeys = picturesComp.map((comp) => comp.key)

    for (let i = 0; i < files.length; i++) {
      const file = event.target.files[i]

      console.log('fileId: ', JSON.stringify(i))

      const localId = setKey(i, picturesCompKeys)

      const customFile = {
        localId: localId.toString(),
        name: file.name,
        type: file.type,
        size: file.size,
        buffer: file,
      }

      console.log(customFile)

      setFilesToSend((filesToSend) => [...filesToSend, customFile])

      function onClickRemoveInputFile(event) {
        event.preventDefault()
        const newData = new DataTransfer()
        setFilesToSend((filesToSend) => {
          for (let i = 0; i < filesToSend.length; i++) {
            if (filesToSend[i].localId !== event.target.id) {
              newData.items.add(filesToSend[i].buffer)
            } else {
              setFilesToSend((filesToSend) =>
                filesToSend.filter((customFile) => {
                  return customFile.localId !== event.target.id
                })
              )
            }
          }
          return filesToSend
        })
        imgInput.current.files = newData.files // Assign the updates list
        event.target.remove()
      }

      const pictureComp = (
        <PictureLink
          url={URL.createObjectURL(file)}
          key={parseInt(localId)}
          id={localId}
          pictureId={localId}
          onClick={onClickRemoveInputFile}
        />
      )
      // const img = document.createElement('img')
      // img.className = 'imgPreview'
      //img.src = URL.createObjectURL(file)

      setPicturesInView((picturesInView) => [...picturesInView, pictureComp])
    }
  }

  return (
    <Fragment>
      <label htmlFor="imgFileInput" className="d-block">
        {/* <img src={URL.createObjectURL(file)} /> */}
        <AddPictureSvg />
      </label>
      <input
        id="imgFileInput"
        ref={imgInputRef}
        onChange={onChangeInput}
        type="file"
        className="opacity-0 position-absolute visually-hidden"
        multiple={true}
        accept="image/jpeg,image/png,image/svg+xml,image/webp,image/avif"
      ></input>
    </Fragment>
  )
}

export default InputFilePicture
