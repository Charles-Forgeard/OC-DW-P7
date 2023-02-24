function ButtonPrimary({
  children,
  onClick,
  isAutoFocus,
  ariaLabel,
  type,
  buttonRef,
  className,
}) {
  type = type ?? 'button'
  return (
    <button
      className={`btn btn-primary fw-bold mt-3 text-white ${className}`}
      ref={buttonRef}
      type={type}
      onClick={onClick}
      autoFocus={isAutoFocus}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}

export default ButtonPrimary
