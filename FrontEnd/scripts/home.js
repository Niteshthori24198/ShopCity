
const HOMEBASEURL = `http://localhost:3000`


let ProductDB = []

let MenDB = []

let WomenDB = []

let KidDB = []


fetchProducts()



async function fetchProducts(){

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

    const Mencont = document.querySelector('.nitesh_top_grid');

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

    const WoMencont = document.querySelector('.nitesh_lower_bottom');


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

    const kidcont = document.querySelector('.nitesh_ourbrandsection');

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