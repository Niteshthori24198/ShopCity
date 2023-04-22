
const BASEURL = `http://localhost:3000`

let usertoken = localStorage.getItem('usertoken') || null;

let loggedInUser = {};


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

            // console.log(loggedInUser)

            renderUserName();
            

        }
        
        else {

            localStorage.removeItem('usertoken');
           

        }


    } 
    
    catch (error) {
    
        console.log(error)

    }
}



let signin_up_button = document.getElementById('signin_up_button');


let showUserName = document.getElementById('ShowUserName');

let UsernameShow = document.getElementById("UsernameShow")


function renderUserName(){
    
    showUserName.innerHTML = `<i class="fa-solid fa-user"></i> ${loggedInUser.UserData.Name}` ;

    showUserName.style.display = 'inline';

    signin_up_button.innerHTML = `<i class="fa-solid fa-user"></i> Logout`;

    document.getElementById("ShowUserName").style.marginRight='12px';
    document.getElementById("ShowUserName").style.fontSize='15px';




}



signin_up_button.addEventListener('click', ()=>{

    if(signin_up_button.innerHTML === '<i class="fa-solid fa-user"></i> Logout'){

        localStorage.removeItem('usertoken');

        location.reload();
    }

})