function Dialog({children,open, onClose, role}){

    return <dialog role={role} open={open} aria-modal={true} onClose={onClose} className="bg-transparent vw-100 vh-100" style={{'--bs-bg-opacity': .5, 'backdropFilter': 'blur(1px) grayscale(100%)'}}>
        <div className="d-flex h-100">
            {children}
        </div>
    </dialog>
}

export default Dialog