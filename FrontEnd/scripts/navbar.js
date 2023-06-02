
const base_Url_Nav = `http://localhost:3000`

const token_nav = localStorage.getItem("usertoken") || null;

console.log(token_nav)

if (token_nav) {

    fetch(`${base_Url_Nav}/cart/get`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${token_nav}`
        }
    })
        .then((res) => {
            return res.json()
        })
        .then((data) => {


            if (data.Success) {


                cartitems = [...data.CartItem.Products];

                console.log("cart---->", cartitems)

                if (cartitems.length) {

                    document.querySelector('.shop-nav-icons sup').innerHTML=cartitems.length;
                }

                else {
                    document.querySelector('.shop-nav-icons sup').innerHTML=cartitems.length;
                }
            }

            else {
                document.querySelector('.shop-nav-icons sup').innerHTML='';
            }


        })
        .catch((err)=>{
            console.log(err)
        })


}







document.getElementsByClassName("shop-city-links")[0].style.display = 'none';



document.getElementsByClassName("fa")[3].addEventListener("click", function () {
    document.getElementsByClassName("shop-city-links")[0].classList.toggle("nav-ham-showmylinks");


    if (document.getElementsByClassName("shop-city-links")[0].classList.value == 'shop-city-links') {
        document.getElementsByClassName("shop-city-links")[0].style.display = 'none'

    } else {
        document.getElementsByClassName("shop-city-links")[0].style.display = 'block'
    }
})


