
const BaseUrL = `http://localhost:3000`

let ProductData = [];

let Cart_Amount = 0;

const token = localStorage.getItem("usertoken") || null;

if (token) {
    fetchAndRenderCart();
}

else {

    document.body.innerHTML = null

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


    if (C_fname && C_lname && C_country && C_address && C_city && C_state && C_zip && C_phone) {

        let Address = `${C_fname} ${C_lname} , ${C_address}, ${C_country} , ${C_state}, ${C_city} , ${C_zip} , ${C_phone}`

        getPaymentoption();

        PlaceNewOrder(Address);

    }

    else {

        Swal.fire('Kindly provide All required details ! ', '', 'warning')

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



function PlaceNewOrder(Address) {

    let placeorderbtn = document.getElementById("Place_Order");
    let paymentoption = document.getElementById("PaymentOption");

    placeorderbtn.addEventListener("click", function (e) {
        e.preventDefault()
        if (paymentoption.value === "") {
            Swal.fire('kindly select a valid payment option !', '', 'warning')
            return
        }
        else if (paymentoption.value === "Cash on Delivery") {

            Shooping(Address, 'Cash-On-Delivery');

        }
        else {
            showRazorPayBtnFunc(Address)
        }
    })
}



function Shooping(Address, PaymentMode, razorpay_payment_id = '', razorpay_order_id = '', razorpay_signature = '') {

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


    UpdateBEServer(MyOrders);


}


async function UpdateBEServer(MyOrders) {

    try {

        let res = await fetch(`${BaseUrL}/order/place`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'authorization': `Bearer ${token}`
            },
            body: JSON.stringify(MyOrders)
        })
        
        let data = await res.json()
    
        console.log(data)
    
        if (data.Success) {
    
            await ClearCart()
            
            Swal.fire({
                title: data.msg,
                icon: 'success',
                confirmButtonText: 'Ok'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location = "../index.html";
                }
            })
        }else{
            swal.fire(data.msg,'Try Again','error')
        }
        
    } catch (error) {
        console.log(error);
    }

}



