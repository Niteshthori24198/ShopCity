

const BaseURL = `http://localhost:3000`

let registerForm = document.getElementById('registeruser');


registerForm.addEventListener('submit',(e)=> {

    e.preventDefault();

    if(registerForm.new_user_conf_pass.value !== registerForm.new_user_pass.value){

        Swal.fire('Password Not Matched !', '', 'error')
        return

    }
    else if(registerForm.new_user_captcha.value !== registerForm.captchImage.value){
      
        Swal.fire('Captcha Not Matched !', '', 'error')
        generateCaptcha()
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
    document.getElementById('registerFormSubmitBtn').disabled = true;


    const pass = registerForm.new_user_pass.value
    const phone = registerForm.new_user_contact.value
    

    if(!validatePassword(pass)){
        document.getElementById('registerFormSubmitBtn').innerHTML = 'Register'
        document.getElementById('registerFormSubmitBtn').disabled = false;
        generateCaptcha()

        Swal.fire('Please enter a Strong Password!', 'At least one Uppercase letter, one Lowercase letter, one Digit and length must be grater then 8', 'error')
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
        document.getElementById('registerFormSubmitBtn').disabled = false;
        generateCaptcha()

        if(data.Success){

           
            Swal.fire({

                title: data.msg,
                
                icon:'success',

                confirmButtonText: 'Ok'

            }).then((result) => {

                if (result.isConfirmed) {

                    location.href = '../view/user.login.html';
                }

            })

        }

        else{

            Swal.fire(data.msg, '', 'error')

        }

    })
    .catch((err)=>{

        document.getElementById('registerFormSubmitBtn').innerHTML = 'Register'
        document.getElementById('registerFormSubmitBtn').disabled = false;
        generateCaptcha()

        alert(data.msg);

    })


}



// handle Captcha

const captchImage = document.getElementById('captchImage')

const captchData = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';

const generateCaptcha = () => {
    let str = ''
    for(let i=0; i<6; i++){
        const rand = Math.floor(Math.random() * captchData.length)
        str += captchData[rand]
    }
    captchImage.value = str;
}
generateCaptcha()