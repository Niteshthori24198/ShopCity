
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
            <button onclick="handleUpdateRole('${_id}','${isAdmin}')">Update Role</button>
            <button onclick="SentEmailAnnouncement('${Email}', '${Name}')">Announcement</button>
        </div>
       
    </div>
    
    `

}





function handleUpdateRole(userid, isAdmin) {

    // console.log("---> click data",userid,isAdmin, typeof isAdmin)

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

            if (data.Success) {
                alert(data.msg)
                location.reload()
            }
            else {
                alert(data.msg)
            }
        })
        .catch((err) => {
            alert(data)
            console.log(err)
        })


}



function SentEmailAnnouncement(email, name) {

    let subject = 'Important Announcement from Shop City'
    name = name.split(' ').join('%20')
    let body = `Dear%20${name}`
    const url = `mailto:${email}?subject=${subject}&body=${body}`
    // console.log(url);
    window.location.href = url
}