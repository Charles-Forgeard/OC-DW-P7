function ButtonTertiary({
  children,
  onClick,
  isAutoFocus,
  ariaLabel,
  type,
  className,
  style,
}) {
  type = type ?? 'button'
  return (
    <button
      type={type}
      className={`btn btn-tertiary text-secondary mt-3 fw-bold ${
        className ?? ''
      }`}
      onClick={onClick}
      autoFocus={isAutoFocus}
      aria-label={ariaLabel}
      style={style}
    >
      {children}
    </button>
  )
}

export default ButtonTertiary
