function forgotpassword(e)
{
    e.preventDefault();
    const form= new FormData(e.target);

    const userDetails= {
        email: form.get("email")
    }

    console.log(userDetails);

    axios.post('http://localhost:3000/forgotpassword', userDetails)
    .then(response => {
        if(response.status===202)
        {
            alert('Mail sent successfully!');
        }
        else
        {
            throw new Error('Something went wrong!');
        }
    })
    .catch(err => {
        alert(err);
    });
}