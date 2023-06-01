

document.getElementsByClassName("shop-city-links")[0].style.display = 'none';

document.getElementsByClassName("fa")[3].addEventListener("click", function () {
    document.getElementsByClassName("shop-city-links")[0].classList.toggle("nav-ham-showmylinks");


    if (document.getElementsByClassName("shop-city-links")[0].classList.value == 'shop-city-links') {
        document.getElementsByClassName("shop-city-links")[0].style.display = 'none'
    } else {
        document.getElementsByClassName("shop-city-links")[0].style.display = 'block'
    }
})