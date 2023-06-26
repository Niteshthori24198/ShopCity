

const admin_review_baseurl = `http://localhost:3000`


const adminuserReviewtoken = localStorage.getItem('usertoken') || null;

if (!adminuserReviewtoken) {
    location.href = "../view/user.login.html"
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
            console.log('error==>');
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




function getReviewCard({ _id,CustomerId, CustomerName, CustomerImage, OrderId, ProductId,NewRating, Description }) {

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


function handleDeleteReview(id){
    if(!confirm('Are you sure you want to delete this review?')){
        return;
    }
    fetch(`${admin_review_baseurl}/review/delete/${id}`, {
        method : "DELETE",
        headers : {
            'content-type' : 'application/json',
            'authorization' : `Bearer ${adminuserReviewtoken}`
        }
    }).then( res => res.json())
    .then( data => {
        console.log(data);
        if(data.Success){
            alert(data.msg)
        }else{
            alert(data.error)
        }
    }).catch(err => {
        console.log(err);
        alert('Something Went Wrong')
    }).finally(()=>{
        fetchAndRenderQuery()  
    })
}