
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

    document.getElementById("adminitemscontainer").innerHTML=''

    const itemcard = products.map((item)=>{
        return GetItemCard({...item})
    }).join('')

    document.getElementById("adminitemscontainer").innerHTML=itemcard;


}


function GetItemCard({_id,Category,Description, Image, Price, Quantity, Rating, Title}) {

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
            <button> Edit Product </button>
            <button> Delete Product </button>
        </div>
       
    </div>
    
    `

}

