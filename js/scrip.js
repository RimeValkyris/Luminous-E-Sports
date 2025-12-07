let slideIndex = 0;
let slideInterval;

function startSlideshow(){
    clearInterval(slideInterval);
    // show the first slide immediately to avoid an empty carousel on load
    showSlides();
    slideInterval = setInterval(showSlides, 4000);
}

function showSlides(){
    const slides = document.getElementsByClassName("slide-fade");
    if (!slides || slides.length === 0) return;

    // hide all slides
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    // advance index and wrap using modulo
    slideIndex = (slideIndex + 1) % slides.length;

    // display current slide
    slides[slideIndex].style.display = "block";
}

// start when script loads
startSlideshow();
