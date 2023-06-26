
const admin_baseurl = `http://localhost:3000`


const adminusertoken = localStorage.getItem('usertoken') || null;

if (!adminusertoken) {
    location.href = "../view/user.login.html"
}


let allProductsDataDB = []

fetchAndRenderPro()



function fetchAndRenderPro() {

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
            console.log("products data fetched ", data.Products)

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
            <p> Rating :- ${Rating} ⭐ / 5 </p>
            <p> Details :- ${Description} </p>
            <p> Product ID :- ${_id} </p>

        </div>

        <div>
            

            <button id="editProductBtn_item" type="button" class="btn btn-primary" data-bs-toggle="modal"
                data-bs-target="#editProduct" data-bs-whatever="@mdo" onclick="editBtnClicked('${_id}')">
                <span>Edit Product</span>
            </button>

            <button onclick="handleDeleteProduct('${_id}')" id="${_id}"> Delete Product </button>
        </div>
       
    </div>
    
    `

}





function editBtnClicked(productID) {
    if (!adminusertoken) {
        alert('Kindly Login First')
        location.href = "../view/user.login.html"
        return
    } else {
        console.log(productID);
        autoFillProductDetails(productID)
    }

}

async function autoFillProductDetails(productID) {
    let res = await fetch(`${admin_baseurl}/product/getone/${productID}`);
    let data = await res.json()
    console.log('data==>', data);
    data = data.Products;

    console.log('data==>', data);

    let editProductForm = document.getElementById('editProductForm');

    editProductForm.productIdEdit.value = data._id;

    editProductForm.productTitleEdit.value = data.Title;
    editProductForm.productCategoryEdit.value = data.Category;
    editProductForm.productQuantityEdit.value = data.Quantity;
    editProductForm.productPriceEdit.value = data.Price;
    editProductForm.productRatingEdit.value = data.Rating+'⭐';
    editProductForm.productDescEdit.value = data.Description;

    // editProductForm.productImageEdit.files[0] = data.Image;
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
    data.Price = editProductForm.productPriceEdit.value;
    // data.Rating = editProductForm.productRatingEdit.value;
    data.Description = editProductForm.productDescEdit.value;
    // data.Image = editProductForm.productImageEdit.value;

    console.log(productID);

    if (!confirm('Are you sure you want to update the product?')) return

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
    fetchAndRenderPro()

}


async function handleAddProduct(event) {
    event.preventDefault()
    if (!confirm('Are you sure you want to Add the product?')) return

    let addProductForm = document.getElementById('addProductForm');

    const ImageFile = addProductForm.productImage.files[0]

    const Title = addProductForm.productTitle.value
    const Category = addProductForm.productCategory.value
    const Quantity = addProductForm.productQuantity.value
    const Price = addProductForm.productPrice.value
    const Description = addProductForm.productDesc.value
    // const Rating = addProductForm.productRating.value


    const formData = new FormData(addProductForm);

    formData.append("Image", ImageFile);

    formData.append("Title", Title);
    formData.append("Category", Category);
    formData.append("Quantity", Quantity);
    formData.append("Price", Price);
    formData.append("Description", Description);
    // formData.append("Rating", Rating);


    console.log(formData);

    // const data = {}
    // data.Image = addProductForm.productImage.value;
    // data.Title = addProductForm.productTitle.value;
    // data.Category = addProductForm.productCategory.value;
    // data.Quantity = addProductForm.productQuantity.value;
    // data.Price = addProductForm.productPrice.value;
    // data.Rating = addProductForm.productRating.value;
    // data.Description = addProductForm.productDesc.value;
    // console.log(data);

    // headers: {
    //     'Content-type': 'application/json',
    //     'authorization': `Bearer ${adminusertoken}`
    // },

    let res = await fetch(`${admin_baseurl}/product/add`, {
        method: "POST",
        headers: {
            'authorization': `Bearer ${adminusertoken}`
        },
        body: formData
    }).then(r => r.json())

    console.log(res);

    alert(res.msg);

    document.getElementById('addd_close_btn').click()
    fetchAndRenderPro()

    // addProductForm.productImage.value = '';
    addProductForm.productTitle.value = '';
    addProductForm.productCategory.value = '';
    addProductForm.productQuantity.value = '';
    addProductForm.productPrice.value = '';
    // addProductForm.productRating.value = '';
    addProductForm.productDesc.value = '';

}



async function handleEditProductImage(event) {
    event.preventDefault()
    if (!confirm('Are you sure you want to Change the Product Image?')) return

    let editProductImageForm = document.getElementById('editProductImageForm');
    let productID = document.getElementById('productIdEdit').value;
    let ImageFile = document.getElementById('productImageEdit').files[0]

    // const ImageFile = editProductImageForm.productImage.files[0]
    


    const formData = new FormData(editProductImageForm);
    formData.append("Image", ImageFile);


    console.log(formData);


    let res = await fetch(`${admin_baseurl}/product/updateImage/${productID}`, {
        method: "PATCH",
        headers: {
            'authorization': `Bearer ${adminusertoken}`
        },
        body: formData
    }).then(r => r.json())

    console.log(res);

    alert(res.msg);

    document.getElementById('addd_close_btn').click()
    fetchAndRenderPro()

    // addProductForm.productImage.value = '';

}





async function handleDeleteProduct(productID) {
    console.log(productID);

    if (!confirm('Are you sure you want to delete the product?')) return

    document.getElementById(productID).innerHTML = '<i class="fa fa-refresh fa-spin"></i> Delete Product'

    let res = await fetch(`${admin_baseurl}/product/delete/${productID}`, {
        method: "DELETE",
        headers: {
            'Content-type': 'application/json',
            'authorization': `Bearer ${adminusertoken}`
        }
    }).then(r => r.json())

    document.getElementById(productID).innerHTML = 'Delete Product'
    console.log(res);
    alert(res.msg);
    fetchAndRenderPro()

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



function handleNavSearchProducts(value) {
    // console.log(value);

    if (value === '' || !value) {
        RenderProducts(allProductsDataDB)
        return
    }

    value = value.toLowerCase()


    const filterData = allProductsDataDB.filter((prod) => {
        return (prod.Title.toLowerCase().includes(value) || prod.Description.toLowerCase().includes(value) || prod.Category.toLowerCase() == value)
    })

    RenderProducts(filterData)



}