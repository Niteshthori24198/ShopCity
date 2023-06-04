
const profile_baseurl = `http://localhost:3000`



const username = document.getElementById('user_name_here');

const useremail = document.getElementById('user_email_id_disp');

const usergen = document.getElementById('user_gen_disp');

const username2 = document.getElementById('user_name_disp');

const userrole = document.getElementById('user_role_disp');

const useraddress = document.getElementById('user_address_disp');

const usercontact = document.getElementById('user_contact_disp');

const userdataeditbtn = document.getElementById('updateUserInfobtn');

const savePasswordBTN = document.getElementById('savePasswordBTN');

const passdiv = document.getElementById('Updateuserpass')





const users_token = localStorage.getItem('usertoken') || null;


if (!users_token) {
    location.href = "../view/user.login.html"
}
else {
    
    FetchUserInformation()
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

function validatePhoneNumber(phoneNumber) {
    // Regular expression for phone number validation
    var regex = /^\d{10}$/;
    return regex.test(phoneNumber);
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

    if(!validatePhoneNumber(usercontact.value)){
        alert('Please enter a valid phone number!')
        return
    }

  

    if(!confirm('Do you Want to Update Your Profile ?')){
        location.reload()
        return
    }

    UpdateUserInfo(userpayload)

})


function UpdateUserInfo(userpayload) {

    userdataeditbtn.innerHTML = '<i class="fa fa-refresh fa-spin"></i> Save'
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

            userdataeditbtn.innerHTML = 'Save'
            if (data.Success) {
                
                alert(data.msg)
                
                location.reload()
            }
            else {
                alert(data.msg)
            }
            
        })
        .catch((err) => {
            userdataeditbtn.innerHTML = 'Save'
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

    if(!validatePassword(newpass)){
        alert('Please enter a strong password! ( At least one uppercase letter, one lowercase letter, and one digit )')
        return
    }


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

    savePasswordBTN.innerHTML = '<i class="fa fa-refresh fa-spin"></i> Save'

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

            savePasswordBTN.innerHTML = 'Save'
            
            if (data.Success) {
                
                alert(data.msg)
                location.reload()
            }
            else {
                alert(data.msg)
            }
            
        })
        .catch((err) => {
            savePasswordBTN.innerHTML = 'Save'
            console.log(err)
        })


}