
function ConfirmForm({title,text,action}){
    return <form className="m-auto shadow rounded p-3 bg-white border border-primary border-3" method="dialog">
        <h5>{title}</h5>
        {text && <p>{text}</p>}
        <button className="btn btn-primary fw-bold w-100 mt-3">Annuler</button>
        <button className="btn btn-tertiary text-secondary mt-3 d-block fw-bold w-100" onClick={action}>Confirmer</button>
    </form>
}

export default ConfirmForm