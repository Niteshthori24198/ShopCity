
const admin_baseurl = `http://localhost:3000`


const adminusertoken = localStorage.getItem('usertoken') || null;

if (!adminusertoken) {
    location.href = "../view/user.login.html"
}




fetchAndRenderUsers()

let allUserData_userDetails = []


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

            allUserData_userDetails = data.UsersData

            RenderUsers(data.UsersData)

        })
        .catch((err) => {
            console.log(err)
            alert('Something Went Wrong!')
        })


}




function RenderUsers(users) {

    document.getElementById("adminusercontainer").innerHTML = ''

    const usercard = users.map((user) => {
        return GetUserCard({ ...user })
    }).join('')

    document.getElementById("adminusercontainer").innerHTML = usercard;


}


function GetUserCard({ isAdmin, Location, Gender, Contact, Email, Name, _id }) {


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
            <p>Role : ${isAdmin ? "Admin" : "User"}</p>

        </div>

        <div>
            <button onclick="handleUpdateRole('${_id}','${isAdmin}')" id="${_id}">Update Role</button>
            <button onclick="SentEmailAnnouncement('${Email}', '${Name}')" id="${Email}">Announcement</button>
        </div>
       
    </div>
    
    `

}





function handleUpdateRole(userid, isAdmin) {

    // console.log("---> click data",userid,isAdmin, typeof isAdmin)

    if(!confirm("Are you sure you want to update the user's role?")){
        return
    }

    document.getElementById(userid).innerHTML ='<i class="fa fa-refresh fa-spin"></i> Update Role'

    

    if (isAdmin === 'true') {
        isAdmin = false
    }
    else {
        isAdmin = true
    }

    // console.log("---> click data",userid,isAdmin, typeof isAdmin)

    const payload = {
        UserID: `${userid}`,
        isAdmin: isAdmin
    }

    fetch(`${admin_baseurl}/user/updateRole`, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${adminusertoken}`
        },
        body: JSON.stringify(payload)
    })
        .then((res) => {
            return res.json()
        })
        .then((data) => {

            document.getElementById(userid).innerHTML ='Update Role'

            if (data.Success) {
                alert(data.msg)
                location.reload()
            }
            else {
                alert(data.msg)
            }
        })
        .catch((err) => {
            document.getElementById(userid).innerHTML ='Update Role'
            alert(data)
            console.log(err)
        })


}



function SentEmailAnnouncement(email, name) {

    document.getElementById(email).innerHTML = '<i class="fa fa-refresh fa-spin"></i> Announcement'
    
    setTimeout(()=>{
        document.getElementById(email).innerHTML = 'Announcement'
    },3000)

    let subject = 'Important Announcement from Shop City'
    name = name.split(' ').join('%20')
    let body = `Dear%20${name}`
    const url = `mailto:${email}?subject=${subject}&body=${body}`
    // console.log(url);
    window.location.href = url
}



function handleSearchNav_users(value){
    // console.log(value);
    
    if(value==='' || !value){
        RenderUsers(allUserData_userDetails)
        return
    }

    value = value.toLowerCase()


    const filterData = allUserData_userDetails.filter((user)=>{
        return (user.Name.toLowerCase().includes(value) || user.Email.toLowerCase().includes(value) || user.Location.toLowerCase().includes(value) || user.Gender.toLowerCase() == value)
    })

    RenderUsers(filterData)


    
}