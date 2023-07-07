import LoadingSpinner from '../Spinner/LoadingSpinner'

function ButtonPrimary({
  children,
  onClick,
  isAutoFocus,
  ariaLabel,
  type,
  buttonRef,
  className,
  style,
  showLoadingSpinner,
}) {
  type = type ?? 'button'
  return (
    <button
      className={`btn btn-primary fw-bold mt-3 text-white ${className ?? ''}`}
      style={style}
      ref={buttonRef}
      type={type}
      onClick={onClick}
      autoFocus={isAutoFocus}
      aria-label={ariaLabel}
    >
      {children}
      {showLoadingSpinner && (
        <LoadingSpinner
          className="text-white float-end"
          size="1.5"
          sizeUnit="em"
        />
      )}
    </button>
  )
}

export default ButtonPrimary
