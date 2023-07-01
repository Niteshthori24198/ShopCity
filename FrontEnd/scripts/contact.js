
const query_base_URL = `http://localhost:3000`


const queryformele = document.getElementById('contactqueryForm');

const queryusername = document.getElementById('query_user_name_')

const queryuseremail = document.getElementById('query_user_email_')

const querytypesel = document.getElementById('query_category')

const userquery = document.getElementById('users_query_')



queryformele.addEventListener("submit", (e) => {

    e.preventDefault()

    const QueryObj = {
        Name: queryusername.value,
        Email: queryuseremail.value,
        Category: querytypesel.value,
        Query: userquery.value
    }

    console.log(QueryObj)


    Swal.fire({

        title: 'Do you want to submit your feedback query ?',
        showCancelButton: true,
        confirmButtonText: 'Submit'

    }).then((result) => {

        if (result.isConfirmed) {

            SubmitUserQuery(QueryObj)

            document.getElementById('query_user_name_').value = ''

            document.getElementById('query_user_email_').value = ''

            document.getElementById('query_category').value = ''

            document.getElementById('users_query_').value = ''
        }
    })

})




function SubmitUserQuery(QueryObj) {

    // post request

    fetch(`${query_base_URL}/user/query`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(QueryObj)
    })
        .then((res) => {
            return res.json()
        })
        .then((data) => {

            if (data.Success) {
                Swal.fire(data.msg, '', 'success')
            }
        })
        .catch((err) => {
            console.log(err)
        })


}