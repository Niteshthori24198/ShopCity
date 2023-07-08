
const admin_baseurl = `http://localhost:3000`


const adminusertoken = localStorage.getItem('usertoken') || null;

if (!adminusertoken) {

    document.body.innerHTML = ''


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

let fetchedUserData = []
let orderPage_OrderData = []

fetchUsersData();

function fetchUsersData() {

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
            console.log("user data fetched ", data.UsersData);

            fetchUsersData = data.UsersData;

            // Fetch Order After Fetching Users Data
            fetchAndRenderOrders()

        })
        .catch((err) => {
            console.log(err)
        })


}



// fetchAndRenderOrders()

function fetchAndRenderOrders() {

    fetch(`${admin_baseurl}/order/getall`, {
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
            console.log("order data fetched ", data)
            formateOrdersData(data.Orders)

        })
        .catch((err) => {
            console.log(err)
        })


}

function formateOrdersData(Orders) {

    const OrderData = Orders.reduce((acc, curr) => {

        const customerId = curr.UserID;

        const Customer = fetchUsersData.find((item) => (item._id == customerId))

        const Products = curr.Products.reduce((accumaltor, productItem) => {

            const obj = {}

            obj._id = productItem._id;

            obj.customerId = customerId;
            obj.shippingAddress = productItem.Address;
            obj.orderDate = productItem.Date;
            obj.orderQuantity = productItem.Quantity;
            obj.orderStatus = productItem.Status;
            obj.Product = productItem.product;
            obj.Customer = Customer;

            obj.TotalPrice = productItem.TotalPrice;
            obj.PaymentMode = productItem.PaymentMode;

            obj.razorpay_payment_id = productItem.razorpay_payment_id;
            obj.razorpay_order_id = productItem.razorpay_order_id;
            obj.razorpay_signature = productItem.razorpay_signature;


            accumaltor.push(obj);

            return accumaltor;

        }, []);

        // console.log(customerId,Products)

        acc.push(...Products);
        return acc;

    }, []);


    console.log("---> ", OrderData);

    OrderData.reverse().sort((a, b) => {
        return (new Date(b.orderDate) - new Date(a.orderDate))
    })

    orderPage_OrderData = OrderData

    RenderOrders(OrderData);
}




function RenderOrders(OrderData) {

    document.getElementById("adminordercontainer").innerHTML = '';

    const ordercard = OrderData.map((item) => {

        return GetOrderCard({ ...item });

    }).join('')

    document.getElementById("adminordercontainer").innerHTML = ordercard;


    const ordersstatus = document.querySelectorAll('.orderstatuscolor')


    for (let i = 0; i < ordersstatus.length; i++) {

        const statuscheck = ordersstatus[i].innerText.split(': ')

        // console.log(statuscheck)

        if (statuscheck[0] === 'Delivered') {
            ordersstatus[i].style.color = 'green'
        }

        else if (statuscheck[0] === 'Confirmed') {
            ordersstatus[i].style.color = 'blue'
        }
        else {
            ordersstatus[i].style.color = 'red'
        }

    }


}


function GetOrderCard({ _id, Customer, Product, customerId, orderDate, orderQuantity, orderStatus, shippingAddress, TotalPrice, PaymentMode, razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
    // console.log(Product);


    return `
   
    <div>

        <div>

          <img src="${Product?.Image}" alt="product" />

        </div>

        <div>

            <p> <span> Product </span>  :- ${Product?.Title}  </p>
          

            <p> <span> Customer </span>  : ${Customer?.Name} </p>
            <p> <span> Email </span>  : ${Customer?.Email} </p>
            <p> <span> Contact </span>  : ${Customer?.Contact} </p>
            
            <p> <span> Ordered Quantity </span>  :- ${orderQuantity}</p>
            <p> <span> Total Price </span>  :- Rs. ${TotalPrice} </p>
            
            <p> <span> Order Date </span>  :- ${orderDate} </p>
            
            
        </div>
            
        <div>
            
            
            <p> <span> Shipping Address </span>  :- ${shippingAddress} </p>

            <p> <span> Order ID </span>  :- ${_id} </p>
            <p> <span> Payment Mode </span>  :- ${PaymentMode} </p>
            ${PaymentMode == 'Internet-Banking' ? `<p style="font-size:14px;"> <span> payment_id </span>  :- ${razorpay_payment_id} </p>` : ''}
            
            
        </div>
            
        <div>
        
            <p > Status : <span class="orderstatuscolor"> ${orderStatus} </span></p>
            ${orderStatus == 'Confirmed' ? `<button onclick="handleDeveivery('${_id}')" id="${_id}"> Delivered </button>` : ''}

        </div>
       
    </div>
    
    `

}




function handleDeveivery(ID) {


    Swal.fire({

        title: 'Are you sure you want to mark the product as delivered?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'

    }).then((result) => {

        if (result.isConfirmed) {

            userProductDeliverHandle()
        }
    })


    function userProductDeliverHandle() {

        document.getElementById(ID).innerHTML = '<i class="fa fa-refresh fa-spin"></i> Delivered'

        fetch(`${admin_baseurl}/order/updatestatus/${ID}`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${adminusertoken}`
            }
        })
            .then((res) => {
                return res.json()
            })
            .then((data) => {

                document.getElementById(ID).innerHTML = 'Delivered'

                console.log(data)
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
            })
            .catch((err) => {
                document.getElementById(ID).innerHTML = 'Delivered'
                console.log(err)
            })
    }

}





// searchbar
function handleNavSearchBarOrder(value) {
    // console.log(value);

    if (value === '' || !value) {
        RenderOrders(orderPage_OrderData)
        return
    }

    value = value.toLowerCase()


    const filterData = orderPage_OrderData.filter((ord) => {
        return (ord.orderStatus.toLowerCase().includes(value) || ord.Product.Title.toLowerCase().includes(value) || ord.Customer.Email.toLowerCase().includes(value) || ord.Customer.Name.toLowerCase().includes(value) || ord.shippingAddress.toLowerCase() == value)
    })

    RenderOrders(filterData)



}