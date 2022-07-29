document.getElementById("login").addEventListener('click', (e) => {
    e.preventDefault();

    const email= document.getElementById('email');
    const password = document.getElementById('password');

    const userDetails= {
        email: email.value,
        password: password.value
    };

    axios.post('https://localhost:3000/login', userDetails)
    .then(res => {
        if(res.status===200)
        {
            console.log(res.data);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userDetails', JSON.stringify(res.data.user));
            window.location.href= '../tracker/tracker.html';
        }
    })
    .catch(err => {
        alert(err);
    });
});

function forgotpassword()
{
    window.location.href= '../forgot-password/forgot.html';
}