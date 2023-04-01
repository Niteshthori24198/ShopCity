
const Baseurl = `http://localhost:3000`

let productID = localStorage.getItem("productID");

let token = localStorage.getItem("usertoken");

let productdetailcont = document.getElementById("productdetailcont");

fetchAndRenderItem();

function fetchAndRenderItem(){

    fetch(`${Baseurl}/product/getone/${productID}`)
    .then((res)=>{
        return res.json()
    })
    .then((data)=>{

        console.log(data);

        if(data.Success){
            console.log("hlo")

            ShowProduct(data.Products);
            
            EvebtHandler()

        }
        else{

            alert("Something went wrong")
        }
    })
    .catch((err)=>{

        console.log(err)
    })
}


function  ShowProduct(data){

    console.log(data.Image,data.Title,data.Price)

    let product = `<div>
        <img src="${data.Image}" alt="Error">
    </div>

    <div>

        <div class="nitesh_product_detail">
            <h2>Title : ${data.Title}</h2>
            <p>Category : ${data.Category}</p>
            <p>Description : ${data.Description}</p>
            <p>Price : ${data.Price} Rs</p>
            <span>Quantity : </span>
            <select id="niteshproductquantity">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
            </select>

        </div>

        <div>
            <button id="${data._id}" class="niteshcartbutton">Add to Cart</button>
        </div>

    </div>
    
    <div>

    </div>`

    console.log(product)
    productdetailcont.innerHTML = product;

}


function EvebtHandler(){

    let addtocartbtn = document.querySelector(".niteshcartbutton");

    addtocartbtn.addEventListener("click" , function (e){

        if(token){

            AddItemToCart(token)

        }
        else{
            alert("Kindly Login yourself First for Adding items into cart.")
        }



    })


}


function AddItemToCart(token){

    let quantitysel = document.getElementById("niteshproductquantity");

    let payload = {

        ProductID:productID,
        Quantity:+quantitysel.value
    }


    fetch(`${Baseurl}/cart/addToCart`,{
        method:'POST',
        headers:{
            'Content-type':'application/json',
            'Authorization':`Bearer ${token}`
        },
        body:payload
    })
    .then((res)=>{
        return res.json()
    })
    .then((data)=>{
        
        console.log(data);

        if(data.Success){
            alert(data.msg)
        }

        else{

            alert(data.msg)
        }

    })
    .catch((err)=>{
        alert(data.msg)
    })

}