function Dialog({ children, open, onClose, role }) {
  return (
    <dialog
      role={role}
      open={open}
      aria-modal={true}
      onClose={onClose}
      className="bg-transparent vh-100 vw-100 top-0 start-0 p-0 border-0"
      style={{
        '--bs-bg-opacity': 0.5,
        backdropFilter: 'blur(1px) grayscale(100%)',
        position: 'fixed',
        zIndex: '1030',
      }}
    >
      <div className="d-flex h-100">{children}</div>
    </dialog>
  )
}

export default Dialog
