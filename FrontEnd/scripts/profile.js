
const profile_baseurl = `http://localhost:3000`



const username = document.getElementById('user_name_here');

const useremail = document.getElementById('user_email_id_disp');

const usergen = document.getElementById('user_gen_disp');

const username2 = document.getElementById('user_name_disp');

const userrole = document.getElementById('user_role_disp');

const useraddress = document.getElementById('user_address_disp');

const usercontact = document.getElementById('user_contact_disp');

const userdataeditbtn = document.getElementById('updateUserInfobtn');

const passdiv = document.getElementById('Updateuserpass')




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

    if(!confirm('Do you Want to Update Your Profile ?')){
        location.reload()
        return
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

                location.reload()
            }
            else {
                alert(data.msg)
            }

        })
        .catch((err) => {
            console.log(err)
        })


}


function UpdatePassword() {

    passdiv.style.display = 'flex'

}

function closePassUpdateBox() {


    document.getElementById('user_old_password').value=''
    document.getElementById('user_new_password').value=''
    document.getElementById('user_new_password_confirm').value=''

    passdiv.style.display = 'none'
}



function UpdateUserNewPassword() {

    const currpass = document.getElementById('user_old_password').value;
    const newpass = document.getElementById('user_new_password').value;
    const confirmpass = document.getElementById('user_new_password_confirm').value;


    if (!currpass || !newpass || !confirmpass) {
        alert('Kindly Enter All Required feilds.')
        return
    }

    if (newpass !== confirmpass) {
        alert("Password Mismatch Occur. Kindly re-enter Password !")
        return
    }


    const payload= {
        currpass,newpass
    }


    if(!confirm('Do you Want to Update Your Password ?')){
        return
    }


    fetch(`${profile_baseurl}/user/changepass`, {
        method: 'PATCH',
        headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${users_token}`
        },
        body: JSON.stringify(payload)
    })
        .then((res) => {
            return res.json()
        })
        .then((data) => {

            if (data.Success) {

                alert(data.msg)
                location.reload()
            }
            else {
                alert(data.msg)
            }

        })
        .catch((err) => {
            console.log(err)
        })


}