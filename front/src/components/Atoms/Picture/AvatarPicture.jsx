function AvatarPicture({ width, src, alt, className }) {
  return (
    <picture
      className={`flex-shrink-0 overflow-hidden ${className ?? ''}`}
      style={width ? { width: width, height: width } : { minWidth: '32px' }}
    >
      <img src={src} alt={alt} className="rounded-3 w-100 object-fit-contain" />
    </picture>
  )
}

export default AvatarPicture
