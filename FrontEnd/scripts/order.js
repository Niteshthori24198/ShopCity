

const baseUrl = `http://localhost:3000`

let allOrdersHere = document.getElementById('allOrdersHere');

let token = localStorage.getItem("usertoken") || null;

if (!token) {

    alert("Kindly login first to access orders")

    location.href = "../view/user.login.html"
}



fetchAndRenderOrders()


function fetchAndRenderOrders() {

    fetch(`${baseUrl}/order/get`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    })
        .then((res) => {
            return res.json()
        })
        .then((data) => {

            if (data.Success) {

                console.log(data)

                RenderOrdersinPage(data.Orders)

            }
            else {
                alert(data.msg)
            }

        })
        .catch((err) => {
            console.log(err)
        })

}





// ***
function RenderOrdersinPage(Orders) {
    // console.log("---->",Orders);

    Orders = Orders.Products.reverse();

    allOrdersHere.innerHTML = ''

    const orderHTML = Orders.map((item) => {
        console.log(item);
        return getordersBox(item._id, item.Date, item.Address, item.Status, item.product.Image, item.product.Title, item.product.Category, item.product.Price, item.Quantity, item.product._id)
    }).join('')

    allOrdersHere.innerHTML = orderHTML;
}

// ***
function getordersBox(id, date, add, status, img, title, cat, price, quant, productId) {

    return (
        `
            <div>
                <div>
                    <img src="${img}" alt="error">
                </div>
                <div>
                    <h5>Product :- ${title} </h5>
                    <p>Order Date :- ${date}</p>
                    <p>Quantity :- ${quant}</p>
                    <p>Total Price :- ${quant * price} Rs</p>
                    <p>Order Status :- ${status}</p>
                    <p>Shipping Address :- ${add}</p>
                    ${((status == 'Delivered') || (status == 'Cancelled')) ? '' : `<button onclick="handleCancel('${id}')" class="cancelbtn" >Cancel Order</button>`}

                    ${(status == 'Delivered') ? openFormForReviewHTML(`${id}`, `${productId}`) : ''}
                   
                </div>
            </div>
        `
    )

}




function handleCancel(id) {
    // console.log(id)

    if (!confirm('Are you sure you want to cancel the order?')) {
        return
    }

    document.querySelector('.cancelbtn').innerHTML = '<i class="fa fa-refresh fa-spin"></i> Cancel Order'

    fetch(`${baseUrl}/order/cancel/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    })
        .then((res) => {
            return res.json()
        })
        .then((data) => {

            document.querySelector('.cancelbtn').innerHTML = 'Cancel Order'

            if (data.Success) {

                console.log(data.msg)
                location.reload()


            }
            else {
                alert(data.msg)
            }

        })
        .catch((err) => {
            document.querySelector('.cancelbtn').innerHTML = 'Cancel Order'
            console.log(err)
        })

}





function openFormForReviewHTML(orderId, productId) {
    

    // <!-- A button to open the popup form -->
    return `<button 
                type="button" 
                class="btn btn-primary" 
                data-toggle="modal" 
                data-target="#exampleModal" 
                data-whatever="@getbootstrap"
                onclick="setTheValueOfOrderIDAndPorductID( '${orderId}', '${productId}' )"
            > Feedback </button>`


}

function setTheValueOfOrderIDAndPorductID(orderId, productId){
    orderId_review = orderId
    productId_review = productId

    // populate form

    fetch(`${baseUrl}/review/get-by-orderId/${orderId}`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    }).then((res) => {
        return res.json()
    }).then((data) => {
        console.log(data)
        if(data.Success){
            console.log(data.Review[0]);
            if(data.Review.length){

                reviewId_Order = data.Review[0]._id

                let k = data.Review[0].NewRating
                ratingValue.style = `--fill: #C8102E;--symbol:var(--heart);--value:${k}`
                ratingValue.value = k
                ratingSpan.innerText = k
                messageTextValue.value = data.Review[0].Description
            }else{

                reviewId_Order = 0

                ratingValue.style = `--fill: #C8102E;--symbol:var(--heart);--value:${0}`
                ratingValue.value = 0
                ratingSpan.innerText = 0
                messageTextValue.value = ''
            }
        }else{

            reviewId_Order = 0

            alert(data.error)
        }
    }).catch((err) => {
        console.log(err)
    })
    
}


const ratingSpan = document.getElementById('ratingSpan')
const ratingValue = document.getElementById('ratingValue')
const messageTextValue = document.getElementById('messageTextValue')

let reviewId_Order = 0

let productId_review = 0
let orderId_review = 0

function handleInputRating(event){
    ratingSpan.innerText = event.target.value;
}


function handleRatingForm(event){
    event.preventDefault();

    const payload = {
        ProductId : productId_review,
        OrderId : orderId_review,
        NewRating : ratingValue.value,
        Description : messageTextValue.value
    }
    console.log(payload);

    
    fetch(`${baseUrl}/review/add`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'authorization': `Bearer ${token}`
        },
        body : JSON.stringify(payload)
    })
        .then((res) => {
            return res.json()
        })
        .then((data) => {

            console.log(data);
            if(data.Success){
                alert(data.msg)
                location.reload()
            }else{
                alert(data.error)
            }

        })
        .catch((err) => {
            console.log(err)
        })

}

function handleDeleteOrderReview(){
    if(!reviewId_Order){
        alert('Your Review is not found.')
        return
    }
    if(!confirm(' Are you sure you want to delete this review?')){
        return
    }
    
    fetch(`${baseUrl}/review/delete/${reviewId_Order}`, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    }).then((res) => {
        return res.json()
    }).then((data) => {
        if(data.Success){
            alert(data.msg)
            location.reload()
        }else{
            alert(data.error)
        }
    }).catch((err) => {
        console.log(err)
    })
}


$('#exampleModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var recipient = button.data('whatever') // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this)

    // modal.find('.modal-title').text('New message to ' + recipient)
    // modal.find('.modal-body input').val(recipient)
})

