

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
        return getordersBox(item._id, item.Date, item.Address, item.Status, item.product.Image, item.product.Title, item.product.Category, item.product.Price, item.Quantity)
    }).join('')

    allOrdersHere.innerHTML = orderHTML;
}

// ***
function getordersBox(id, date, add, status, img, title, cat, price, quant) {

    return (
        `
            <div>
                <div>
                    <img src="${img}" alt="error">
                </div>
                <div>
                    <h3>Product :- ${title} [${cat}]</h3>
                    <p>Order Date :- ${date}</p>
                    <p>Quantity :- ${quant}</p>
                    <p>Total Price :- ${quant * price} Rs</p>
                    <p>Order Status :- ${status}</p>
                    <p>Shipping Address :- ${add}</p>
                    ${((status == 'Delivered') || (status == 'Cancelled')) ? '' : `<button onclick="handleCancel('${id}')" class="cancelbtn" >Cancel Order</button>`}

                    ${(status !== 'Delivered') ? openFormForReviewHTML() : ''}
                   
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





function openFormForReviewHTML() {

    document.getElementById('boxForStoreReviewFormOpenHTML').innerHTML = `
                    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">New message</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        </div>
                        <div class="modal-body">
                        <form>
                            <div class="form-group">
                            <label for="recipient-name" class="col-form-label">Name:</label>
                            <input type="text" class="form-control" id="recipient-name">

                            <label class="rating-label">Rating</strong>
                            <input class="rating" max="5" oninput="this.style.setProperty('--value', '${ this.valueAsNumber } ')" step="0.25"
                                style="--fill: #C8102E;--symbol:var(--heart);--value:2.75" type="range" value="2.75" id="ratingValue">
                            </label>
                            
                            </div>

                            <div class="form-group">
                            <label for="message-text" class="col-form-label">Message:</label>
                            <textarea class="form-control" id="message-text"></textarea>
                            </div>
                        </form>
                        </div>
                        <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Send message</button>
                        </div>
                    </div>
                    </div>
                </div>`

    // <!-- A button to open the popup form -->
    return `<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-whatever="@getbootstrap">Review</button>`
}




$('#exampleModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var recipient = button.data('whatever') // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this)
    modal.find('.modal-title').text('New message to ' + recipient)
    modal.find('.modal-body input').val(recipient)
})