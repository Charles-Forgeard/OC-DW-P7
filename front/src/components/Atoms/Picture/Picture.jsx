import LoadingSpinner from '../Spinner/LoadingSpinner'
import { useState } from 'react'

function Picture({ url, altText, formats, id, className, style, ariaHidden }) {
  if (formats) {
    const fileName = url.split('.').slice(-1)
    const sources = []
    formats.forEach((format) =>
      sources.push(<source srcSet={`${fileName}.${format}`} />)
    )
  }

  const [imgIsLoading, setImgIsLoading] = useState(true)

  const handleImgLoading = (e) => {
    e.preventDefault()
    setImgIsLoading(false)
  }

  return (
    <>
      <picture
        className={`d-flex position-relative justify-content-center align-items-center ${className}`}
        style={style}
      >
        {formats}
        <img
          id={id}
          className="d-block rounded w-100 h-100 object-fit-contain flex-shrink-0 shadow"
          src={url}
          alt={altText}
          onLoad={handleImgLoading}
          aria-hidden={ariaHidden}
        />
        {imgIsLoading && (
          <LoadingSpinner
            className={'position-absolute'}
            size="50"
            sizeUnit="%"
          />
        )}
      </picture>
    </>
  )
}

export default Picture
