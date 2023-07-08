
const admin_baseurl = `http://localhost:3000`


const adminusertoken = localStorage.getItem('usertoken') || null;

if (!adminusertoken) {


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


let allProductsDataDB = []


const paginationwrapper = document.getElementById('pagination_wrapper_btn')

fetchAndRenderPro()



function fetchAndRenderPro(page = 1) {

    fetch(`${admin_baseurl}/product/getall?limit=7&page=${page}`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${adminusertoken}`
        }
    })
        .then((res) => {

            let totalProductCount = res.headers.get('X-Total-Count')

            AppendPaginationButtons(Math.ceil(totalProductCount / 7));

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
            <p> Product-ID :- ${_id} </p>

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



function AppendPaginationButtons(n) {


    let btn = "";

    for (let i = 1; i <= n; i++) {
        btn = btn + getbutton(i, i)
    }

    paginationwrapper.innerHTML = '';
    paginationwrapper.innerHTML = btn;

}


function getbutton(pno, text) {
    return `<div><button class="pagination-button" data-page-number="${pno}" onclick={cahngeBtn('${pno}')}>${text}</button></div>`
}


function cahngeBtn(pn) {
    console.log(pn);
    location.href = "#"
    fetchAndRenderPro(pn)
}



function editBtnClicked(productID) {

    if (!adminusertoken) {
        Swal.fire({

            title: 'Kindly Login First to Access this section.',

            icon: 'error',

            confirmButtonText: 'Ok'

        }).then((result) => {

            if (result.isConfirmed) {

                location.href = "../view/user.login.html"
            }

        })
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
    editProductForm.productRatingEdit.value = data.Rating + '⭐';
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


    Swal.fire({

        title: 'Are you sure you want to update the product?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'

    }).then((result) => {

        if (result.isConfirmed) {

            updateProductInfo()
        }

        else {
            document.getElementById('edit_close_btn').click()
        }
    })


    async function updateProductInfo() {

        let res = await fetch(`${admin_baseurl}/product/update/${productID}`, {
            method: "PATCH",
            headers: {
                'Content-type': 'application/json',
                'authorization': `Bearer ${adminusertoken}`
            },
            body: JSON.stringify(data)
        }).then(r => r.json())

        console.log(res);

        Swal.fire({

            title: res.msg,

            icon: 'success',

            confirmButtonText: 'Ok'

        }).then((result) => {

            if (result.isConfirmed) {

                document.getElementById('edit_close_btn').click()
                fetchAndRenderPro()
            }

            else {
                document.getElementById('edit_close_btn').click()
                fetchAndRenderPro()
            }

        })


    }

}


async function handleAddProduct(event) {
    event.preventDefault()

    Swal.fire({

        title: 'Are you sure you want to Add the product?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'

    }).then((result) => {

        if (result.isConfirmed) {

            addNewProductToDB()
        }

        else {
            document.getElementById('addd_close_btn').click()
            EmptyForm()
        }
    })



    async function addNewProductToDB() {

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

        let res = await fetch(`${admin_baseurl}/product/add`, {
            method: "POST",
            headers: {
                'authorization': `Bearer ${adminusertoken}`
            },
            body: formData
        }).then(r => r.json())


        Swal.fire({

            title: res.msg,

            icon: 'success',

            confirmButtonText: 'Ok'

        }).then((result) => {

            if (result.isConfirmed) {

                document.getElementById('addd_close_btn').click()
                fetchAndRenderPro()
            }

            EmptyForm()

        })


    }



    function EmptyForm() {
        addProductForm.productImage.value = '';
        addProductForm.productTitle.value = '';
        addProductForm.productCategory.value = '';
        addProductForm.productQuantity.value = '';
        addProductForm.productPrice.value = '';
        addProductForm.productDesc.value = '';
    }


}



async function handleEditProductImage(event) {
    event.preventDefault()


    Swal.fire({

        title: 'Are you sure you want to Change the Product Image?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'

    }).then((result) => {

        if (result.isConfirmed) {

            updateProductImageInfo()
        }

        else {
            document.getElementById('edit_close_btn').click()
            document.getElementById('addd_close_btn').click()
        }
    })



    async function updateProductImageInfo() {

        let editProductImageForm = document.getElementById('editProductImageForm');
        let productID = document.getElementById('productIdEdit').value;
        let ImageFile = document.getElementById('productImageEdit').files[0]


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


        Swal.fire({

            title: res.msg,

            icon: 'success',

            confirmButtonText: 'Ok'

        }).then((result) => {

            if (result.isConfirmed) {

                document.getElementById('addd_close_btn').click()
                document.getElementById('edit_close_btn').click()
                fetchAndRenderPro()
            }

            else {
                document.getElementById('edit_close_btn').click()
                document.getElementById('addd_close_btn').click()
                fetchAndRenderPro()

            }

        })


    }


}





async function handleDeleteProduct(productID) {
    console.log(productID);

    Swal.fire({

        title: 'Are you sure you want to delete the product?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'

    }).then((result) => {

        if (result.isConfirmed) {

            productRemoveFromDB()
        }
    })



    async function productRemoveFromDB() {
        document.getElementById(productID).innerHTML = '<i class="fa fa-refresh fa-spin"></i> Delete Product'

        let res = await fetch(`${admin_baseurl}/product/delete/${productID}`, {
            method: "DELETE",
            headers: {
                'Content-type': 'application/json',
                'authorization': `Bearer ${adminusertoken}`
            }
        }).then(r => r.json())

        Swal.fire({

            title: res.msg,

            icon: 'success',

            confirmButtonText: 'Ok'

        }).then((result) => {

            if (result.isConfirmed) {

                document.getElementById(productID).innerHTML = 'Delete Product'
                fetchAndRenderPro()
            }


        })


    }

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