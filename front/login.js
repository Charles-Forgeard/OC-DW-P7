const loginBtn = document.querySelector('#login-btn')
const userEmailInput = document.querySelector('#userEmail')
const passwordInput = document.querySelector('#password')
const eyeShowPassword = document.querySelector('#eye-show-password')

console.log(window.location)

eyeShowPassword.addEventListener('click', (event) =>{
    event.preventDefault()
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password'
    eyeShowPassword.classList.toggle('eye-icon-show') 
})

loginBtn.addEventListener('click', event =>{
    event.preventDefault()

    let fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: userEmailInput.value,
            password: passwordInput.value
        })
    }
    console.log(window.location.origin);

    fetch(window.location.origin + 'auth/login', fetchOptions)
    .then(res => res.json())
    .then(({message}) =>{
        if(message === 'User account is active'){
            window.location = `${window.location.origin}/chat/`
        }else if(message === 'password update required'){
            const newPassword = prompt('Mise à jour du login demandée')
            if(newPassword != null && newPassword != '' && newPassword !== passwordInput.value){
                fetchOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: userEmailInput.value,
                        password: passwordInput.value,
                        newPassword: newPassword
                    })
                }
                fetch(window.location.origin + '/auth/active_user_account', fetchOptions)
                .then(()=>{
                    fetchOptions = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: userEmailInput.value,
                            password: newPassword
                        })
                    }
                    fetch(window.location.origin + '/auth/login', fetchOptions)
                    .then(res => res.json())
                    .then(({message}) =>{
                        message === 'access denied' ? alert('Accès refusé: échec de la mise à jour du mot de passe') : window.location = `${window.location.origin}/chat/`
                    })
                })
            }
        }else{
            alert(message)
        }
    })
    .catch(err => console.log(`erreur lors du fetch: ${err}`))
})