function fetchAndRenderCart() {

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
                Swal.fire(data.msg, '', 'error')

            }

        })
        .catch((err) => {
            Swal.fire(err, '', 'error')
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



function calculateCartTotal() {

    Cart_Amount = 0;

    if (ProductData.length !== 0) {

        for (let item of ProductData) {

            Cart_Amount += (item.Quantity) * (item.product.Price);

        }


    }
}



async function ClearCart() {


    let res = await fetch(`${BaseUrL}/cart/empty`, {
        method: 'delete',
        headers: {
            'Content-type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    })

    let data = await res.json()

    console.log(data);


}










// Razorpay

var orderId;
function showRazorPayBtnFunc(Address) {

    document.getElementById('onlinePaymentSection').innerHTML = `
                                <button id="rzp-button1">Pay with Razorpay</button>`;



    $(document).ready(function () {
        var settings = {
            "url": `${BaseUrL}/checkout/create/orderId`,
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "amount": Cart_Amount * 100
            }),
        };


        $.ajax(settings).done(function (response) {
            console.log('response obj==>', response);

            orderId = response.orderId;
            console.log('order id created ==> ',orderId);
        });




        document.getElementById('rzp-button1').onclick = function (e) {

            console.log(orderId);

            var options = {
                "key": "rzp_test_FePSDKRvTiVZWa", // Enter the Key ID generated from the Dashboard
                "amount": Cart_Amount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                "currency": "INR",
                "name": "Shopcity",
                "description": "Order Place",
                "image": "https://example.com/your_logo",
                "order_id": orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                "handler": function (response) {

                    console.log('response handler =>', response);

                    const razorpay_payment_id = response.razorpay_payment_id
                    const razorpay_order_id = response.razorpay_order_id
                    const razorpay_signature = response.razorpay_signature

                    console.log('payment id ', razorpay_payment_id);
                    console.log('order id ', razorpay_order_id);
                    console.log('signature ', razorpay_signature);

                    var settings = {
                        "url": `${BaseUrL}/checkout/api/payment/verify`,
                        "method": "POST",
                        "timeout": 0,
                        "headers": {
                            "Content-Type": "application/json"
                        },
                        "data": JSON.stringify({ response }),
                    }




                    //creates new orderId everytime
                    $.ajax(settings).done(function (response) {
                        console.log('response obj -->', response);

                        // orderId = response.orderId;

                        console.log('order id from response -->',orderId);
                        
                        $("button").show();
                        if (response.signatureIsValid) {

                            console.log('okay order placed successfully');
                            Shooping(Address, 'Internet-Banking', razorpay_payment_id, razorpay_order_id, razorpay_signature)

                        } else {

                            console.log('order not placed succcessfully');

                            Swal.fire('Something Went Wrong! ', 'Please Try After Some Time', 'error')

                        }

                    });
                },

                "theme": {
                    "color": "#3399cc"
                }
            };
            var rzp1 = new Razorpay(options);
            rzp1.on('payment.failed', function (response) {

                Swal.fire('Transaction Failed !', 'If Amount is Deducted then refund will be initiated shortly.', 'error')

            });
            rzp1.open();
            e.preventDefault();
        }

    });
}




// Razorpay





const countries = {

    "United States": ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"],
    "Canada": ["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Nova Scotia", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan"],
    "Australia": ["New South Wales", "Queensland", "South Australia", "Tasmania", "Victoria", "Western Australia"],
    "India": ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"],
    "United Kingdom": ["England", "Scotland", "Wales", "Northern Ireland"],
    "Germany": ["Baden-Württemberg", "Bavaria", "Berlin", "Brandenburg", "Bremen", "Hamburg", "Hesse", "Lower Saxony", "Mecklenburg-Vorpommern", "North Rhine-Westphalia", "Rhineland-Palatinate", "Saarland", "Saxony", "Saxony-Anhalt", "Schleswig-Holstein", "Thuringia"],
    "France": ["Auvergne-Rhône-Alpes", "Bourgogne-Franche-Comté", "Brittany", "Centre-Val de Loire", "Corsica", "Grand Est", "Hauts-de-France", "Île-de-France", "Normandy", "Nouvelle-Aquitaine", "Occitanie", "Pays de la Loire", "Provence-Alpes-Côte d'Azur"],
    "China": ["Beijing", "Shanghai", "Guangdong", "Jiangsu", "Zhejiang", "Fujian", "Shandong", "Hunan", "Hubei", "Henan", "Sichuan", "Chongqing", "Hebei", "Liaoning", "Anhui", "Jiangxi", "Shaanxi", "Yunnan", "Hainan", "Guizhou", "Shanxi", "Tianjin", "Gansu", "Guangxi", "Jilin", "Inner Mongolia", "Ningxia", "Xinjiang", "Qinghai", "Tibet"],
    "Brazil": ["São Paulo", "Rio de Janeiro", "Bahia", "Minas Gerais", "Rio Grande do Sul", "Paraná", "Pernambuco", "Ceará", "Pará", "Santa Catarina", "Maranhão", "Goiás", "Amazonas", "Espírito Santo", "Paraíba", "Rio Grande do Norte", "Alagoas", "Mato Grosso", "Distrito Federal", "Mato Grosso do Sul", "Sergipe", "Rondônia", "Tocantins", "Acre", "Amapá", "Roraima"],
    "Japan": ["Hokkaido", "Aomori", "Iwate", "Miyagi", "Akita", "Yamagata", "Fukushima", "Ibaraki", "Tochigi", "Gunma", "Saitama", "Chiba", "Tokyo", "Kanagawa", "Niigata", "Toyama", "Ishikawa", "Fukui", "Yamanashi", "Nagano", "Gifu", "Shizuoka", "Aichi", "Mie", "Shiga", "Kyoto", "Osaka", "Hyogo", "Nara", "Wakayama", "Tottori", "Shimane", "Okayama", "Hiroshima", "Yamaguchi", "Tokushima", "Kagawa", "Ehime", "Kochi", "Fukuoka", "Saga", "Nagasaki", "Kumamoto", "Oita", "Miyazaki", "Kagoshima", "Okinawa"],
    "Russia": ["Moscow", "Saint Petersburg", "Novosibirsk", "Yekaterinburg", "Nizhny Novgorod", "Kazan", "Chelyabinsk", "Omsk", "Samara", "Rostov-on-Don", "Ufa", "Krasnoyarsk", "Voronezh", "Perm", "Volgograd", "Krasnodar", "Saratov", "Tyumen", "Tolyatti", "Izhevsk", "Barnaul", "Ulyanovsk", "Irkutsk", "Khabarovsk", "Yaroslavl", "Vladivostok", "Makhachkala", "Tomsk", "Orenburg", "Kemerovo", "Novokuznetsk"]
    // Add more countries and states as needed
};



fetchAndRenderCountries()


function fetchAndRenderCountries() {

    const countrysel = document.getElementById("Country_Name")

    const countryNames = Object.keys(countries)

    const countryseldata = countryNames.map((ele) => {
        return getSelectTagOptions(ele)
    }).join('')


    countrysel.innerHTML = `<option value="">Select Country</option>${countryseldata}`


}



function getSelectTagOptions(e) {
    return `<option value="${e}">${e}</option>`
}


function handleStateSelect(event) {

    const stateselect = document.getElementById('State_Select')

    let cn = event.target.value;

    if (!cn) {
        stateselect.innerHTML = ''
        return
    }

    let states = countries[cn];


    const stateseldata = states.map((ele) => {
        return getSelectTagOptions(ele)
    }).join('')


    stateselect.innerHTML = `<option value="">Select State</option>${stateseldata}`

}