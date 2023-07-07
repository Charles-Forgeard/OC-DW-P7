function LoadingSpinner({ className, size, sizeUnit }) {
  return (
    <div
      className={`text-primary spinner-border spinner-border-sm ${
        className ?? ''
      }`}
      role="status"
      aria-hidden="true"
      style={{
        width: `${size}${sizeUnit ?? 'rem'}`,
        height: `${size}${sizeUnit ?? 'rem'}`,
      }}
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  )
}

export default LoadingSpinner
