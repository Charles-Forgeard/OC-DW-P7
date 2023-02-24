function AlertDiv({ children }) {
  return (
    <div className="text-danger" role="alert">
      {children}
    </div>
  )
}

export default AlertDiv
