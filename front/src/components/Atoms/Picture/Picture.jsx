function Picture({ url, altText, formats, id, className, style }) {
  if (formats) {
    const fileName = url.split('.').slice(-1)
    const sources = []
    formats.forEach((format) =>
      sources.push(<source srcSet={`${fileName}.${format}`} />)
    )
  }
  return (
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
      />
    </picture>
  )
}

export default Picture
