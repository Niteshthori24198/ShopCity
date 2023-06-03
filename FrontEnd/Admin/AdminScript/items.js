
const admin_baseurl = `http://localhost:3000`


const adminusertoken = localStorage.getItem('usertoken') || null;

if (!adminusertoken) {
    location.href = "../../view/user.login.html"
}


let allProductsDataDB = []

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

            data.Products.reverse()

            allProductsDataDB = data.Products

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

            <button onclick="handleDeleteProduct('${_id}')"> Delete Product </button>
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

    if(!confirm('Do You Want To Edit Product ?')){
        return
    }


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
        method: "PATCH",
        headers: {
            'Content-type': 'application/json',
            'authorization': `Bearer ${adminusertoken}`
        },
        body: JSON.stringify(data)
    }).then(r => r.json())

    console.log(res);
    alert(res.msg);
    document.getElementById('edit_close_btn').click()
    fetchAndRenderUsers()

}


async function handleAddProduct(event) {
    event.preventDefault()
    console.log('submitted');

    if(!confirm('Do You Want To Add Product ?')){
        return
    }


    const data = {}

    let addProductForm = document.getElementById('addProductForm');


    data.Title = addProductForm.productTitle.value;
    data.Category = addProductForm.productCategory.value;
    data.Quantity = addProductForm.productQuantity.value;
    data.Image = addProductForm.productImage.value;
    data.Price = addProductForm.productPrice.value;
    data.Rating = addProductForm.productRating.value;
    data.Description = addProductForm.productDesc.value;

    console.log(data);


    let res = await fetch(`${admin_baseurl}/product/add`, {
        method: "POST",
        headers: {
            'Content-type': 'application/json',
            'authorization': `Bearer ${adminusertoken}`
        },
        body: JSON.stringify(data)
    }).then(r => r.json())

    console.log(res);

    alert(res.msg);
    document.getElementById('addd_close_btn').click()
    fetchAndRenderUsers()

    addProductForm.productTitle.value  =  ''  ;
    addProductForm.productCategory.value  =  ''  ;
    addProductForm.productQuantity.value  =  ''  ;
    addProductForm.productImage.value  =  ''  ;
    addProductForm.productPrice.value  =  ''  ;
    addProductForm.productRating.value  =  ''  ;
    addProductForm.productDesc.value  =  ''  ;

}



async function handleDeleteProduct(productID) {
    console.log(productID);

    if(!confirm('Do You Want To Delete Product ?')){
        return
    }

    let res = await fetch(`${admin_baseurl}/product/delete/${productID}`, {
        method: "DELETE",
        headers: {
            'Content-type': 'application/json',
            'authorization': `Bearer ${adminusertoken}`
        }
    }).then(r => r.json())

    console.log(res);
    alert(res.msg);
    fetchAndRenderUsers()

}



function handleFilterByCategory(event) {
    console.log(event.target.value);
    const filterby = event.target.value;

    if (filterby) {
        const FilterdData = allProductsDataDB.filter((product) => (product.Category == filterby))
        RenderProducts(FilterdData)
    } else {
        RenderProducts(allProductsDataDB)
    }

}