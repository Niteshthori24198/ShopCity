

const BaseURL = `http://localhost:3000`

let registerForm = document.getElementById('registeruser');


registerForm.addEventListener('submit',(e)=> {

    e.preventDefault();

    if(registerForm.new_user_conf_pass.value !== registerForm.new_user_pass.value){

        alert('Password Miss - Matched');
        return

    }
    
    else{
        
        registerNewUser();

    }

})

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


const registerNewUser = () => {

    document.getElementById('registerFormSubmitBtn').innerHTML = '<i class="fa fa-refresh fa-spin"></i> Register'

    const pass = registerForm.new_user_pass.value
    const phone = registerForm.new_user_contact.value
    
    if(!validatePhoneNumber(phone)){
        document.getElementById('registerFormSubmitBtn').innerHTML = 'Register'
        alert('Please enter a valid phone number!')
        return
    }

    if(!validatePassword(pass)){
        document.getElementById('registerFormSubmitBtn').innerHTML = 'Register'
        alert('Please enter a strong password! ( At least one uppercase letter, one lowercase letter, and one digit )')
        return
    }



    let payload = {

        Email: registerForm.new_user_email.value,
        Name: registerForm.new_user_name.value,
        Password: registerForm.new_user_pass.value,
        Gender: registerForm.new_user_gen.value,
        Location: registerForm.new_user_address.value,
        Contact: registerForm.new_user_contact.value

    }

    console.log(payload);

    AddNewUserToDB(payload);   

}




const AddNewUserToDB = async (payload) => {


    fetch(`${BaseURL}/user/register`, {

        method: "POST",
        headers:{
            "Content-type": "application/json"
        },
        body: JSON.stringify(payload)

    })
    .then((res)=>{

        return res.json()
    })
    .then((data)=>{

        console.log(data)

        document.getElementById('registerFormSubmitBtn').innerHTML = 'Register'

        if(data.Success){

            alert(data.msg)

            location.href = '../view/user.login.html';

        }

        else{

            alert(data.msg)

        }

    })
    .catch((err)=>{

        document.getElementById('registerFormSubmitBtn').innerHTML = 'Register'

        alert(data.msg);

    })


}