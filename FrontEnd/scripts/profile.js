
const profile_baseurl = `http://localhost:3000`



const username = document.getElementById('user_name_here');

const useremail = document.getElementById('user_email_id_disp');

const usergen = document.getElementById('user_gen_disp');

const username2 = document.getElementById('user_name_disp');

const userrole = document.getElementById('user_role_disp');

const useraddress = document.getElementById('user_address_disp');

const usercontact = document.getElementById('user_contact_disp');

const userdataeditbtn = document.getElementById('updateUserInfobtn');


const users_token = localStorage.getItem('usertoken') || null;


if (!users_token) {
    location.href = "../view/user.login.html"
}
else {
    FetchUserInformation()
}




function FetchUserInformation() {


    fetch(`${profile_baseurl}/user/get`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${users_token}`
        }
    })
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            console.log(data)

            RenderUserdata(data.UserData)
        })
        .catch((err) => {
            console.log(err)
        })

}



function RenderUserdata(UserData) {

    username.innerText = UserData.Name
    username2.value = UserData.Name
    useremail.value = UserData.Email
    useraddress.value = UserData.Location
    usercontact.value = UserData.Contact
    userrole.value = `${UserData.isAdmin ? "Admin" : "User"}`
    usergen.value = UserData.Gender


}


userdataeditbtn.addEventListener("click", () => {


    const userpayload = {

        Name: username2.value,
        Location: useraddress.value,
        Contact: usercontact.value,
        Gender: usergen.value

    }


    UpdateUserInfo(userpayload)

})


function UpdateUserInfo(userpayload) {


    fetch(`${profile_baseurl}/user/update`, {
        method: 'PATCH',
        headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${users_token}`
        },
        body: JSON.stringify(userpayload)
    })
        .then((res) => {
            return res.json()
        })
        .then((data) => {

            if (data.Success) {

                alert(data.msg)

                RenderUserdata(data.UserData)
            }
            else {
                alert(data.msg)
            }

        })
        .catch((err) => {
            console.log(err)
        })


}


// function UpdatePassword() {

// }