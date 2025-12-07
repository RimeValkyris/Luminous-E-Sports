let slideIndex = 0;
let slideInterval;

function startSlideshow(){
    clearInterval(slideInterval);

    slideInterval = setInterval (showSlides, 4000);
}

function showSlides(){
    let slides = document.getElementsByClassName("slide-fade");

    for(let i = 0; i< slides.length; i++){
        slides [i].style.display = "none";
    }

    slideIndex++;

    if(slideIndex > slides.length){
        slideIndex = 1;

    }

    slides[slideIndex - 1].style.display = "block";
}


startSlideshow();
