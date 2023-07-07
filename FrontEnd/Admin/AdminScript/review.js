

const admin_review_baseurl = `http://localhost:3000`


const adminuserReviewtoken = localStorage.getItem('usertoken') || null;

if (!adminuserReviewtoken) {

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


fetchAndRenderQuery()



function fetchAndRenderQuery() {


    fetch(`${admin_review_baseurl}/review/getAllReview`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${adminuserReviewtoken}`
        }
    })
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            // console.log(data)
            if (data.Success) {

                renderReviews(data.Review)
            }
        })
        .catch((err) => {

            console.log(err)
        })

}



function renderReviews(Reviews) {
    console.log(Reviews);
    document.getElementById('reviewcontainer').innerHTML = ''

    const reviewcard = Reviews.map((query) => {
        return getReviewCard({ ...query })
    }).join('')


    document.getElementById('reviewcontainer').innerHTML = reviewcard;


}




function getReviewCard({ _id, CustomerId, CustomerName, CustomerImage, OrderId, ProductId, NewRating, Description }) {

    return `
    
        <div>

            <div>
                <img src="${CustomerImage}" alt="user-image">
            </div>

            <div>

                <p><span>Customer Name</span> : ${CustomerName}</p>
                <p><span>Customer ID</span> : ${CustomerId}</p>
                <p><span>Product ID</span> : ${ProductId}</p>
                <p><span>Order ID</span> : ${OrderId}</p>

            </div>

            <div>

                <p><span>Rating Star</span> : ${NewRating} ⭐ / 5</p>
                <p><span>Description</span> : ${Description} </p>

            </div>

            <div>
                <button onclick="handleDeleteReview('${_id}')"> Delete </button>
            </div>

        </div>
    
    `


}


function handleDeleteReview(id) {

    Swal.fire({

        title: 'Are you sure you want to delete this review?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'

    }).then((result) => {

        if (result.isConfirmed) {

            deleteProductReview()
        }
    })


    function deleteProductReview() {

        fetch(`${admin_review_baseurl}/review/delete/${id}`, {
            method: "DELETE",
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${adminuserReviewtoken}`
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

                            fetchAndRenderQuery()
                        }

                    })

                } else {

                    Swal.fire({

                        title: data.error,

                        icon: 'error',

                        confirmButtonText: 'Ok'

                    }).then((result) => {

                        if (result.isConfirmed) {

                            fetchAndRenderQuery()
                        }

                    })

                }
            }).catch(err => {
                console.log(err);
                Swal.fire(err, '', 'error')
                fetchAndRenderQuery()
            })
    }

}