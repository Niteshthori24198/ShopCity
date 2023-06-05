

const admin_feedback_baseurl = `http://localhost:3000`


const adminuserfeedtoken = localStorage.getItem('usertoken') || null;

if (!adminuserfeedtoken) {
    location.href = "../view/user.login.html"
}


fetchAndRenderQuery()



function fetchAndRenderQuery() {


    fetch(`${admin_feedback_baseurl}/user/getquery`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${adminuserfeedtoken}`
        }
    })
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            // console.log(data)
            if (data.Success) {

                renderUserQuery(data.Queries)
            }
        })
        .catch((err) => {
            console.log(err)
        })

}



function renderUserQuery(Queries) {

    document.getElementById('feedbackcontainer').innerHTML = ''

    const querycard = Queries.map((query) => {
        return getQueryCard({ ...query })
    }).join('')


    document.getElementById('feedbackcontainer').innerHTML = querycard;


}




function getQueryCard({ Name, Email, _id, Category, Query }) {

    console.log("data received for card :", Name, Email, _id, Category, Query);


    return `
    
        <div>

            <div>

                <p>Name : ${Name}</p>
                <p>Email : ${Email}</p>
                <p>Category : ${Category}</p>

            </div>

            <div>

                <p>Query : ${Query}</p>

                <button onclick="handleQueryReply('${_id}','${Email}','${Name}')" id="${_id}">Reply</button>

            </div>

        </div>
    
    `


}



function handleQueryReply(id, email,name) {



    document.getElementById(id).innerHTML = '<i class="fa fa-refresh fa-spin"></i> Reply'

    setTimeout(() => {
        document.getElementById(id).innerHTML = 'Reply'
    }, 3000)

    let subject = 'Feedback Query Response from Shop City'
    name = name.split(' ').join('%20')
    let body = `Dear%20${name}`
    const url = `mailto:${email}?subject=${subject}&body=${body}`
    // console.log(url);
    window.location.href = url


}