

const baseUrl = `http://localhost:3000`

let allOrdersHere = document.getElementById('allOrdersHere');

let token = localStorage.getItem("usertoken") || null;

if(!token){

    alert("Kindly login first to access orders")

    location.href = "../view/user.login.html"
}



fetchAndRenderOrders()


function fetchAndRenderOrders(){

    fetch(`${baseUrl}/order/get`,{
        method:'GET',
        headers:{
            'Content-type':'application/json',
            'authorization':`Bearer ${token}`
        }
    })
    .then((res)=>{
        return res.json()
    })
    .then((data)=>{

        if(data.Success){

            console.log(data)

            RenderOrdersinPage(data.Orders)

        }
        else{
            alert(data.msg)
        }
       
    })
    .catch((err)=>{
        console.log(err)
    })

}





// ***
function RenderOrdersinPage(Orders){
    // console.log("---->",Orders);

    Orders = Orders.Products.reverse();

    allOrdersHere.innerHTML = ''

    const orderHTML = Orders.map((item)=>{
        return getordersBox(item._id,item.Date,item.Address , item.Status , item.product.Image, item.product.Title , item.product.Category , item.product.Price,item.Quantity)
    }).join('')

    allOrdersHere.innerHTML = orderHTML;
}

// ***
function getordersBox(id,date,add,status,img,title,cat,price,quant){

    return (
        `
            <div>
                <div>
                    <img src="${img}" alt="error">
                </div>
                <div>
                    <h3>Product :- ${title} [${cat}]</h3>
                    <p>Order Date :- ${date}</p>
                    <p>Quantity :- ${quant}</p>
                    <p>Total Price :- ${quant*price} Rs</p>
                    <p>Order Status :- ${status}</p>
                    <p>Shipping Address :- ${add}</p>
                    ${((status=='Delivered')|| (status=='Cancelled')) ? '' : `<button onclick="handleCancel('${id}')" class="cancelbtn" >Cancel Order</button>`}
                   
                </div>
            </div>
        `
    )

}




function handleCancel(id){
    // console.log(id)

    if(!confirm('Are you sure you want to cancel the order?')){
        return
    }

    document.querySelector('.cancelbtn').innerHTML = '<i class="fa fa-refresh fa-spin"></i> Cancel Order'

    fetch(`${baseUrl}/order/cancel/${id}`,{
        method:'DELETE',
        headers:{
            'Content-type':'application/json',
            'authorization':`Bearer ${token}`
        }
    })
    .then((res)=>{
        return res.json()
    })
    .then((data)=>{

        document.querySelector('.cancelbtn').innerHTML = 'Cancel Order'
        
        if(data.Success){
            
            console.log(data.msg)
            location.reload()
            
            
        }
        else{
            alert(data.msg)
        }
        
    })
    .catch((err)=>{
        document.querySelector('.cancelbtn').innerHTML = 'Cancel Order'
        console.log(err)
    })

}