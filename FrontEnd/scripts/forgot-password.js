
const forgotPasswordBaseUrl = 'http://localhost:3000'

let a = new URLSearchParams(window.location.search);
console.log(a);

let tokenfromurl = a.get('userToken');
// alert(tokenfromurl)

if (tokenfromurl) {

    var currentUrl = window.location.href;

    if (currentUrl.indexOf('?userToken=') !== -1) {

        var newUrl = currentUrl.replace(/(\?|&)userToken=[^&]*(&|$)/, '$1');

        history.replaceState(null, null, newUrl);
    }

}

function showSpinner() {
    const user_password = document.getElementById('user_password').value
    const user_con_password = document.getElementById('user_con_password').value

    if (!user_password || !user_con_password) {
        Swal.fire('Kindly Provide Required Detalils.', '', 'error')
        return
    }


    if (user_password !== user_con_password) {

        Swal.fire('Password mismatch', '', 'error')

        return
    }

    if (!validatePassword(user_password)) {

        Swal.fire('At least one uppercase letter, one lowercase letter, and one digit.', '[Minimum length of 8 characters]', 'error')

        return
    }


    console.log(tokenfromurl);
    console.log(user_password);
    console.log(user_con_password);

    fetch(`${forgotPasswordBaseUrl}/user/saveNewPassword`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "Authorization": `Bearer ${tokenfromurl}`
        },
        body: JSON.stringify({
            Password: user_password
        })
    })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (data.Success) {

                Swal.fire(data.msg, '', 'success')


            } else {

                Swal.fire(data.error, '', 'error')

            }
        })
        .catch(err => {
            Swal.fire(err, '', 'error')
        }).finally(() => {
            user_password.value = ''
            user_con_password.value = ''
        })
}



function validatePassword(password) {
    // Minimum length of 8 characters
    if (password.length < 8) {
        return false;
    }

    // At least one uppercase letter, one lowercase letter, and one digit
    var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    return regex.test(password);
}

