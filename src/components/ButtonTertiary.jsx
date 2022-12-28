function ButtonTertiary({children, onClick, isAutoFocus, ariaLabel, type}){
    type = type ?? 'button'
    return <button type={type} className="btn btn-tertiary text-secondary mt-3 d-block fw-bold w-100" onClick={onClick} autoFocus={isAutoFocus} aria-label={ariaLabel}>{children}</button>
}

export default ButtonTertiary