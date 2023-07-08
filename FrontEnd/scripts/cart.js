
let cartitems = []


const BaseUrl = `http://localhost:3000`


// take it from local storrage.

const token = localStorage.getItem("usertoken") || null;


if (!token) {

    document.body.innerHTML = null

    Swal.fire({

        title: 'Kindly Login First to Access cart section.',

        icon: 'error',

        confirmButtonText: 'Ok'

    }).then((result) => {

        if (result.isConfirmed) {

            location.href = "../view/user.login.html"
        }

    })

}

let Cart_Amount = 0;

let iscartvalid=true;


let MainCartSection = document.getElementById("Nitesh_Cart_items");

let Total_Amount = document.querySelector("#Nitesh_Order_Summary > div > h3 > span");

let SubTotal = document.querySelector("#Nitesh_Order_Summary > div > p:nth-child(2) > span");


let checkoutbtn = document.querySelector("#nitesh_checkoutbtn");

checkoutbtn.addEventListener("click", function (e) {


    if (token && cartitems.length) {

        if(iscartvalid){

            window.location = "../view/checkout.html";
        }
        else{
            swal.fire('Kindly remove Out of Stock Item from cart for proceed to checkout.','We are sorry for this inconvience, the product gets available soon.🤗','warning')
        }

    }

})


fetchAndRenderCart();

function fetchAndRenderCart() {


    MainCartSection.innerHTML = `<div id="loading_gif"><img  src="../Images/Loading.gif" alt="Loading ...."/></div>`


    fetch(`${BaseUrl}/cart/get`, {
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

            console.log("cart response", data);

            if (data.Success) {

                // console.log(data.CartItem);

                cartitems = [...data.CartItem.Products];


                if (cartitems.length) {

                    RenderCartItem(data.CartItem.Products)
                }

                else {
                    Emptycart();
                }
            }

            else {
                Emptycart();
            }


        })
        .catch((err) => {
            console.log(err)
        })

}



function Emptycart() {

    let MainCartSection = document.getElementById("Nitesh_Cart_items");

    MainCartSection.innerHTML = `<p>Your Shopping Cart is Empty !</p>`
    MainCartSection.style.backgroundImage = `url('https://thumbs.gfycat.com/CompleteShallowFlyingsquirrel-size_restricted.gif')`
    MainCartSection.style.height = "480px"
    MainCartSection.style.display = 'flex';
    MainCartSection.style.justifyContent = 'center'
    MainCartSection.style.backgroundRepeat = 'no-repeat'
    MainCartSection.style.backgroundPosition = 'center'
    MainCartSection.style.backgroundSize = 'auto';
}


function RenderCartItem(data) {

    let len = data.length;
    let totalCartCount = document.getElementById('totalCartCount')

    if (len == 0) {
        totalCartCount.innerText = `Empty Cart`
    } else if (len == 1) {
        totalCartCount.innerText = `1 Item`
    } else {
        totalCartCount.innerText = `${len} Item's`
    }

    let Cards = data.map((item) => {

        return getCards(item.product.Image, item.product.Title, item.product.Category, item.product.Description, item.product.Price, item.Quantity, item.product._id, item.product.Quantity
        )
    }).join("")

    MainCartSection.innerHTML = ''

    MainCartSection.innerHTML = `${Cards}`;

    CalculateCartPrice();


    let Qunatity_Select = document.querySelectorAll("#Nitesh_Cart_items > div > select");


    for (let i of Qunatity_Select) {

        i.addEventListener("change", function (e) {

            e.preventDefault();

            console.log(e.target.value, e.target.id);

            const Payload = {
                Quantity: +e.target.value
            }

            const ProductID = e.target.id;

            UpdateCartStatus(ProductID, Payload);

        })
    }


    let Remove_button = document.querySelectorAll("#Nitesh_Cart_items button");

    for (let i of Remove_button) {

        i.addEventListener("click", function (e) {
            e.preventDefault();

            const ProductID = e.target.id;

            RemoveItemFromCart(ProductID);

        })
    }

}


function getCards(Image, Title, Category, Description, Price, Quantity, id, totalAvailbleQuantity) {


    return `<div>
            <img src="${Image}" alt="Error" onclick="goToDetailPage('${id}')">
            <h5>${Title}</h5>
            <p>${Category}</p>
            <p>${Description.substring(0, 50)} Rs</p>
            <p>Price : ${Price} Rs</p>
            ${totalAvailbleQuantity > 0 ? getQuantitySelect(totalAvailbleQuantity, Quantity, id, true) :
            getQuantitySelect(totalAvailbleQuantity, Quantity, id, false)}
            
            <button id="${id}">Remove</button>
        </div>`

}

function goToDetailPage(id) {
    console.log(id);
    localStorage.setItem('productID', id);
    location.href = '../view/details.html'
}

function getQuantitySelect(totalavailbe, selectedQuantity, id, inStock) {

    if (!inStock) {
        iscartvalid=false;
        return `
        <select name="quantity" id="${id}" disabled style="background-color:transparent;color:red;font-weight:bolder;border:1px solid black">

        <option value="">Out Of Stock</option>

        </select>
    `;
    }

    let otpions = ''
    for (let i = 0; i < totalavailbe && i < 10; i++) {
        otpions += `<option value="${i + 1}" ${selectedQuantity == (i + 1) ? "Selected" : ""}>Quantity :- ${i + 1}</option>`
    }
    return `
        <select name="quantity" id="${id}">
            ${otpions}
        </select>
    `;

}



function CalculateCartPrice() {

    Cart_Amount = 0;

    if (cartitems.length !== 0) {

        for (let item of cartitems) {
            Cart_Amount += (item.Quantity) * (item.product.Price);
            Total_Amount.textContent = Cart_Amount + " Rs";
            SubTotal.textContent = Cart_Amount + " Rs";
        }


    }
}



function UpdateCartStatus(ProductID, Payload) {

    fetch(`${BaseUrl}/cart/update/${ProductID}`, {
        method: 'PATCH',
        headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${token}`
        },
        body: JSON.stringify(Payload)
    })
        .then((res) => {
            return res.json()
        })
        .then((data) => {

            console.log(data);

            if (data.Success) {

                Swal.fire({

                    title: data.msg,

                    icon: 'success',

                    confirmButtonText: 'Ok'

                }).then((result) => {

                    if (result.isConfirmed) {

                        fetchAndRenderCart()
                    }

                })

            }
            else {
                location.reload()
            }

        })
        .catch((err) => {
            console.log(err)
        })
}


function RemoveItemFromCart(ProductID) {

    Swal.fire({

        title: 'Are you sure you want to remove this item from cart?',
        showCancelButton: true,
        confirmButtonText: 'Remove'

    }).then((result) => {

        if (result.isConfirmed) {

            RemoveProductFromCart()
        }
    })



    function RemoveProductFromCart() {
        fetch(`${BaseUrl}/cart/delete/${ProductID}`, {
            method: 'delete',
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        })
            .then((res) => {
                return res.json()
            })
            .then((data) => {

                console.log(data);

                if (data.Success) {

                    location.reload()
                }
                else {
                    Swal.fire(data.msg, '', 'error')
                }

            })
            .catch((err) => {
                console.log(err)
            })
    }

}


