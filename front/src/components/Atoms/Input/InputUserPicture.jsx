import { Fragment, useRef, useState } from 'react'
import AddPictureSvg from '../Icons/AddPictureSvg'
import DeletePictureSvg from '../Icons/DeletePictureSvg'
import PictureLink from '../Picture/PictureLink'
import TertiaryBtn from '../Btn/TertiaryBtn'

function InputFilePicture({
  setFileToSend,
  setPictureInView,
  setDeleteProfilePicture,
  label,
  deleteProfilePicture,
}) {
  const imgInput = useRef(null)

  function onClickRemoveInputFile(event) {
    event.preventDefault()
    setFileToSend(null)
    setPictureInView(null)
    imgInput.current.files = new DataTransfer().files
  }

  function onClickDeleteProfilePicture(event) {
    onClickRemoveInputFile(event)
    setDeleteProfilePicture((boolean) => !boolean)
  }

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

      const pictureComp = (
        <PictureLink
          url={URL.createObjectURL(file)}
          onClick={onClickRemoveInputFile}
        />
      )

      setPictureInView(pictureComp)
    }
  }

  return (
    <Fragment>
      <TertiaryBtn
        className="d-block my-2"
        onClick={() => {
          imgInput.current.click()
        }}
      >
        <AddPictureSvg />
        Télécharger un nouveau portrait
      </TertiaryBtn>
      <input
        id="imgFileInput"
        ref={imgInput}
        onChange={onChangeInput}
        type="file"
        className="opacity-0 position-absolute visually-hidden"
        multiple={false}
        accept="image/jpeg,image/png,image/svg+xml,image/webp,image/avif"
      ></input>
      <TertiaryBtn
        className={`d-block my-2 ${
          deleteProfilePicture ? 'btn-danger text-white' : ''
        }`}
        onClick={onClickDeleteProfilePicture}
      >
        <DeletePictureSvg />
        {deleteProfilePicture ? 'Annuler suppression' : 'Supprimer portrait'}
      </TertiaryBtn>
    </Fragment>
  )
}

export default InputFilePicture
