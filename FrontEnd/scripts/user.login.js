
const BaseURL = `http://localhost:3000`

const loginform = document.getElementById("login-user");

const useremail = document.getElementById("useremail");

const userpass = document.getElementById("userpass");

loginform.addEventListener("submit", function (e){

    e.preventDefault();

    document.getElementById('loginBtnHai').innerHTML = `<i class="fa fa-refresh fa-spin"></i> Login`
    
    userLogin();

});



function userLogin(){
    
    let user = {

        Email: useremail.value,

        Password: userpass.value

    }

    LoginNewUser(user);

}



function LoginNewUser(user){

    console.log("user--->",user)

    fetch(`${BaseURL}/user/login`,{
        method:'POST',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify(user)
    })
    .then((res)=>{

        return res.json()
    })

    .then((data)=>{

        console.log(data);
        document.getElementById('loginBtnHai').innerHTML = `Login`

        if(data.Success){

            localStorage.setItem("usertoken", data.token);

            alert(data.msg)

            location.href = "../index.html" 
        }

        else{

            alert(data.msg)

        }

    })
    .catch((err)=>{

        document.getElementById('loginBtnHai').innerHTML = `Login`

        alert(data.error);
        
    })
   

}



function HandleGoogleSignup(){

    document.getElementById('niteshgoogleauth').innerHTML = `<i class="fa fa-refresh fa-spin"></i> Google`;
    window.location.href = `${BaseURL}/user/auth/google`;

}