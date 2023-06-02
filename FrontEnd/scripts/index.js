
const BASEURL = `http://localhost:3000`

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

            // console.log(loggedInUser)

            // Remove Login Button
            LogedInBtn.style.display = 'none'

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

function fixTheSizeOfNavDrop(){
    console.log(screen.width)
    if(screen.width <= 600){
        if(LogedInSuccess){
            document.getElementsByClassName("shop-city-links")[0].style.height = '250px'
        }else{
            document.getElementsByClassName("shop-city-links")[0].style.height = '300px'
        }
    }else{
        document.getElementsByClassName("shop-city-links")[0].style.height = '35px'
    }
}



function renderUserName(){
    
    showUserName.innerHTML = `${loggedInUser.UserData.Name}` ;

    document.getElementById('dropdownForProfile').style.display = 'inline-block'

}






logedOutBtn.addEventListener('click', ()=>{
    localStorage.removeItem('usertoken');

    location.reload();

})

