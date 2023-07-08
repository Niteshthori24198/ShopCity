
const HOMEBASEURL = `http://localhost:3000`

const Mencont = document.querySelector('.nitesh_top_grid');

const WoMencont = document.querySelector('.nitesh_lower_bottom');

const kidcont = document.querySelector('.nitesh_ourbrandsection');

let ProductDB = []

let MenDB = []

let WomenDB = []

let KidDB = []



fetchProducts()



async function fetchProducts(){


    Mencont.innerHTML=`<div id="loading_gif"><img  src="./Images/Loading.gif" alt="Loading ...."/></div>`

    WoMencont.innerHTML=`<div id="loading_gif"><img  src="./Images/Loading.gif" alt="Loading ...."/></div>`

    kidcont.innerHTML =`<div id="loading_gif"><img  src="./Images/Loading.gif" alt="Loading ...."/></div>`





    const response = await fetch(`${HOMEBASEURL}/product/getall`);

    const product = await response.json()

    ProductDB=product.Products;

    DivideCategoryBased()

    // console.log(ProductDB)
}



function DivideCategoryBased(){

    ProductDB.forEach((p)=>{
        if(p.Category==='Women'){
            WomenDB.push({Image:p.Image,Title:p.Title,_id:p._id})
        }
        else if(p.Category==='Men'){
            MenDB.push({Image:p.Image,Title:p.Title,_id:p._id})
        }
        else{
            KidDB.push({Image:p.Image,Title:p.Title,_id:p._id})
        }
    })


    RenderCategoryMen(MenDB)

    RenderCategoryWoMen(WomenDB)

    RenderCategoryKids(KidDB)

    // console.log(KidDB)

}



function RenderCategoryMen(MDB){


    let sc=0;
    let tsc=0;

    const filtereddata = MDB.filter((ele)=>{

        if(ele.Title.toLowerCase().includes('shoes'.toLowerCase()) && sc++<2){
            return ele
        }

        else if(ele.Title.toLowerCase().includes('shirt'.toLowerCase())){
            return ele
        }

        else if(ele.Title.toLowerCase().includes('t-shirt'.toLowerCase()) && tsc++<2){
            return ele
        }


    })



    const mendata = filtereddata.map((ele,i)=>{
        if(i<6){
            return getCard(ele.Image,ele.Title,ele._id)
        }
       
    }).join('')

    Mencont.innerHTML = mendata;

}



function RenderCategoryWoMen(WDB){



    const filtereddata = WDB.filter((ele)=>{

        if(ele.Title.toLowerCase().includes('dress'.toLowerCase())){
            return ele
        }

    })



    const womendata = filtereddata.map((ele,i)=>{
        if(i<6){
            return getCard(ele.Image,ele.Title,ele._id)
        }
       
    }).join('')

    WoMencont.innerHTML = womendata;

}



function RenderCategoryKids(KDB){


    const kiddata = KDB.map((ele,i)=>{
        if(i<6){
            return getCard(ele.Image,ele.Title,ele._id)
        }
       
    }).join('')

    kidcont.innerHTML = kiddata;

}





function  getCard(Image,Title,id){

    return `
    
    <div onclick="handleItemClick('${id}')">

        <img src="${Image}">
        <p>${Title}</p>
        
    </div>

    `

}



function handleItemClick(id){
    localStorage.setItem('productID',id)
    location.href = "./view/details.html"
}





let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
    slideIndex += n
    showSlides(slideIndex);
}

// Thumbnail image controls
function currentSlide(n) {
    slideIndex = n
    showSlides(n);
}

var idOfTimeOut = ''

function showSlides(n=null) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    if(!n){
        slideIndex++;
    }
    if (slideIndex > slides.length) { slideIndex = 1 }
    if(slideIndex <= 0) { slideIndex = slides.length }

    slides[slideIndex - 1].style.display = "block";

    if(idOfTimeOut){
        clearTimeout(idOfTimeOut)
    }
    idOfTimeOut = setTimeout(showSlides, 3000); // Change image every 2 seconds
}

