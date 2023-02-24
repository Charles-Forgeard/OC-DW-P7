function inputValidationAria({textOnInvalid, textOnInvalidCorrection, textOnValidCorrection, setHelpString}){
    const onInvalid = event =>{ 
        console.log('invalid event')
        event.target.classList.add('is-invalid','bg-danger')
        if(textOnInvalid){
            event.target.setCustomValidity(textOnInvalid);
        }
    }
    //'Le mot de passe doit contenir: au mois 8 caractères, 1 chiffre, 1 minuscule, 1 majuscule et un caractère spécial (!?*#&...)'
    const onInput = event =>{
        event.preventDefault()
        console.log('input event')
        event.target.setCustomValidity('');
        console.log(event.target.validity.valid)
        if(event.target.classList.contains('is-invalid')){
            event.target.checkValidity()
            if(event.target.validity.valid){
                event.target.classList.remove('bg-danger')
                event.target.classList.add('bg-success')
                setHelpString(helpString => {return {visible: true, className: 'text-success', innerText: textOnValidCorrection}})
            }else{
                setHelpString(helpString => {return {visible: true, className: 'text-danger', innerText: textOnInvalidCorrection}})
            }
        }
    }
    //'Format du mot de passe valide'
    //'Format du mot de passe invalide, il doit contenir au moins 8 caractères, 1 minuscule, 1 majuscule, 1 chiffre et 1 caractère spécial (!?*&$...)'

    const onBlur = event =>{
        event.preventDefault()
        console.log('blur event')
        console.log(event.target.validity.valid)
        event.target.setCustomValidity('')
        setHelpString(helpString => {return {visible: false}})
        event.target.classList.remove('bg-success')
        if(event.target.classList.contains('is-invalid')){
            if(event.target.validity.valid){
                event.target.classList.remove('is-invalid','bg-danger')
            }
        }else{
            if(!event.target.validity.valid){
                event.target.reportValidity()
            }
        }
    }

    return {onInvalid: onInvalid, onInput: onInput, onBlur: onBlur}
}

export default inputValidationAria