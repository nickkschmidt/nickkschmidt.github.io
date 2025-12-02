// ---------------------------
// Movie descriptions
// ---------------------------
const movieInfo = {
    "Inception": "A skilled thief enters people's dreams to steal ideas.",
    "Interstellar": "A team travels through a wormhole in search of a new home for humanity.",
    "The Matrix": "A hacker discovers the world is a simulated reality."
};

// ---------------------------
// DOM elements
// ---------------------------
const movieItems = document.querySelectorAll(".movie-item");
const movieDescription = document.getElementById("movie-description");
const reviewInput = document.getElementById("review-input");
const submitReviewBtn = document.getElementById("submit-review");
const reviewList = document.getElementById("review-list");
const stars = document.querySelectorAll(".star");

let selectedRating = 0;

// ---------------------------
// Load or initialize review storage
// ---------------------------
let movieReviews = JSON.parse(localStorage.getItem("movieReviews")) || {
    "Inception": [],
    "Interstellar": [],
    "The Matrix": []
};

// ---------------------------
// Star rating click behavior
// ---------------------------
stars.forEach(star => {
    star.addEventListener("click", () => {
        selectedRating = parseInt(star.getAttribute("data-value"));

        // Update star visuals
        stars.forEach(s => {
            s.classList.toggle("selected", parseInt(s.getAttribute("data-value")) <= selectedRating);
        });
    });
});

// ---------------------------
// Update review list for a movie
// ---------------------------
function updateReviewList(movie) {
    reviewList.innerHTML = ""; // clear old reviews

    movieReviews[movie].forEach(review => {
        const li = document.createElement("li");

        // Create star display
        const starDisplay = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);

        li.textContent = `${starDisplay} — ${review.text}`;
        reviewList.appendChild(li);
    });
}

// ---------------------------
// Movie selection event
// ---------------------------
movieItems.forEach(item => {
    item.addEventListener("click", () => {

        // Highlight the selected movie
        movieItems.forEach(m => m.classList.remove("selected"));
        item.classList.add("selected");

        // Update description
        const movie = item.getAttribute("data-movie");
        movieDescription.textContent = movieInfo[movie];

        // Load that movie's reviews
        updateReviewList(movie);
    });
});

// ---------------------------
// Review submission event
// ---------------------------
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

    // Check if a movie is selected
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

    // Save to localStorage
    localStorage.setItem("movieReviews", JSON.stringify(movieReviews));

    // Refresh display
    updateReviewList(movie);

    // Reset rating stars
    selectedRating = 0;
    stars.forEach(s => s.classList.remove("selected"));

    // Clear input
    reviewInput.value = "";
});

document.getElementById("resetReviews").addEventListener("click", () => {
  localStorage.removeItem("reviews");
  alert("All reviews cleared!");
  location.reload(); // refresh to update UI
});

// --- Add New Movie ---
const addMovieForm = document.getElementById("addMovieForm");

addMovieForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("newTitle").value.trim();
  const description = document.getElementById("newDescription").value.trim();
  const poster = document.getElementById("newPoster").value.trim();

  if (!title || !description) return;

  const newMovie = {
    id: Date.now().toString(),   // unique ID
    title,
    description,
    poster: poster || null
  };

  movies.push(newMovie); // add to array

  renderMovieList(); // re-render sidebar

  // Clear form
  addMovieForm.reset();
});

// ---------------------------
// Auto-select the first movie on page load
// ---------------------------
movieItems[0].click();


