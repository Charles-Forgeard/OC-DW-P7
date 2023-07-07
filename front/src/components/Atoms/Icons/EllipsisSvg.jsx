function EllipsisSvg({ style, className, onClick, role }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      style={style}
      className={className ?? ''}
      role={role}
      onClick={onClick}
    >
      <path
        fill="currentColor"
        d="M16 12a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2m-6 0a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2m-6 0a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2Z"
      />
    </svg>
  )
}

export default EllipsisSvg
