function handleSubmitForgotPass(e){
    e.preventDefault()

    console.log(e);
    
    const forgetpassuserEmail = document.getElementById('forgetpassuserEmail').value;

    fetch(`http://localhost:3000/user/request-forgot-password`, {
        method : "PATCH",
        headers:{
            "content-type" : "application/json"
        },
        body : JSON.stringify({
            Email : forgetpassuserEmail
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        if(data.Success){
            alert(data.msg)
        }else{
            alert(data.error)
        }
    })
    .catch(err => {
        console.log(err);
    })

}