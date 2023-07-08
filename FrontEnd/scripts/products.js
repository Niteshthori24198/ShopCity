
const BaseURL = `http://localhost:3000`

let productcont = document.getElementById("Niteshproductscontainer");

let paginationbtn = document.getElementById("pagination-wrapper")

FetchAndDisplayProducts();

// AppendPaginationButton();


function FetchAndDisplayProducts(page = 1, urlPass=false) {

    let url;
    if(urlPass){
        url = urlPass
    }else{
        url = `${BaseURL}/product/getall?limit=12&page=${page}`
    }


    productcont.innerHTML=`<div id="loading_gif"><img  src="../Images/Loading.gif" alt="Loading ...."/></div>`

    fetch(url)
        .then((res) => {

            // Dyanmic Pagination
            let totalProductCount = res.headers.get('X-Total-Count')
            // console.log('totalProduct==>', totalProductCount);
            AppendPaginationButton(Math.ceil(totalProductCount/12));

            return res.json()
        })
        .then((data) => {
            console.log(data)

            RenderProducts(data.Products)

        })
        .catch((err) => {

            console.log(err);
        })

}



function RenderProducts(data) {

    productcont.innerHTML = ''

    const products = data.map((product) => {

        return getProductCard(product)

    }).join('')

    productcont.innerHTML = products;




}


function getProductCard(product) {

    return `<div class="myproductcontainer" onclick="goTODetailPage('${product._id}')">
                <div class="myproductimage">
                    <img src="${product.Image}" alt="Error">
                </div>
                <div class="myproductdetails">
                    
                    <h3 > ${product.Title} </h3>

                    <p > 
                        <i class="fa-solid fa-indian-rupee-sign" class="price" style="font-size: 20px;"></i>
                        <span class="price"> ${product.Price} </span>
                         <span class="onwards"> onwards </span> 
                    </p>
                    <p> ${product.Description.substring(0, 25)}...</p>

                    ${product.Rating ? getRatingStar(product.Rating, product.Total_Review_Count)  : '<p  id="newProductBtn"><span>New Product</span></p>' }
                    
                    
                </div>
                
            </div>`

}

function getRatingStar(num, Total_Review_Count){
    return `<p class="totalstars"> <i data-star="${num}" style="font-size: 25px;"></i> ${num} / 5 <span class="reviewerCount">${Total_Review_Count} Reviews</span></p>`
}


function goTODetailPage(pid) {

    localStorage.setItem("productID", pid);

    location.href = "../view/details.html"
}


function AppendPaginationButton(n) {


    let btn = "";
    
    for (let i = 1; i <= n; i++) {
        btn = btn + getbutton(i, i)
    }

    paginationbtn.innerHTML = '';
    paginationbtn.innerHTML = btn;

}


function getbutton(pno, text) {
    return `<div><button class="pagination-button" data-page-number="${pno}" onclick={cahngeBtn('${pno}')}>${text}</button></div>`
}


function cahngeBtn(pn){
    console.log(pn);
    location.href="#"
    FetchAndDisplayProducts(pn);
}



let SearchProduct = document.getElementById('Niteshproductsearch');

let FilterbyCategory = document.getElementById('Niteshcategoryselect');

let filterbyprice = document.getElementById("NiteshsortbyPrice");

let pricerange = '';



FilterbyCategory.addEventListener('change', productfilterFunc);

SearchProduct.addEventListener('input', productfilterFunc);

filterbyprice.addEventListener("change", productfilterFunc);





function productfilterFunc() {

    if (filterbyprice.value === "High to Low") {
        pricerange = 'desc'
    }

    else if (filterbyprice.value === "Low to High") {
        pricerange = 'asc'
    }

    if (FilterbyCategory.value === "Men") {
        Category = "Men";
    }
    else if (FilterbyCategory.value === "Women") {
        Category = "Women";
    }
    else if (FilterbyCategory.value === "Kids") {
        Category = "Kids";
    }
    else {
        Category = '';
    }


    // console.log(FilterbyCategory.value, SearchProduct.value, pricerange)


    if (Category !== '') {

        let url = `${BaseURL}/product/getbycategory/${Category}?search=${SearchProduct.value}&price=${pricerange}&page=1&limit=12`

        // FilterAndSearchProduct(url)
        FetchAndDisplayProducts(1,url)
    }
    else {
        
        let url = `${BaseURL}/product/getall?search=${SearchProduct.value}&price=${pricerange}&page=1&limit=12`
        
        // FilterAndSearchProduct(url)
        FetchAndDisplayProducts(1,url)
    }



}


async function FilterAndSearchProduct(url) {

    console.log(url)

    let res = await fetch(url);
    console.log(res)

    if (res.ok) {

        res = await res.json();

        console.log(res)

        RenderProducts(res.Products);

    }
    else {

        console.log(res)
        alert(res.msg)
    }
}




// nav search bar

function mainHandleNavSearchBar(searchValue){
    console.log(searchValue);
    let url = `${BaseURL}/product/getall?search=${searchValue}&page=1&limit=12`

    // FilterAndSearchProduct(url)
    FetchAndDisplayProducts(1,url)
    
}
