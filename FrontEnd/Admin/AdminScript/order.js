
const admin_baseurl = `http://localhost:3000`


const adminusertoken = localStorage.getItem('usertoken') || null;

if (!adminusertoken) {
    location.href = "../../view/user.login.html"
}

let fetchedUserData = []

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

        console.log(statuscheck)

        if (statuscheck[0] === 'Delivered') {
            ordersstatus[i].style.color='green'
        }

        else if (statuscheck[0] === 'Confirmed') {
            ordersstatus[i].style.color='blue'
        }
        else {
            ordersstatus[i].style.color='red'
        }

    }


}


function GetOrderCard({ _id, Customer, Product, customerId, orderDate, orderQuantity, orderStatus, shippingAddress }) {
    // console.log(Product);


    return `
   
    <div>

        <div>

          <img src="${Product?.Image}" alt="product" />

        </div>

        <div>

            <p> <span> Product </span>  :- ${Product?.Title} [${Product?.Category}] </p>
            <p> <span> Price </span>  :- ${Product?.Price} Rs. </p>

            <p> <span> Customer </span>  : ${Customer?.Name} </p>
            <p> <span> Email </span>  : ${Customer?.Email} </p>
            <p> <span> Contact </span>  : ${Customer?.Contact} </p>
            
            
            <p> <span> Left Item </span> :- ${Product?.Quantity}</p>

        </div>

        <div>

            <p> <span> Ordered Quantity </span>  :- ${orderQuantity}</p>
            <p> <span> Total Price </span>  :- ${Product?.Price * orderQuantity} </p>
            <p> <span> Order Date </span>  :- ${orderDate} </p>
            <p> <span> Shipping Address </span>  :- ${shippingAddress} </p>

        </div>

        <div>
            <p > Status : <span class="orderstatuscolor"> ${orderStatus} </span></p>
            ${orderStatus == 'Confirmed' ? `<button onclick="handleDeveivery('${_id}')"> Delevered </button>` : ''}
        </div>
       
    </div>
    
    `

}




function handleDeveivery(ID) {

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
            console.log(data)
            if (data.Success) {
                alert(data.msg)
                location.reload()
            }
        })
        .catch((err) => {
            console.log(err)
        })


}


