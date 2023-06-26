
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

    let product = `
                    <div>
                        <img src="${data.Image}" alt="Error"  class="zoom" data-magnify-src="${data.Image}"/>
                    </div>

                    <div>

                        <div class="nitesh_product_detail">
                            <h2>Title : ${data.Title}</h2>
                            <p>Category : ${data.Category}</p>
                            <p>Details : ${data.Description}</p>
                            ${data.Rating ? getRatingStarDetail(data.Rating) : '<p  id="newProductBtn"><span>New Product</span></p>'}
                            <p>Price : <i class="fa-solid fa-indian-rupee-sign"></i> ${data.Price} </p>
                            
                            ${data.Quantity <= 0 ? '<p> Out Of Stock <p>' : `Quantity : ${getQuantitySelectTag(data.Quantity)}`}        
                        

                        </div>

                        <div>
                            <button id="addToCartBtnhai" class="niteshcartbutton" ${data.Quantity <= 0 && 'disabled'}>Add To Cart</button>
                        </div>

                    </div>
    
                `

    productdetailcont.innerHTML = product;

    

    $(document).ready(function () {
        $(".zoom").magnify(50);
    });

}


function getRatingStarDetail(num) {
    return ` <p>Rating : <i data-star="${num}" style="font-size: 25px;"></i> ${num} / 5 </p>`
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
            console.log(err);
        })

}






const productreviewcont = document.getElementById('productreviewcont')

showReviewToPage()
function showReviewToPage() {
    fetch(`${Baseurl}/review/get-by-productId/${productID}`)
        .then((res) => {
            return res.json()
        }).then((data) => {
            console.log(data)
            if (data.Success) {
                renderReviews(data.Review)
            }else{
                productreviewcont.innerHTML = `<h3 style="text-align: center; margin: 30px;">No Review Yet 🔕</h3>`
            }
        }).catch((err) => {
            console.log(err)
            productreviewcont.innerHTML = `<h3 style="text-align: center; margin: 30px;">No Review Yet 🔕</h3>`
        })
}

function renderReviews(data) {
    console.log('===>', data)
    if (!data.length) {
        console.log('kuch nhi');
        productreviewcont.innerHTML = `<h3 style="text-align: center; margin: 30px;">No Review Yet 🔕</h3>`
        return
    }
    productreviewcont.innerHTML = data.map((review) => {
        return `<div>
                    <div>
                        <img src="${review.CustomerImage}" alt="${review.CustomerName}" style="width:51px"/>
                        <span style="font-weight:bold">${review.CustomerName}</span> 
                    </div>
                    <div>
                        <p>${review.Description}</p>
                    </div>
                    <div>
                        <input class="rating" max="5" step="0.01"
                            style="--fill: #C8102E;--symbol:var(--heart);--value:${review.NewRating}" type="range"
                            value="${review.NewRating}" id="ratingValue" onchange="handleInputRating(event)">
                            <span class="ratingValue">${review.NewRating} / 5</span>
                    </div>
                </div>`
    }).join('')
}