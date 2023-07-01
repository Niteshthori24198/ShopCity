
const BASEURL = `http://localhost:3000`


let a = new URLSearchParams(window.location.search);

let tokenfromurl = a.get('token');

if (tokenfromurl) {

    localStorage.setItem('usertoken', tokenfromurl);


    var currentUrl = window.location.href;

    if (currentUrl.indexOf('?token=') !== -1) {

        var newUrl = currentUrl.replace(/(\?|&)token=[^&]*(&|$)/, '$1');

        history.replaceState(null, null, newUrl);
    }

}


let usertoken = localStorage.getItem('usertoken') || null;

let loggedInUser = {};

let LogedInBtn = document.getElementById('LogedInBtn');
let showUserName = document.getElementById('ShowUserName');
let logedOutBtn = document.getElementById('logedOutBtn');

let LogedInSuccess = false;

if (usertoken) {

    fetchUserDetails();

}


async function fetchUserDetails() {

    try {

        let res = await fetch(`${BASEURL}/user/get`, {

            method: "GET",

            headers: {

                "Content-type": "application/json",

                "Authorization": `Bearer ${usertoken}`

            }

        });

        if (res.ok) {

            res = await res.json();

            loggedInUser = res;

            // console.log("---> loguser ",loggedInUser)

            // Remove Login Button
            LogedInBtn.style.display = 'none'

            // console.log(loggedInUser.isAdmin)
            if (loggedInUser.UserData.isAdmin) {
                document.querySelector('.dropdown-content > a:nth-child(3)').style.display = 'inline-block'
            }

            LogedInSuccess = true

            renderUserName();



        }

        else {

            localStorage.removeItem('usertoken');
            LogedInBtn.style.display = 'block'
            LogedInSuccess = false

        }


    }

    catch (error) {

        console.log(error)
        LogedInSuccess = false

    }
}


window.addEventListener('resize', fixTheSizeOfNavDrop)
window.addEventListener('load', fixTheSizeOfNavDrop)

function fixTheSizeOfNavDrop() {
    console.log(screen.width)
    if (screen.width <= 600) {
        if (usertoken) {
            document.getElementsByClassName("shop-city-links")[0].style.height = '250px'
        } else {
            document.getElementsByClassName("shop-city-links")[0].style.height = '300px'
        }
    } else {
        document.getElementsByClassName("shop-city-links")[0].style.height = '35px'
    }
}



function renderUserName() {

    showUserName.innerHTML = `${loggedInUser.UserData.Name}`;

    document.getElementById('dropdownForProfile').style.display = 'inline-block'

}






logedOutBtn.addEventListener('click', () => {


    Swal.fire({

        title: 'Are you sure you want to log out?',
        showCancelButton: true,
        confirmButtonText: 'Logout'

    }).then((result) => {

        if (result.isConfirmed) {

            userLogoutIntiate()
        }
    })


})




async function userLogoutIntiate() {

    console.log("logout initiated")

    const userLogOut = await userLogedOutHandle()

    if (userLogOut) {

        localStorage.removeItem('usertoken');

        Swal.fire('Logout Successfull ✌', '', 'success')

        setTimeout(() => {
            location.reload()
        }, 2000)
    }

    else {
        Swal.fire('Oops !! Something Went wrong.', 'Try Again', 'error')
    }




}


async function userLogedOutHandle() {

    let userloggedout = false;

    const Response = await fetch(`${BASEURL}/user/logout`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${usertoken}`
        }
    })
        .then((res) => {
            return res.json()
        })
        .catch((err) => {
            console.log(err)
        })


    const data = await Response

    if (data.Success) {
        userloggedout = true
    }
    else {
        userloggedout = data.Success;
    }

    return userloggedout

}