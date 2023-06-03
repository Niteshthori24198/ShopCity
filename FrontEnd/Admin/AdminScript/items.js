
const admin_baseurl = `http://localhost:3000`


const adminusertoken = localStorage.getItem('usertoken') || null;

if (!adminusertoken) {
    location.href = "../../view/user.login.html"
}


fetchAndRenderUsers()



function fetchAndRenderUsers() {

    fetch(`${admin_baseurl}/product/getall`, {
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
            console.log("user data fetched ", data.Products)
            RenderProducts(data.Products)

        })
        .catch((err) => {
            console.log(err)
        })


}




function RenderProducts(products) {

    document.getElementById("adminitemscontainer").innerHTML = ''

    const itemcard = products.map((item) => {
        return GetItemCard({ ...item })
    }).join('')

    document.getElementById("adminitemscontainer").innerHTML = itemcard;


}


function GetItemCard({ _id, Category, Description, Image, Price, Quantity, Rating, Title }) {

    return `
   
    <div>

        <div>

            <img src="${Image}" alt="product" />

        </div>

        <div>

            <p> Product :- ${Title} [${Category}] </p>
            <p> Price :- ${Price} </p>
            <p> Quantity :- ${Quantity} </p>
            <p> Rating :- ${Rating} </p>
            <p> Details :- ${Description} </p>

        </div>

        <div>
            

            <button id="editProductBtn_item" type="button" class="btn btn-primary" data-bs-toggle="modal"
                data-bs-target="#editProduct" data-bs-whatever="@mdo" onclick="editBtnClicked('${_id}')">
                <span>Edit Product</span>
            </button>

            <button> Delete Product </button>
        </div>
       
    </div>
    
    `

}





function editBtnClicked(productID) {
    if (!adminusertoken) {
        alert('Kindly Login First')
        location.href = "../../view/user.login.html"
        return
    } else {
        console.log(productID);
        autoFillProductDetails(productID)
    }

}

async function autoFillProductDetails(productID) {
    let res = await fetch(`${admin_baseurl}/product/getone/${productID}`);
    let data = await res.json()
    data = data.Products;

    let editProductForm = document.getElementById('editProductForm');

    editProductForm.productIdEdit.value = data._id;

    editProductForm.productTitleEdit.value = data.Title;
    editProductForm.productCategoryEdit.value = data.Category;
    editProductForm.productQuantityEdit.value = data.Quantity;
    editProductForm.productImageEdit.value = data.Image;
    editProductForm.productPriceEdit.value = data.Price;
    editProductForm.productRatingEdit.value = data.Rating;
    editProductForm.productDescEdit.value = data.Description;
}


async function handleEditProduct(event) {
    event.preventDefault()
    console.log('submitted');
    const data = {}

    let editProductForm = document.getElementById('editProductForm');

    const productID = editProductForm.productIdEdit.value;

    data.Title = editProductForm.productTitleEdit.value;
    data.Category = editProductForm.productCategoryEdit.value;
    data.Quantity = editProductForm.productQuantityEdit.value;
    data.Image = editProductForm.productImageEdit.value;
    data.Price = editProductForm.productPriceEdit.value;
    data.Rating = editProductForm.productRatingEdit.value;
    data.Description = editProductForm.productDescEdit.value;

    console.log(productID);

    let res = await fetch(`${admin_baseurl}/product/update/${productID}`, {
        method : "PATCH",
        headers : {
            'Content-type': 'application/json',
            'authorization': `Bearer ${adminusertoken}`
        },
        body : JSON.stringify(data)
    }).then(r => r.json())

    console.log(res);
    alert(res.msg);
    document.getElementById('edit_close_btn').click()
    fetchAndRenderUsers()

}