
let cartitems = []


const BaseUrl = `http://localhost:3000`


// take it from local storrage.

const token = localStorage.getItem("usertoken") || null;


if(!token){
    alert("Kindly Login First to Access cart section.")
    location.href = "../view/user.login.html"
}

let Cart_Amount = 0;

fetchAndRenderCart();



let MainCartSection = document.getElementById("Nitesh_Cart_items");

let Total_Amount = document.querySelector("#Nitesh_Order_Summary > div > h3 > span");

let SubTotal = document.querySelector("#Nitesh_Order_Summary > div > p:nth-child(2) > span");


let checkoutbtn = document.querySelector("#Nitesh_Order_Summary button");

checkoutbtn.addEventListener("click", function (e) {


    if (token && cartitems.length){
        window.location = "../view/checkout.html";
    }
    else{
        alert("Your Cart is Empty so Add some items into cart to proceed for checkout.")
    }
})



function fetchAndRenderCart() {

    fetch(`${BaseUrl}/cart/get`,{
        method:'GET',
        headers:{
            'content-type':'application/json',
            'authorization':`Bearer ${token}`
        }
    })
    .then((res) => {
        return res.json()
    })
    .then((data) => {

        //console.log(data);

        if(data.Success){

            console.log(data.CartItem);

            cartitems = [...data.CartItem.Products];

            console.log("cart---->", cartitems)

            if(cartitems.length){

                RenderCartItem(data.CartItem.Products)
            }

            else{
                Emptycart();
            }
        }

        else{
            Emptycart();
        }
           
        
    })

}
    


function Emptycart() {

    let MainCartSection = document.getElementById("Nitesh_Cart_items");

    MainCartSection.innerHTML = `<p>Your Shopping Cart is Empty !</p>`
}


function RenderCartItem(data) {

    console.log("data--->",data)

    let Cards = data.map((item) => {
        return getCards(item.product.Image, item.product.Title, item.product.Category, item.product.Description, item.product.Price, item.Quantity,item.product._id)
    }).join("")


    MainCartSection.innerHTML = `${Cards}`;

    CalculateCartPrice();


    let Qunatity_Select = document.querySelectorAll("#Nitesh_Cart_items > div > select");


    for (let i of Qunatity_Select) {

        i.addEventListener("change", function (e) {

            e.preventDefault();

            console.log(e.target.value, e.target.id);

            const Payload = {
                Quantity:+e.target.value
            }

            const ProductID = e.target.id;

            UpdateCartStatus(ProductID,Payload);

        })
    }


    let Remove_button = document.querySelectorAll("button");

    for (let i of Remove_button) {

        i.addEventListener("click", function (e) {
            e.preventDefault();

            const ProductID = e.target.id;

            RemoveItemFromCart(ProductID);
            
        })
    }

}


function getCards(Image, Title, Category, Description, Price , Quantity, id) {


    return `<div>
            <img src="${Image}" alt="Error">
            <h5>${Title}</h5>
            <p>${Category}</p>
            <p>${Description.substring(0, 50)} Rs</p>
            <p>Price : ${Price} Rs</p>
            <select name="quantity" id="${id}">
            <option value="1" ${Quantity=='1' ? "Selected" : ""}>Quantity :- 1</option>
            <option value="2" ${Quantity=='2' ? "Selected" : ""}>Quantity :- 2</option>
            <option value="3" ${Quantity=='3' ? "Selected" : ""}>Quantity :- 3</option>
            <option value="4" ${Quantity=='4' ? "Selected" : ""}>Quantity :- 4</option>
            <option value="5" ${Quantity=='5' ? "Selected" : ""}>Quantity :- 5</option>
            <option value="6" ${Quantity=='6' ? "Selected" : ""}>Quantity :- 6</option>
            <option value="7" ${Quantity=='7' ? "Selected" : ""}>Quantity :- 7</option>
            <option value="8" ${Quantity=='8' ? "Selected" : ""}>Quantity :- 8</option>
            <option value="9" ${Quantity=='9' ? "Selected" : ""}>Quantity :- 9</option>
            <option value="10" ${Quantity=='10' ? "Selected" : ""}>Quantity :- 10</option>
            </select>
            <button id="${id}">Remove</button>
        </div>`

}



function CalculateCartPrice() {

    Cart_Amount = 0;

    if (cartitems.length !== 0) {

        for (let item of cartitems) {
            Cart_Amount += (item.Quantity)*(item.product.Price);
            Total_Amount.textContent = Cart_Amount + " Rs";
            SubTotal.textContent = Cart_Amount + " Rs";
        }
                  
        
    }
}



function UpdateCartStatus(ProductID,Payload){

    fetch(`${BaseUrl}/cart/update/${ProductID}`,{
        method:'PATCH',
        headers:{
            'content-type':'application/json',
            'authorization':`Bearer ${token}`
        },
        body:JSON.stringify(Payload)
    })
    .then((res)=>{
        return res.json()
    })
    .then((data)=>{

        console.log(data);

        if(data.Success){
            alert(data.msg);

            location.reload()
        }
        else{
            alert(data.msg)
        }

    })
    .catch((err)=>{
        alert(data.msg)
    })
}


function  RemoveItemFromCart(ProductID){

    fetch(`${BaseUrl}/cart/delete/${ProductID}`,{
        method:'delete',
        headers:{
            'content-type':'application/json',
            'authorization':`Bearer ${token}`
        }
    })
    .then((res)=>{
        return res.json()
    })
    .then((data)=>{

        console.log(data);

        if(data.Success){
            alert(data.msg);

            location.reload()
        }
        else{
            alert(data.msg)
        }

    })
    .catch((err)=>{
        alert(data.msg)
    })
}


