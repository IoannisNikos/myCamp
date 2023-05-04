const mybutton=document.getElementById("myBtn");

window.onscroll=function () { scrollFunction() };

function scrollFunction() {
    if (document.body.scrollTop>500||document.documentElement.scrollTop>500) {
        mybutton.style.display="block";
    } else {
        mybutton.style.display="none";
    }
}

mybutton.addEventListener('click', function () {
    document.documentElement.scrollTop=0;
})