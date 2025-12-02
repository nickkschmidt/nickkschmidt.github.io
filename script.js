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

let selectedRating = 0;
const stars = document.querySelectorAll(".star");

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

stars.forEach(star => {
    star.addEventListener("click", () => {
        selectedRating = parseInt(star.getAttribute("data-value"));

        // Update star visuals
        stars.forEach(s => {
            s.classList.toggle("selected", parseInt(s.getAttribute("data-value")) <= selectedRating);
        });
    });
});

function updateReviewList(movie) {
    reviewList.innerHTML = "";

    movieReviews[movie].forEach(review => {
        const li = document.createElement("li");

        // Create star display
        const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);

        li.textContent = `${stars} — ${review.text}`;
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

    if (selectedRating === 0) {
        alert("Please choose a star rating!");
        return;
    }

    // Find selected movie
    const selected = document.querySelector(".movie-item.selected");
    if (!selected) {
        alert("Please select a movie first!");
        return;
    }

    const movie = selected.getAttribute("data-movie");

    // Save review object
    movieReviews[movie].push({
        rating: selectedRating,
        text: reviewText
    });
    localStorage.setItem("movieReviews", JSON.stringify(movieReviews));

    // Refresh list
    updateReviewList(movie);

    // Reset rating
    selectedRating = 0;
    stars.forEach(s => s.classList.remove("selected"));

    reviewInput.value = "";
});







