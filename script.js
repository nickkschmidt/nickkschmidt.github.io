// Movie descriptions
const movieInfo = {
    "Inception": "A skilled thief enters people's dreams to steal ideas.",
    "Interstellar": "A team travels through a wormhole in search of a new home for humanity.",
    "The Matrix": "A hacker discovers the world is a simulated reality."
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
        // Remove "selected" class from all items
        movieItems.forEach(m => m.classList.remove("selected"));

        // Add "selected" class to clicked item
        item.classList.add("selected");

        // Update description
        const movie = item.getAttribute("data-movie");
        movieDescription.textContent = movieInfo[movie];
    });
});


// Review submission event
submitReviewBtn.addEventListener("click", () => {
    const reviewText = reviewInput.value.trim();

    if (reviewText === "") {
        alert("Please write a review before submitting.");
        return;
    }

    const li = document.createElement("li");
    li.textContent = reviewText;
reviewList.appendChild(li);

// Save to localStorage
let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
reviews.push(reviewText);
localStorage.setItem("reviews", JSON.stringify(reviews));

reviewInput.value = "";

});



