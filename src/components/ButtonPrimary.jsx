function ButtonPrimary({children, onClick, isAutoFocus, ariaLabel, type}){
    type = type ?? 'button'
    return <button className="btn btn-primary fw-bold w-100 mt-3" type={type} onClick={onClick} autoFocus={isAutoFocus} aria-label={ariaLabel}>{children}</button>
}

export default ButtonPrimary