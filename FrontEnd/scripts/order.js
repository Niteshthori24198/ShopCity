

const baseUrl = `http://localhost:3000`

let tbodyelement = document.querySelector('tbody');

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

            console.log(data.Orders.Products)


            RenderOrders(data.Orders)

        }
        else{
            alert(data.msg)
        }
       
    })
    .catch((err)=>{
        console.log(err)
    })

}


function  RenderOrders(Orders){

    console.log("---->",Orders);

    Orders = Orders.Products;

    tbodyelement.innerHTML = ''

    const order = Orders.map((item)=>{

        return getorderRow(item._id,item.Date,item.Address , item.Status , item.product.Image, item.product.Title , item.product.Category , item.product.Price,item.Quantity)
    }).join('')

    tbodyelement.innerHTML = order

}


function getorderRow(id,date,add,status,img,title,cat,price,quant){


    return ` <tr>
                <td><img src="${img}" alt="error" class = "orderimage"></td>
                <td>${title} [${cat}]</td>
                <td>${quant}</td>
                <td>${quant*price} Rs</td>
                <td>${date}</td>
                <td>${add}</td>
                <td>${status}</td>
                <td><button onclick="handleCancel('${id}')" class="cancelbtn" ${((status=='Delivered')|| (status=='Cancelled'))? "Disabled" : ""}>Cancel</button></td>
            </tr>`

}



function handleCancel(id){
    console.log(id)
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

        if(data.Success){

            console.log(data.msg)
            location.reload()
            
           
        }
        else{
            alert(data.msg)
        }
       
    })
    .catch((err)=>{
        console.log(err)
    })

}