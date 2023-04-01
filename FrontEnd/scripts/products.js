
const BaseURL = `http://localhost:3000`

let productcont = document.getElementById("Niteshproductscontainer");

let paginationbtn = document.getElementById("pagination-wrapper")

FetchAndDisplayProducts();

AppendPaginationButton();


function FetchAndDisplayProducts(page=1){


    const url = `${BaseURL}/product/getall?limit=15&page=${page}`

    fetch(url)
    .then((res)=>{
        return res.json()
    })
    .then((data)=>{
        console.log(data)

        RenderProducts(data.Products)

    })
    .catch((err)=>{

        alert(data.msg)
    })

}



function RenderProducts(data){

    productcont.innerHTML = ''

    const products = data.map((product)=>{

        return getProductCard(product)

    }).join('')

    productcont.innerHTML = products;

    let Seedetailbutton = document.querySelectorAll(".mySeedetailbutton");

    for(let i of Seedetailbutton){
        i.addEventListener("click", function(e){

            let pid = e.target.dataset.id;
    
            localStorage.setItem("productID", pid);
    
            location.href = "../view/details.html"
    
        })
    }

  

}


function getProductCard(product){

    return  `<div class="myproductcontainer">
                <div class="myproductimage">
                    <img src="${product.Image}" alt="Error">
                </div>
                <div class="myproductdetails">
                    <h5>Title : ${product.Title}</h5>
                    <p>Category : ${product.Category}</p>
                    <p>Description : ${product.Description.substring(0,5)}</p>
                    <p>Price : ${product.Price} Rs</p>
                    <p>Rating : ${product.Rating}</p>
                </div>
                <div class="mydivbutton">
                    <button id="${product._id}" data-id=${product._id} class = "mySeedetailbutton">See Details</button>
                </div>
            </div>`

}


function AppendPaginationButton(){

    let btn="";
  
    for(let i=1;i<=6;i++){
      btn=btn+getbutton(i,i)
    }
  
    paginationbtn.innerHTML=btn;
  
  }
  
  
  function getbutton(pno,text){
    return `<button class="pagination-button" data-page-number="${pno}">${text}</button>`
  }
  
  
  
  let buttonsel = document.querySelectorAll("button");

  
  paginatedata();

  
  function paginatedata(){

    for(let btn of buttonsel){

      btn.addEventListener("click",function (e){

        let pagenumber=e.target.dataset.pageNumber;

        FetchAndDisplayProducts(pagenumber);

      })
    }
  }



let SearchProduct = document.getElementById('Niteshproductsearch');

let FilterbyCategory = document.getElementById('Niteshcategoryselect');

let filterbyprice = document.getElementById("NiteshsortbyPrice");

let pricerange='';



FilterbyCategory.addEventListener('change', productfilterFunc);

SearchProduct.addEventListener('input', productfilterFunc);

filterbyprice.addEventListener("change", productfilterFunc);





function productfilterFunc(){
    
    if(filterbyprice.value === "High to Low"){
        pricerange='desc'
    }
    
    else if(filterbyprice.value === "Low to High"){
        pricerange='asc'
    }

    if(FilterbyCategory.value==="Men"){
        Category="Men";
    }
    else if(FilterbyCategory.value==="Women"){
        Category="Women";
    }
    else if(FilterbyCategory.value==="Kids"){
        Category="Kids";
    }
    else{
        Category='';
    }


    // console.log(FilterbyCategory.value, SearchProduct.value, pricerange)


    if(Category!==''){

        let url = `${BaseURL}/product/getbycategory/${Category}?search=${SearchProduct.value}&price=${pricerange}`

        FilterAndSearchProduct(url)
    }
    else{

        let url = `${BaseURL}/product/getall?search=${SearchProduct.value}&price=${pricerange}`

        FilterAndSearchProduct(url)
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