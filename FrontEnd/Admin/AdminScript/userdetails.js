
const admin_baseurl = `http://localhost:3000`


const adminusertoken = localStorage.getItem('usertoken') || null;

if (!adminusertoken) {

    document.body.innerHTML = null

    Swal.fire({

        title: 'Kindly Login First to Access this section.',

        icon: 'error',

        confirmButtonText: 'Ok'

    }).then((result) => {

        if (result.isConfirmed) {

            location.href = "../view/user.login.html"
        }

    })

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

            Swal.fire(err, '', 'error')

        })


}




function RenderUsers(users) {

    document.getElementById("adminusercontainer").innerHTML = ''

    const usercard = users.map((user) => {
        return GetUserCard({ ...user })
    }).join('')

    document.getElementById("adminusercontainer").innerHTML = usercard;


}


function GetUserCard({ isAdmin, Location, Gender, Contact, Email, Name, _id, Image, isMailVerified, isBlocked }) {


    return `
   
    <div>
        <div>
            <img src="${Image}" alt="user-image">
        </div>

        <div>

            <p><span>Name</span> : ${Name}</p>
            <p><span>Email-Id</span> : ${Email}</p>
            <p><span>Gender</span> : ${Gender}</p>
            ${Contact != '-' ? `<p><span>Contact</span> : ${Contact}</p>` : ''}
            ${Location != '-' ? `<p><span>Address</span> : ${Location}</p>` : ''}
            
            </div>
            
        <div>
            
            <p> <span>ID</span> : ${_id} </p>
            <p>
                <span>Role</span> : <span style="color: ${isAdmin ? 'green' : '#007bff'};"> 
                    ${isAdmin ? "Admin" : "User"} 
                </span>
            </p>
            <p >
                <span> Mail </span> : <span style="color: ${isMailVerified ? 'green' : 'red'};">
                    ${isMailVerified ? "Verified" : "Not Verified"}
                </span>
            </p>

            ${isBlocked ?
            `<p style="color: red; display:flex">
                     <span style="width:150px">Blocked</span> 
                     <button class="activeBtn" onclick="handleActiveUserAccount('${_id}')" >Activate</button> 
                </p>`
            :
            `<p style="color: green; display:flex"> 
                    <span style="width:150px">Active</span> 
                    <button class="blockBtn" onclick="handleBlockUserAccount('${_id}')">Block</button> 
                </p>`
        }

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

    Swal.fire({

        title: `Are you sure you want to update the user role?`,
        showCancelButton: true,
        confirmButtonText: 'Upgrade'

    }).then((result) => {

        if (result.isConfirmed) {
            upGradeUserRole()
        }
    })


    function upGradeUserRole() {

        document.getElementById(userid).innerHTML = '<i class="fa fa-refresh fa-spin"></i> Update Role'


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

                document.getElementById(userid).innerHTML = 'Update Role'

                if (data.Success) {

                    Swal.fire({

                        title: data.msg,

                        icon: 'success',

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
                document.getElementById(userid).innerHTML = 'Update Role'
                Swal.fire(data.msg, '', 'error')
                console.log(err)
            })


    }

}



function SentEmailAnnouncement(email, name) {

    document.getElementById(email).innerHTML = '<i class="fa fa-refresh fa-spin"></i> Announcement'

    setTimeout(() => {
        document.getElementById(email).innerHTML = 'Announcement'
    }, 3000)

    let subject = 'Important Announcement from Shop City'
    name = name.split(' ').join('%20')
    let body = `Dear%20${name}`
    const url = `mailto:${email}?subject=${subject}&body=${body}`
    // console.log(url);
    window.location.href = url
}



function handleSearchNav_users(value) {
    // console.log(value);

    if (value === '' || !value) {
        RenderUsers(allUserData_userDetails)
        return
    }

    value = value.toLowerCase()


    const filterData = allUserData_userDetails.filter((user) => {
        return (user.Name.toLowerCase().includes(value) || user.Email.toLowerCase().includes(value) || user.Location.toLowerCase().includes(value) || user.Gender.toLowerCase() == value)
    })

    RenderUsers(filterData)



}


function handleBlockUserAccount(id) {

    Swal.fire({

        title: 'Are you sure you want to block this user?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'

    }).then((result) => {

        if (result.isConfirmed) {

            userAccountBlock()
        }
    })


    function userAccountBlock() {

        fetch(`${admin_baseurl}/user/blockUserAccount/${id}`, {
            method: "PATCH",
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${adminusertoken}`
            }
        }).then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.Success) {

                    Swal.fire({

                        title: data.msg,

                        icon: 'success',

                        confirmButtonText: 'Ok'

                    }).then((result) => {

                        if (result.isConfirmed) {

                            location.reload()
                        }

                    })

                } else {

                    Swal.fire({

                        title: data.msg,

                        icon: 'error',

                        confirmButtonText: 'Ok'

                    }).then((result) => {

                        if (result.isConfirmed) {

                            location.reload()
                        }

                    })
                }
            }).catch(err => {
                console.log(err);
                Swal.fire(err, '', 'error')
            })
    }



}




function handleActiveUserAccount(id) {

    Swal.fire({

        title: 'Are you sure you want to Activate this user?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'

    }).then((result) => {

        if (result.isConfirmed) {

            userAccountActivation()
        }
    })



    function userAccountActivation() {


        fetch(`${admin_baseurl}/user/activeUserAccount/${id}`, {
            method: "PATCH",
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${adminusertoken}`
            }
        }).then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.Success) {

                    Swal.fire({

                        title: data.msg,

                        icon: 'success',

                        confirmButtonText: 'Ok'

                    }).then((result) => {

                        if (result.isConfirmed) {

                            location.reload()
                        }

                    })
                    
                } else {
                    Swal.fire({

                        title: data.msg,

                        icon: 'error',

                        confirmButtonText: 'Ok'

                    }).then((result) => {

                        if (result.isConfirmed) {

                            location.reload()
                        }

                    })
                }
            }).catch(err => {
                console.log(err);
                Swal.fire(err, '', 'error')
                
            })
    }


}