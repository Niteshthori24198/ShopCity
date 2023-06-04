
const Baseurl = `http://localhost:3000`

let productID = localStorage.getItem("productID");

let token = localStorage.getItem("usertoken") || null;

let productdetailcont = document.getElementById("productdetailcont");

fetchAndRenderItem();

function fetchAndRenderItem() {

    fetch(`${Baseurl}/product/getone/${productID}`)
        .then((res) => {
            return res.json()
        })
        .then((data) => {

            console.log(data);

            if (data.Success) {
                // console.log("hlo")

                ShowProduct(data.Products);

                EventHandler()

            }
            else {

                alert("Something went wrong")
            }
        })
        .catch((err) => {

            console.log(err)
        })
}


function ShowProduct(data) {
    console.log('data==>', data)

    // console.log(data.Image,data.Title,data.Price)
    console.log(`<img src="${data.Image}" alt="Error"  class="zoom" data-magnify-src="${data.Image}" />`)

    let product = `<div>
        <img src="${data.Image}" alt="Error"  class="zoom" data-magnify-src="${data.Image}" />
    </div>

    <div>

        <div class="nitesh_product_detail">
            <h2>Title : ${data.Title}</h2>
            <p>Category : ${data.Category}</p>
            <p>Details : ${data.Description}</p>
            <p>Rating : ${data.Rating} ⭐ / 5</p>
            <p>Price : <i class="fa-solid fa-indian-rupee-sign"></i> ${data.Price} </p>
            
            ${data.Quantity <= 0 ? '<p> Out Of Stock <p>' : `Quantity : ${getQuantitySelectTag(data.Quantity)}`}        
           

        </div>

        <div>
            <button id="addToCartBtnhai" class="niteshcartbutton" ${data.Quantity <= 0 && 'disabled'}>Add To Cart</button>
        </div>

    </div>
    
    <div>

    </div>`

    productdetailcont.innerHTML = product;

    $(document).ready(function () {
        $(".zoom").magnify();
    });

}

function getQuantitySelectTag(n) {
    let options = ''
    for (let i = 0; i < n && i < 10; i++) {
        options += `<option value="${i + 1}">${i + 1} ${i == 0 ? 'Item' : "Item's"}</option>`
    }
    return `
        <select id="niteshproductquantity">
            ${options}
        </select>
    `;
}


function EventHandler() {

    let addtocartbtn = document.querySelector(".niteshcartbutton");

    addtocartbtn.addEventListener("click", function (e) {

        if (token) {

            AddItemToCart(token)

        }
        else {
            alert("Kindly Login yourself First for Adding items into cart.");
            location.href = "../view/user.login.html"
        }



    })


}


function AddItemToCart(token) {

    console.log('-------');

    document.getElementById('addToCartBtnhai').innerHTML = '<i class="fa fa-refresh fa-spin"></i> Add To Cart'

    let quantitysel = document.getElementById("niteshproductquantity");

    let payload = {

        ProductID: productID,
        Quantity: +quantitysel.value
    }


    fetch(`${Baseurl}/cart/addToCart`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    })
        .then((res) => {
            return res.json()
        })
        .then((data) => {

            console.log(data);
            document.getElementById('addToCartBtnhai').innerHTML = 'Add To Cart'

            if (data.Success) {
                alert(data.msg)
                location.reload()
            }

            else {

                alert(data.msg)
            }
            
        })
        .catch((err) => {
            document.getElementById('addToCartBtnhai').innerHTML = 'Add To Cart'
            alert(data.msg)
        })

}