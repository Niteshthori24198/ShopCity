
const admin_baseurl = `http://localhost:3000`


const adminusertoken = localStorage.getItem('usertoken') || null;

if (!adminusertoken) {
    location.href = "../../view/user.login.html"
}


fetchAndRenderUsers()



function fetchAndRenderUsers() {

    fetch(`${admin_baseurl}/user/getall`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${adminusertoken}`
        }
    })
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            console.log("user data fetched ", data.UsersData)
            RenderUsers(data.UsersData)

        })
        .catch((err) => {
            console.log(err)
        })


}




function RenderUsers(users) {

    document.getElementById("adminusercontainer").innerHTML=''

    const usercard = users.map((user)=>{
        return GetUserCard({...user})
    }).join('')

    document.getElementById("adminusercontainer").innerHTML=usercard;


}


function GetUserCard({isAdmin,Location,Gender,Contact,Email,Name,_id}) {

    return `
   
    <div>

        <div>

            <p>Name : ${Name}</p>
            <p>Email-Id : ${Email}</p>
            <p>Gender : ${Gender}</p>

        </div>

        <div>

            <p>Address : ${Location}</p>
            <p>Contact : ${Contact}</p>
            <p>Role : ${isAdmin?"Admin":"User"}</p>

        </div>

        <div>
            <button>Update Role</button>
            <button>Announcement</button>
        </div>
       
    </div>
    
    `

}

