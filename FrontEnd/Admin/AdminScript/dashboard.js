

const admin_baseurl = `http://localhost:3000`


const adminusertoken = localStorage.getItem('usertoken') || null;

if (!adminusertoken) {
    location.href = "../view/user.login.html"
}


const totalCustomersCount = document.getElementById('totalCustomersCount');
const totalProductsCount = document.getElementById('totalProductsCount');

const totalRevenue = document.getElementById('totalRevenue');

const totalDeliveredCount = document.getElementById('totalDeliveredCount');
const totalConfirmedCount = document.getElementById('totalConfirmedCount');
const totalCanceledCount = document.getElementById('totalCanceledCount');


fetchAndRenderUsers();
fetchAndRenderProducts();
fetchAndRenderOrders();


let allProductsDataHere = [];
let allOrdersDataHere = [];


function fetchAndRenderUsers() {

    fetch(`${admin_baseurl}/user/getall`, {
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

            console.log("user data fetched ", data.UsersData)
            totalCustomersCount.innerText = data.UsersData.length

        })
        .catch((err) => {
            console.log(err)
        })


}




function fetchAndRenderProducts() {

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

            console.log("product data fetched ", data.Products);

            allProductsDataHere = data.Products;

            totalProductsCount.innerText = data.Products.length;

            pieChart1()

        })
        .catch((err) => {
            console.log(err)
        })


}



function fetchAndRenderOrders() {

    fetch(`${admin_baseurl}/order/getall`, {
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

            console.log("order data fetched ", data.Orders)
            formateOrdersData(data.Orders)

        })
        .catch((err) => {
            console.log(err)
        })


}



function formateOrdersData(Orders) {

    let totalRevenueGenerated = 0;
    let countCanceledOrder = 0
    let countDeliveredOrder = 0
    let countConfirmedOrder = 0

    let pieChartObj2 = {}

    Orders.forEach((curr) => {

        curr.Products.forEach((order) => {

            console.log(order);
            console.log(order.Quantity, order.Status, order.product.Price, order.product.Category);

            if (order.Status !== 'Cancelled') {
                totalRevenueGenerated += (+order.TotalPrice);
            }
            console.log(totalRevenueGenerated);

            if (order.Status === 'Cancelled') {
                countCanceledOrder++
            } else if (order.Status === 'Delivered') {
                countDeliveredOrder++
            } else {
                countConfirmedOrder++
            }

            if(pieChartObj2[order.product.Category]){
                pieChartObj2[order.product.Category] += order.Quantity
            }else{
                pieChartObj2[order.product.Category] = order.Quantity
            }


        })

    });


    totalRevenue.innerText = `Rs. ${totalRevenueGenerated}/-`;
    totalDeliveredCount.innerText = countDeliveredOrder;
    totalConfirmedCount.innerText = countConfirmedOrder;
    totalCanceledCount.innerText = countCanceledOrder;

    console.log(pieChartObj2);
    pieChart2(pieChartObj2)

}




function pieChart1(){
    
    let obj = {}
    
    allProductsDataHere.forEach((ele)=>{
        if(obj[ele.Category]){
            obj[ele.Category]++
        }else{
            obj[ele.Category] = 1
        }
    })
    
    
    // Extract labels and counts from the data
    const labels = Object.keys(obj);
    const counts = Object.values(obj);
    
    console.log(labels, counts)
    
    // Create the pie chart
    const ctx = document.getElementById('pie-chart1').getContext('2d');
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: counts,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Custom colors for each slice
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'] // Colors on hover
            }]
        },
        options: {
            responsive: true
        }
    });

}


function pieChart2(obj){
    
    // Extract labels and counts from the data
    const labels = Object.keys(obj);
    const counts = Object.values(obj);
    
    console.log(labels, counts)
    
    // Create the pie chart
    const ctx = document.getElementById('pie-chart2').getContext('2d');
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: counts,
                backgroundColor: ["#007bff", "#ccc", "#999"], // Custom colors for each slice
                hoverBackgroundColor: ["#007bff", "#ccc", "#999"] // Colors on hover
            }]
        },
        options: {
            responsive: true
        }
    });

}

// #4BC0C0', '#4BC0C3', '#4BC0C2', '#4BC0C1'

