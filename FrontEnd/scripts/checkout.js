
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

        // DiscountPrice();

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
    
    <button id="Place_Order">Place Order</button>
    
    `
}

{/* <div>
        <p>Use <span id="Special_Code">Jai Shree Ram</span> as coupon code to get extra 40% off </p>
        <input type="text" placeholder="Coupon Code" id="coupon_box">
        <button id="discount_reward">Apply</button>
    </div> */}


function PlaceNewOrder(Address) {

    let placeorderbtn = document.getElementById("Place_Order");
    let paymentoption = document.getElementById("PaymentOption");

    placeorderbtn.addEventListener("click", function (e) {
        e.preventDefault()
        if (paymentoption.value === "") {
            alert("kindly select a valid payment option !")
            return
        }
        else if (paymentoption.value === "Cash on Delivery") {

            Shooping(Address, 'Cash-On-Delivery');

        }
        else {


            showRazorPayBtnFunc(Address)

            // setTimeout(function () {
            //     // Shooping(Address);
            //     alert("Transaction Successfull !!");
            // }, 3000)
        }
    })
}



function Shooping(Address,PaymentMode, razorpay_payment_id='', razorpay_order_id='', razorpay_signature='') {

    const MyOrders = {};

    const Orders = []

    for (let item of ProductData) {

        let order = {}

        order.Address = Address;
        order.Quantity = item.Quantity;
        order.ProductID = item.product._id;

        order.TotalPrice = +(item.product.Price) * +(item.Quantity)

        order.PaymentMode = PaymentMode

        order.razorpay_payment_id = razorpay_payment_id
        order.razorpay_order_id = razorpay_order_id
        order.razorpay_signature = razorpay_signature

        Orders.push(order)



    }

    MyOrders.Orders = Orders;

    console.log(MyOrders)


    // UpdateBEServer(MyOrders);


}


function UpdateBEServer(MyOrders) {

    console.log("kya order aaya yhan : ", MyOrders);

    fetch(`${BaseUrL}/order/place`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'authorization': `Bearer ${token}`
        },
        body: JSON.stringify(MyOrders)
    })
        .then((res) => {
            return res.json()
        })
        .then((data) => {

            console.log(data)

            if (data.Success) {

                alert(data.msg)

                ClearCart()

                window.location = "../index.html";

            }
        })
        .catch((err) => {
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




// function DiscountPrice() {

//     let count = 0;

//     let discountCode = document.getElementById("coupon_box");

//     let discountapplybtn = document.getElementById("discount_reward");


//     discountapplybtn.addEventListener("click", function (e) {

//         e.preventDefault()


//         if (discountCode.value === "Jai Shree Ram" && count == 0) {

//             let Total_Amount = document.querySelector("#Customer_Cart_items  > p > span");

//             let finalPrice = parseInt(Total_Amount.textContent);

//             finalPrice = finalPrice * 0.6;

//             Cart_Amount = finalPrice;

//             Total_Amount.textContent = finalPrice + " Rs";

//             count++;

//         }

//     })

// }


function calculateCartTotal() {

    Cart_Amount = 0;

    if (ProductData.length !== 0) {

        for (let item of ProductData) {

            Cart_Amount += (item.Quantity) * (item.product.Price);

        }


    }
}



function ClearCart() {

    console.log("cart khali karo")

    fetch(`${BaseUrL}/cart/empty`, {
        method: 'delete',
        headers: {
            'Content-type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    })
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            console.log("@@@----->", data)
        })
        .catch((err) => {
            console.log(err)
        })

}










// Razorpay

function showRazorPayBtnFunc(Address) {

    document.getElementById('onlinePaymentSection').innerHTML = `
                                <button id="rzp-button1">Pay with Razorpay</button>`;



    var orderId;
    $(document).ready(function () {
        var settings = {
            "url": "http://localhost:3000/checkout/create/orderId",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "amount": "50000"
            }),
        };


        $.ajax(settings).done(function (response) {
            console.log('response obj==>', response);

            orderId = response.orderId;
            console.log(orderId);
        });




        document.getElementById('rzp-button1').onclick = function (e) {

            console.log(orderId);

            var options = {
                "key": "rzp_test_FePSDKRvTiVZWa", // Enter the Key ID generated from the Dashboard
                "amount": "50000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                "currency": "INR",
                "name": "Acme Corp",
                "description": "Test Transaction",
                "image": "https://example.com/your_logo",
                "order_id": orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                "handler": function (response) {
                    console.log(response);
                    // alert('payment-id==>')
                    alert(response.razorpay_payment_id);
                    // alert('order -id==>')
                    alert(response.razorpay_order_id);
                    // alert('signature-id==>')
                    alert(response.razorpay_signature);

                    const razorpay_payment_id = response.razorpay_payment_id
                    const razorpay_order_id = response.razorpay_order_id
                    const razorpay_signature = response.razorpay_signature




                    var settings = {
                        "url": "http://localhost:3000/checkout/api/payment/verify",
                        "method": "POST",
                        "timeout": 0,
                        "headers": {
                            "Content-Type": "application/json"
                        },
                        "data": JSON.stringify({ response }),
                    }




                    //creates new orderId everytime
                    $.ajax(settings).done(function (response) {
                        console.log('response obj==>', response);

                        orderId = response.orderId;
                        console.log(orderId);
                        $("button").show();
                        if (response.signatureIsValid) {

                            console.log('okay order placed successfully');
                            Shooping(Address, 'Internet-Banking', razorpay_payment_id, razorpay_order_id, razorpay_signature)

                        } else {

                            console.log('order not placed succcessfully');
                            alert('Something Went Wrong ! (Please Try After Some Time)')

                        }
                        // alert(JSON.stringify(response))
                    });
                },

                "theme": {
                    "color": "#3399cc"
                }
            };
            var rzp1 = new Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                alert(response.error.code);
                alert(response.error.description);
                alert(response.error.source);
                alert(response.error.step);
                alert(response.error.reason);
                alert(response.error.metadata.order_id);
                alert(response.error.metadata.payment_id);
            });
            rzp1.open();
            e.preventDefault();
        }

    });
}




// Razorpay