
const profile_baseurl = `http://localhost:3000`



const username = document.getElementById('user_name_here');

const user_profile_image_here = document.getElementById('user_profile_image_here');


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
    user_profile_image_here.src = UserData?.Image
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


    Swal.fire({

        title: 'Do you Want to Update Your Profile ?',
        showCancelButton: true,
        confirmButtonText: 'Update'

    }).then((result) => {

        if (result.isConfirmed) {

            UpdateUserInfo(userpayload)
        }
       
    })





})


function UpdateUserInfo(userpayload) {

    userdataeditbtn.innerHTML = '<i class="fa fa-refresh fa-spin"></i> Save'
    userdataeditbtn.disabled = true;
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
            userdataeditbtn.disabled = false;
            if (data.Success) {

                location.reload()
            }
            else {
                Swal.fire(data.msg, '', 'error')
            }

        })
        .catch((err) => {
            userdataeditbtn.innerHTML = 'Save'
            userdataeditbtn.disabled = false;
            console.log(err)
        })


}


function UpdatePassword() {

    passdiv.style.display = 'flex'

}

function closePassUpdateBox() {


    document.getElementById('user_old_password').value = ''
    document.getElementById('user_new_password').value = ''
    document.getElementById('user_new_password_confirm').value = ''



    passdiv.style.display = 'none'
}



function UpdateUserNewPassword() {

    const currpass = document.getElementById('user_old_password').value;
    const newpass = document.getElementById('user_new_password').value;
    const confirmpass = document.getElementById('user_new_password_confirm').value;

    if (!validatePassword(newpass)) {

        Swal.fire('Please enter a strong password!', ' At least one uppercase letter, one lowercase letter, one digit and length must be 8', 'warning')
        return
    }


    if (!currpass || !newpass || !confirmpass) {
        Swal.fire('Kindly Enter All Required feilds.', '', 'warning')
        return
    }

    if (newpass !== confirmpass) {
        Swal.fire('Password Mismatch Occur. Kindly re-enter Password.', '', 'warning')
        return
    }


    const payload = {
        currpass, newpass
    }



    Swal.fire({

        title: 'Do you Want to Update Your Password ?',
        showCancelButton: true,
        confirmButtonText: 'Update'

    }).then((result) => {

        if (result.isConfirmed) {

            UpdateUserPassword()
        }

    })




    function UpdateUserPassword() {

        savePasswordBTN.innerHTML = '<i class="fa fa-refresh fa-spin"></i> Save'
        savePasswordBTN.disabled = true

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
                savePasswordBTN.disabled = false

                if (data.Success) {

                    Swal.fire({

                        title: data.msg,
                        icon:'success',
                        confirmButtonText: 'Ok'

                    }).then((result) => {

                        if (result.isConfirmed) {

                            location.reload()
                        }
                    })

                }
                else {
                    Swal.fire(data.msg, '', 'error')
                }

            })
            .catch((err) => {
                savePasswordBTN.innerHTML = 'Save'
                savePasswordBTN.disabled = false
                console.log(err)
            })

    }


}



function openForm() {
    document.getElementById("myForm").style.display = "block";
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

async function handleAddProfileImage(event) {
    event.preventDefault()
    document.getElementById('savePasswordBtn').innerHTML = '<i class="fa fa-refresh fa-spin"></i> Save'
    document.getElementById('savePasswordBtn').disabled = true;

    let profileImageForm = document.getElementById('profileImageForm');

    const ImageFile = profileImageForm.profileImageInput.files[0]

    const formData = new FormData(profileImageForm);

    formData.append("Image", ImageFile);

    console.log(formData);

    let res = await fetch(`${profile_baseurl}/user/upload-profile-image`, {
        method: "POST",
        headers: {
            'authorization': `Bearer ${users_token}`
        },
        body: formData
    }).then(r => r.json())

    console.log(res);
    document.getElementById('savePasswordBtn').innerHTML = 'Save'
    document.getElementById('savePasswordBtn').disabled = false;

    location.reload()
}


function handleRemoveProfieImage() {


    Swal.fire({

        title: 'Do you Want to Remove your Profile Image ?',
        showCancelButton: true,
        confirmButtonText: 'Remove'

    }).then((result) => {

        if (result.isConfirmed) {

            HandleProfileRemove()
        }

    })


    function HandleProfileRemove() {

        document.getElementById('removePhotoBtn').innerHTML = '<i class="fa fa-refresh fa-spin"></i> Remove'
        document.getElementById('removePhotoBtn').disabled = true;
        fetch(`${profile_baseurl}/user/delete-profile-image`, {
            method: 'DELETE',
            headers: {
                'authorization': `Bearer ${users_token}`
            }
        }).then(r => r.json()).then(data => {
            console.log(data);
            location.reload()
        }).catch(err => {
            console.log(err);
        }).finally(() => {
            document.getElementById('removePhotoBtn').innerHTML = 'Remove'
            document.getElementById('removePhotoBtn').disabled = false;
        })
    }

}