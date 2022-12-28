function FormBtn({type, children, onClick}){
    type = type ?? 'button'
    return <button type={type} onClick={onClick} className="btn btn-tertiary text-secondary fw-bold">{children}</button>
}

export default FormBtn