
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

    if (!validatePhoneNumber(usercontact.value)) {
        alert('Please enter a valid phone number!')
        return
    }



    if (!confirm('Do you Want to Update Your Profile ?')) {
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


    const payload = {
        currpass, newpass
    }


    if (!confirm('Do you Want to Update Your Password ?')) {
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




// $(document).ready(function () {
//     // Prepare the preview for profile picture
//     $("#wizard-picture").change(function () {
//         readURL(this);
//     });
// });

// function readURL(input) {
//     if (input.files && input.files[0]) {

//         const myform = document.getElementById('myform')

//         console.log(input.files[0]);
//         const data = new FormData(myform);
//         data.append('file', input.files[0]);
//         fetch('http://localhost:8080/upload', {
//             method: 'POST',
//             body: data
//         }).then(res => res.json())


//         var reader = new FileReader();

//         reader.onload = function (e) {
//             $('#wizardPicturePreview').attr('src', e.target.result).fadeIn('slow');
//         }
//         reader.readAsDataURL(input.files[0]);
//     }
// }


function openForm() {
    document.getElementById("myForm").style.display = "block";
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

async function handleAddProfileImage(event) {
    event.preventDefault()

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

    alert(res?.msg);
   location.reload()
}


function handleRemoveProfieImage(){
    if(!confirm('Do you Want to Remove your Profile Image ?')){
        return
    }
    fetch(`${profile_baseurl}/user/delete-profile-image`,{
        method: 'DELETE',
        headers: {
            'authorization': `Bearer ${users_token}`
        }
    }).then(r => r.json()).then(data =>{
        console.log(data);
        location.reload()
    }).catch(err => {
        alert('Something Went Wrong')
        console.log(err);
    })
}