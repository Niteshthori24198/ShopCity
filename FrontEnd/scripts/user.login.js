
const BaseURL = `http://localhost:3000`

const loginform = document.getElementById("login-user");

const useremail = document.getElementById("useremail");

const userpass = document.getElementById("userpass");

loginform.addEventListener("submit", function (e) {

    e.preventDefault();

    document.getElementById('loginBtnHai').innerHTML = `<i class="fa fa-refresh fa-spin"></i> Login`
    document.getElementById('loginBtnHai').disabled = true;

    userLogin();

});



function userLogin() {

    let user = {

        Email: useremail.value,

        Password: userpass.value

    }

    LoginNewUser(user);

}



function LoginNewUser(user) {

    console.log("user--->", user)

    fetch(`${BaseURL}/user/login`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then((res) => {

            return res.json()
        })

        .then((data) => {

            console.log(data);
            document.getElementById('loginBtnHai').innerHTML = `Login`
            document.getElementById('loginBtnHai').disabled = false;

            if (data.Success) {

                Swal.fire({

                    title: data.msg,
                    icon:'success',

                    confirmButtonText: 'Ok'

                }).then((result) => {

                    if (result.isConfirmed) {

                        localStorage.setItem("usertoken", data.token);

                        location.href = "../index.html"
                    }

                })

            }

            else {

                Swal.fire(data.msg, '', 'error')

            }

        })
        .catch((err) => {

            document.getElementById('loginBtnHai').innerHTML = `Login`
            document.getElementById('loginBtnHai').disabled = false;

            Swal.fire(err, '', 'error')

        })


}



function HandleGoogleSignup() {

    document.getElementById('niteshgoogleauth').innerHTML = `<i class="fa fa-refresh fa-spin"></i> Continue With Google`;
    window.location.href = `${BaseURL}/user/auth/google`;

}