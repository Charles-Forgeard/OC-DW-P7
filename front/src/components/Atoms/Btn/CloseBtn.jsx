function ButtonClose({onClick}){

    return <button aria-label="Close menu" type="button" title="Close Menu" className="btn bg-transparent position-absolute top-0 end-0 me-3 mh-100" onClick={onClick}>
                <span aria-hidden="true" className="fs-2">&times;</span>
            </button>
}

export default ButtonClose