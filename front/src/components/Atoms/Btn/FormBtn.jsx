function FormBtn({ type, children, onClick, className }) {
  type = type ?? 'button'
  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn btn-tertiary text-secondary fw-bold ${className}`}
    >
      {children}
    </button>
  )
}

export default FormBtn
