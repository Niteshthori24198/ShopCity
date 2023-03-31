

const BaseURL = `http://localhost:3000`

let registerForm = document.getElementById('registeruser');


registerForm.addEventListener('submit',(e)=> {

    e.preventDefault();

    if(registerForm.new_user_conf_pass.value !== registerForm.new_user_pass.value){

        alert('Password Miss - Matched');

    }
    
    else{
        
        registerNewUser();

    }

})



const registerNewUser = () => {

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

        if(data.Success){

            alert(data.msg)

            // location.href = 'login.html';

        }

        else{

            alert(data.msg)

        }

    })
    .catch((err)=>{

        alert(data.msg);

    })


}