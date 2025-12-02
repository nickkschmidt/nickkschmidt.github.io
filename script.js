// Movie descriptions
const movieInfo = {
    "Inception": "A skilled thief enters people's dreams to steal ideas.",
    "Interstellar": "A team travels through a wormhole in search of a new home for humanity.",
    "The Matrix": "A hacker discovers the world is a simulated reality."
};

// Load or initialize review storage
let movieReviews = JSON.parse(localStorage.getItem("movieReviews")) || {
    "Inception": [],
    "Interstellar": [],
    "The Matrix": []
};

// DOM elements
const movieItems = document.querySelectorAll(".movie-item");
const movieDescription = document.getElementById("movie-description");
const reviewInput = document.getElementById("review-input");
const submitReviewBtn = document.getElementById("submit-review");
const reviewList = document.getElementById("review-list");

// Load saved reviews from localStorage
function loadReviews() {
    const saved = JSON.parse(localStorage.getItem("reviews")) || [];

    saved.forEach(text => {
        const li = document.createElement("li");
        li.textContent = text;
        reviewList.appendChild(li);
    });
}
loadReviews();

// Movie selection event
movieItems.forEach(item => {
    item.addEventListener("click", () => {
        // Highlight selected movie
        movieItems.forEach(m => m.classList.remove("selected"));
        item.classList.add("selected");

        const movie = item.getAttribute("data-movie");
        movieDescription.textContent = movieInfo[movie];

        // Display that movie's reviews
        updateReviewList(movie);
    });
});

function updateReviewList(movie) {
    reviewList.innerHTML = ""; // clear old reviews
    movieReviews[movie].forEach(text => {
        const li = document.createElement("li");
        li.textContent = text;
        reviewList.appendChild(li);
    });
}

// Review submission event
submitReviewBtn.addEventListener("click", () => {
    const reviewText = reviewInput.value.trim();

    if (reviewText === "") {
        alert("Please write a review before submitting.");
        return;
    }

    // Find selected movie
    const selected = document.querySelector(".movie-item.selected");
    if (!selected) {
        alert("Please select a movie first!");
        return;
    }

    const movie = selected.getAttribute("data-movie");

    // Save the new review
    movieReviews[movie].push(reviewText);
    localStorage.setItem("movieReviews", JSON.stringify(movieReviews));

    // Update display
    updateReviewList(movie);

    reviewInput.value = "";
});





