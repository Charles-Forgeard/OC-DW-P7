import Picture from './Picture'
import { Fragment } from 'react'
import useToggle from '../../../hooks/useToggle.js'

function PictureLink({ url, altText, id, onClick, formats }) {
  const [isShow, toggleShow] = useToggle(true)

  function onClickToggle(event) {
    onClick(event)
    toggleShow()
  }
  return (
    <Fragment>
      {onClick && isShow ? (
        <button
          onClick={onClickToggle}
          className="p-0 border-0 bg-transparent"
          style={{ width: '100px', height: '100px' }}
        >
          <Picture
            id={id}
            url={url}
            altText={altText}
            formats={formats}
            className="w-100 h-100"
          />
        </button>
      ) : null}

      {!onClick && (
        <a
          href={url}
          target="_blanck"
          style={{ width: '100px', height: '100px' }}
          className="d-block"
        >
          <Picture
            url={url}
            altText={altText}
            id={id}
            className="w-100 h-100"
          />
        </a>
      )}
    </Fragment>
  )
}

export default PictureLink
