function MessageOptionsToggleMenu({message}){

    const [showMenu, toggleMenu] = useToggle(false)
    const [showModal, toggleShowModal] = useToggle(false)
   

    function onClickToggleMenu(event){
        event.preventDefault()
        toggleMenu()
    }

    function onClickDeleteMsg(event){
        event.preventDefault()
        socket.emit('delete_msg', message.id)
    }

    function onClickToggleConfirmDeleteDialog(){
        toggleShowModal()
        toggleMenu()
    }

    function onClickChangeMsg(event){
        event.preventDefault()
    }

    return <React.Fragment>
                <div onMouseLeave={toggleMenu} className={`msg-toggle-menu dropdown`}>
                
                <div onClick={onClickToggleMenu} className="ellipsis-icon rounded-circle m-1"></div>
                
                {showMenu ? 
                    <ul className={`MessageOptionsToggleMenu d-block dropdown-menu`}>
                    <li><button className="dropdown-item" onClick={onClickToggleConfirmDeleteDialog}>Supprimer message</button></li>
                    <li><button className="dropdown-item" onClick={onClickChangeMsg}>Modifier message</button></li>
                    </ul> : 
                null}
                </div>
        

                {showModal && ReactDOM.createPortal(
                <Dialog open={showModal} onClose={toggleShowModal}>
                    <form id="connectSocketForm" className="m-auto shadow rounded p-3 bg-white border border-primary border-3" method="dialog">
                            <h5>Suppression du post</h5>
                            <button className="btn btn-primary fw-bold w-100 mt-3">Annuler</button>
                            <button className="btn btn-tertiary text-secondary mt-3 d-block fw-bold w-100" onClick={onClickDeleteMsg}>Confirmer suppression</button>
                    </form>
                </Dialog>, modalContainer)}
            </React.Fragment>
}