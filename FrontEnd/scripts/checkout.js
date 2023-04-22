
const BaseUrL = `http://localhost:3000`

let ProductData = [];

let Cart_Amount = 0;

const token = localStorage.getItem("usertoken") || null;

if (token) {
    fetchAndRenderCart();
}

else {
    alert("Kindly Login First. Your Token is might be Expired or Invalid !");
    location.href = "../view/user.login.html"
}


let CustomerFirstName = document.getElementById("CustomerFName");

let CustomerLastName = document.getElementById("CustomerLName");

let CountrySelect = document.getElementById("Country_Name");

let CustomerAddress = document.getElementById("CustomerAddress");

let CustomerCity = document.getElementById("CustomerCityName");

let CustomerState = document.getElementById("State_Select");

let CustomerZipcode = document.getElementById("CustomerZipCode");

let CustomerPhoneNumber = document.getElementById("CustomerPhoneNumber");

let CustomerCart = document.getElementById("Customer_Cart_items");

let OrderCheckoutButton = document.querySelector("#checkout_form > div:nth-child(6) > button");



OrderCheckoutButton.addEventListener("click", function (e) {

    e.preventDefault()

    let C_fname = CustomerFirstName.value;
    let C_lname = CustomerLastName.value;
    let C_country = CountrySelect.value;
    let C_address = CustomerAddress.value;
    let C_city = CustomerCity.value;
    let C_state = CustomerState.value;
    let C_zip = CustomerZipcode.value;
    let C_phone = CustomerPhoneNumber.value;

    //console.log(C_fname,C_lname,C_country,C_address,C_city,C_state,C_zip,C_phone);

    if (C_fname && C_lname && C_country && C_address && C_city && C_state && C_zip && C_phone) {

        // address of customer including All details


        let Address = `${C_fname} ${C_lname} , ${C_address}, ${C_country} , ${C_state}, ${C_city} , ${C_zip} , ${C_phone}`

        //console.log(obj)

        getPaymentoption();

        DiscountPrice();

        PlaceNewOrder(Address);

    }

    else {
        alert("Kindly provide All required details ! ")
    }

})



function getPaymentoption() {

    let paymentContainer = document.querySelector(".PaymentSection");

    paymentContainer.innerHTML = `<p>Payment</p>
    <select name="Payment" id="PaymentOption">
        <option value="">Select</option>
        <option value="Cash on Delivery">Cash on Delivery</option>
        <option value="Online">Internet Banking</option>
    </select>
    <div>
        <p>Use <span id="Special_Code">Jai Shree Ram</span> as coupon code to get extra 40% off </p>
        <input type="text" placeholder="Coupon Code" id="coupon_box">
        <button id="discount_reward">Apply</button>
    </div>
    <button id="Place_Order">Place Order</button>`
}


function PlaceNewOrder(Address) {

    let placeorderbtn = document.getElementById("Place_Order");
    let paymentoption = document.getElementById("PaymentOption");

    placeorderbtn.addEventListener("click", function (e) {
        e.preventDefault()
        if (paymentoption.value === "") {
            alert("kindly select a valid payment option !")
        }
        else if (paymentoption.value === "Cash on Delivery") {

            Shooping(Address);

        }
        else {
            setTimeout(function () {
                Shooping(Address);
                alert("Transaction Successfull !!");
            }, 3000)
        }
    })
}



function Shooping(Address) {

    const MyOrders = {};

    const Orders = []

    for (let item of ProductData) {

        let order = {}

        order.Address = Address;
        order.Quantity = item.Quantity;
        order.ProductID = item.product._id;

        Orders.push(order)

        

    }

    MyOrders.Orders=Orders;

    console.log(MyOrders)

    UpdateBEServer(MyOrders);


}


function UpdateBEServer(MyOrders) {

    console.log("kya order aaya yhan : ", MyOrders);

    fetch(`${BaseUrL}/order/place`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'authorization':`Bearer ${token}`
        },
        body: JSON.stringify(MyOrders)
    })
    .then((res) => {
        return res.json()
    })
    .then((data) => {

        console.log(data)

        if(data.Success){

            alert(data.msg)

            ClearCart()

            window.location = "../index.html";

        }
    })
    .catch((err)=>{
        console.log(err)
    })

}



function fetchAndRenderCart() {

    console.log("hyy")

    fetch(`${BaseUrL}/cart/get`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    })
        .then((res) => {
            return res.json()
        })
        .then((data) => {

            console.log(data.CartItem.Products)

            if (data.Success) {

                ProductData = data.CartItem.Products;

                RenderCartItem(ProductData)

            }

            else {
                alert(data.msg)
            }

        })
        .catch((err) => {
            alert(err)
        })

}



function RenderCartItem(data) {

    let Cards = data.map((item) => {
        return getCards(item.product.Image, item.product.Title, item.product.Category, item.Quantity, item.product.Price)
    }).join("")


    CustomerCart.innerHTML = `${Cards}<p>Total :- <span> </span></p>`

    let Total_Amount = document.querySelector("#Customer_Cart_items  > p > span");


    calculateCartTotal();

    console.log("cart ka amount -->", Cart_Amount)

    Total_Amount.textContent = Cart_Amount + " Rs";


}


function getCards(image, title, cat, quant, price) {


    return `<div>

                <div>
                    <img src="${image}" alt="Error">
                </div>

                <div>
                    <p>${title}</p>
                    <p>${cat}</p>
                    <p>Quantity : ${quant}</p>
                    <p>Price : ${price} Rs</p>
                </div>

            </div>`

}




function DiscountPrice() {

    let count = 0;

    let discountCode = document.getElementById("coupon_box");

    let discountapplybtn = document.getElementById("discount_reward");


    discountapplybtn.addEventListener("click", function (e) {

        e.preventDefault()


        if (discountCode.value === "Jai Shree Ram" && count == 0) {

            let Total_Amount = document.querySelector("#Customer_Cart_items  > p > span");

            let finalPrice = parseInt(Total_Amount.textContent);

            finalPrice = finalPrice * 0.6;

            Cart_Amount = finalPrice;

            Total_Amount.textContent = finalPrice + " Rs";

            count++;

        }

    })

}


function calculateCartTotal() {

    Cart_Amount = 0;

    if (ProductData.length !== 0) {

        for (let item of ProductData) {

            Cart_Amount += (item.Quantity) * (item.product.Price);

        }


    }
}



function ClearCart(){

    console.log("cart khali karo")

    fetch(`${BaseUrL}/cart/empty`,{
        method:'delete',
        headers:{
            'Content-type':'application/json',
            'authorization':`Bearer ${token}`
        }
    })
    .then((res)=>{
        return res.json()
    })
    .then((data)=>{
        console.log("@@@----->",data)
    })
    .catch((err)=>{
        console.log(err)
    })

}