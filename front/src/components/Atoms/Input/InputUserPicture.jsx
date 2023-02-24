import { Fragment, useRef } from 'react'
import AddPictureSvg from '../Icons/AddPictureSvg'
import PictureLink from '../Picture/PictureLink'

function InputFilePicture({ setFileToSend, setPictureInView, label }) {
  const imgInput = useRef(null)

  async function onChangeInput(event) {
    event.preventDefault()
    console.log('input event')
    let { files } = event.target

    console.log(files)

    for (let i = 0; i < files.length; i++) {
      const file = event.target.files[i]

      const customFile = {
        name: file.name,
        type: file.type,
        size: file.size,
        buffer: file,
      }

      setFileToSend(customFile)

      async function onClickRemoveInputFile(event) {
        event.preventDefault()
        setFileToSend(null)
        setPictureInView(null)
        imgInput.current.files = new DataTransfer().files
      }

      const pictureComp = (
        <PictureLink
          url={URL.createObjectURL(file)}
          onClick={onClickRemoveInputFile}
        />
      )
      // const img = document.createElement('img')
      // img.className = 'imgPreview'
      //img.src = URL.createObjectURL(file)

      setPictureInView((picturesInView) => pictureComp)
    }
  }

  return (
    <Fragment>
      <label htmlFor="imgFileInput" className="d-block">
        {label}
        <AddPictureSvg />
      </label>
      <input
        id="imgFileInput"
        ref={imgInput}
        onChange={onChangeInput}
        type="file"
        className="opacity-0 position-absolute visually-hidden"
        multiple={false}
        accept="image/jpeg,image/png,image/svg+xml,image/webp,image/avif"
      ></input>
    </Fragment>
  )
}

export default InputFilePicture
