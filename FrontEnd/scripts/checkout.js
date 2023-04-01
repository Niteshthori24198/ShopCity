
let Products_Cart = JSON.parse(localStorage.getItem("Pkey")) || [];

let Quantity_item=JSON.parse(localStorage.getItem("Quantity")) || null;



let ProductData=[];

let Cart_Amount=0;



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



OrderCheckoutButton.addEventListener("click",function (e){

    e.preventDefault()

    let C_fname=CustomerFirstName.value;
    let C_lname=CustomerLastName.value;
    let C_country=CountrySelect.value;
    let C_address=CustomerAddress.value;
    let C_city=CustomerCity.value;
    let C_state=CustomerState.value;
    let C_zip=CustomerZipcode.value;
    let C_phone=CustomerPhoneNumber.value;

    //console.log(C_fname,C_lname,C_country,C_address,C_city,C_state,C_zip,C_phone);

    if(C_fname && C_lname && C_country && C_address && C_city && C_state && C_zip && C_phone){

        // address of customer including All details


        let obj={
            Cname:`${C_fname} ${C_lname}`,
            Caddress:`${C_address}, ${C_country} , ${C_state}, ${C_city}`,
            Czip:`${C_zip}`,
            Cphone:`${C_phone}`
        }

        //console.log(obj)
       
        getPaymentoption();

        DiscountPrice();

        PlaceNewOrder(obj);

    }

    else{
        alert("Kindly provide All required details ! ")
    }



})



function getPaymentoption(){

    let paymentContainer=document.querySelector(".PaymentSection");

    paymentContainer.innerHTML=`<p>Payment</p>
    <select name="Payment" id="PaymentOption">
        <option value="">Select</option>
        <option value="Cash on Delivery">Cash on Delivery</option>
        <option value="Online">Internet Banking</option>
    </select>
    <div>
        <p>Use <span id="Special_Code">Masai</span> as coupon code to get extra 20% off </p>
        <input type="text" placeholder="Coupon Code" id="coupon_box">
        <button id="discount_reward">Apply</button>
    </div>
    <button id="Place_Order">Place Order</button>`
}

function PlaceNewOrder(obj){

    let placeorderbtn=document.getElementById("Place_Order");
    let paymentoption=document.getElementById("PaymentOption");

    placeorderbtn.addEventListener("click",function (e){
        e.preventDefault()
        if(paymentoption.value===""){
            alert("kindly select a valid payment option !")
        }
        else if(paymentoption.value==="Cash on Delivery"){
           
            Shooping(obj);
            alert("Order has been Placed Successfully !");
        }
        else{
            setTimeout(function (){
                Shooping(obj);
                alert("Transaction Successfull ! Order has been placed Successfully !");
            },5000)
        }
    })
}


function Shooping(obj){
    
    if(Products_Cart.length!==0){
        
        for(let id of Products_Cart){
            fetch(`https://63c63ce0d307b76967351ede.mockapi.io/product/${id}`)
                .then((res)=>{
                    return res.json()
                })
                .then((data)=>{
                    
                    obj.image=data.image;
                    obj.title=data.title;
                    obj.price=data.price;

                    UpdateBEServer(obj);

                    Customer_History_product=Products_Cart;
                    localStorage.clear()
                    localStorage.setItem("CustomerHistory",JSON.stringify(Customer_History_product));
                    
                })
        
        }
    }


}


function UpdateBEServer(obj){
    fetch(`https://63ca7e2e4f53a00420242ac5.mockapi.io/User`,{
        method:'POST',
        headers:{
            'content-type':'application/json'
        },
        body:JSON.stringify(obj)
    })
        .then((res)=>{
            return res.json()
        })
        .then((data)=>{
            window.location="/cart.html"
        })
}


fetchAndRenderCart()

function fetchAndRenderCart(){

    if(Products_Cart.length!==0){
        
        for(let id of Products_Cart){
            fetch(`https://63c63ce0d307b76967351ede.mockapi.io/product/${id}`)
                .then((res)=>{
                    return res.json()
                })
                .then((data)=>{
                    ProductData.push(data)
                    RenderCartItem(ProductData,data.id,data.price)
                    
                })
        
        }
    }
}



function RenderCartItem(data,id,amt){

    let Cards=data.map((item)=>{
        return getCards(item.image,item.title,item.category,item.price)
    }).join("")


    CustomerCart.innerHTML=`${Cards}<p>Total :- <span> </span></p>`

    let Total_Amount=document.querySelector("#Customer_Cart_items  > p > span");

    for(let i in Quantity_item){
        if(i===id){
            Cart_Amount+=Quantity_item[i]*amt;
            Total_Amount.textContent=Cart_Amount+" Rs";
        }
    }

   
}


function getCards(image,title,cat,price){


    return `<div>

                <div>
                    <img src="${image}" alt="Error">
                </div>

                <div>
                    <p>${title}</p>
                    <p>${cat}</p>
                    <p>${price} Rs</p>
                </div>

            </div>`

}


function DiscountPrice(){
    let count=0;

    let discountCode=document.getElementById("coupon_box");

    let discountapplybtn=document.getElementById("discount_reward");


    discountapplybtn.addEventListener("click",function(e){

        e.preventDefault()
        

        if(discountCode.value==="Masai" && count==0){

            let Total_Amount=document.querySelector("#Customer_Cart_items  > p > span");

            let finalPrice=parseInt(Total_Amount.textContent);

            finalPrice=finalPrice*0.8;

            Total_Amount.textContent=finalPrice+" Rs";

            count++;

        }

    })

}