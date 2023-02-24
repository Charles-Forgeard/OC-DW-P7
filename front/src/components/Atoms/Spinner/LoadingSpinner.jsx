function LoadingSpinner({ className, size }) {
  return (
    <div
      className={`text-primary spinner-border spinner-border-sm ${className}`}
      role="status"
      aria-hidden="true"
      style={{ width: `${size}rem`, height: `${size}rem` }}
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  )
}

export default LoadingSpinner
