// =========================
// Movie Data (with posters)
// =========================
let movies = JSON.parse(localStorage.getItem("movies")) || {
    "Inception": {
        description: "A skilled thief enters the dreams of others to steal secrets.",
        poster: "https://m.media-amazon.com/images/I/51v5ZpFyaFL._AC_.jpg"
    },
    "Interstellar": {
        description: "A team of explorers travels through a wormhole to save humanity.",
        poster: "https://m.media-amazon.com/images/I/91qv0A+96-L._AC_SL1500_.jpg"
    },
    "The Matrix": {
        description: "A hacker discovers the world is a simulated reality controlled by machines.",
        poster: "https://m.media-amazon.com/images/I/51EG732BV3L._AC_.jpg"
    }
};

// Save movies to LocalStorage
function saveMovies() {
    localStorage.setItem("movies", JSON.stringify(movies));
}

// =========================
// DOM Elements
// =========================
const movieList = document.getElementById("movie-list");
const movieDetails = document.getElementById("movie-description");
const moviePoster = document.createElement("img");
moviePoster.id = "movie-poster";

const reviewInput = document.getElementById("review-input");
const submitReviewBtn = document.getElementById("submit-review");
const reviewList = document.getElementById("review-list");

const addMovieBtn = document.getElementById("add-movie-btn");
const newMovieName = document.getElementById("new-movie-name");
const newMovieDesc = document.getElementById("new-movie-description");
const newMoviePoster = document.getElementById("new-movie-poster");

const resetBtn = document.getElementById("resetReviews");
const watchlistBtn = document.getElementById("watchlist-btn");

// Track current movie and edit index
let currentMovie = null;
let editIndex = null;

// =========================
// Render Movie List
// =========================
function updateMovieListUI() {
    movieList.innerHTML = "<h2>Movies</h2><ul id='movie-ul'></ul>";
    const ul = document.getElementById("movie-ul");

    Object.keys(movies).forEach(movie => {
        const li = document.createElement("li");
        li.textContent = movie;
        li.classList.add("movie-item");
        li.dataset.movie = movie;

        // ✅ Attach click listener directly
        li.addEventListener("click", () => selectMovie(movie, li));

        ul.appendChild(li);
    });
}

updateMovieListUI();

// =========================
// Select Movie Function
// =========================
function selectMovie(movie, liElement) {
    currentMovie = movie;

    // Highlight selected movie
    document.querySelectorAll(".movie-item").forEach(item => {
        item.classList.remove("active");
    });
    liElement.classList.add("active");

    // Show details
    movieDetails.innerHTML = `
        <h2>${movie}</h2>
        <p>${movies[movie].description}</p>
    `;

    moviePoster.src = movies[movie].poster;
    moviePoster.alt = movie;
    movieDetails.appendChild(moviePoster);

    // Load reviews
    loadReviews(movie);
}

// =========================
// Review Helpers
// =========================
function getReviews(movie) {
    let all = JSON.parse(localStorage.getItem("reviews")) || {};
    return all[movie] || [];
}

function saveReviews(movie, list) {
    let all = JSON.parse(localStorage.getItem("reviews")) || {};
    all[movie] = list;
    localStorage.setItem("reviews", JSON.stringify(all));
}

// =========================
// Load Reviews
// =========================
function loadReviews(movie) {
    const reviews = getReviews(movie);
    reviewList.innerHTML = "";

    reviews.forEach((rev, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span class="review-text">${rev}</span>
            <button class="edit-review" data-index="${index}">Edit</button>
            <button class="delete-review" data-index="${index}">Delete</button>
        `;
        reviewList.appendChild(li);
    });
}

// =========================
// Submit Review (Add or Edit)
// =========================
submitReviewBtn.addEventListener("click", () => {
    if (!currentMovie) {
        alert("Please select a movie first!");
        return;
    }

    const text = reviewInput.value.trim();
    if (!text) return;

    let reviews = getReviews(currentMovie);

    if (editIndex === null) {
        reviews.push(text); // Add new
    } else {
        reviews[editIndex] = text; // Edit existing
        submitReviewBtn.textContent = "Submit Review";
        editIndex = null;
    }

    saveReviews(currentMovie, reviews);
    loadReviews(currentMovie);
    reviewInput.value = "";
});

// =========================
// Edit Review
// =========================
reviewList.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-review")) {
        const index = e.target.dataset.index;
        const reviews = getReviews(currentMovie);

        reviewInput.value = reviews[index];
        submitReviewBtn.textContent = "Save Changes";
        editIndex = index;
    }
});

// =========================
// Delete Review
// =========================
reviewList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-review")) {
        const index = e.target.dataset.index;
        let reviews = getReviews(currentMovie);

        reviews.splice(index, 1);
        saveReviews(currentMovie, reviews);

        loadReviews(currentMovie);
    }
});

// =========================
// Reset Reviews
// =========================
resetBtn.addEventListener("click", () => {
    if (!currentMovie) {
        alert("Select a movie to reset its reviews.");
        return;
    }
    if (!confirm("Delete ALL reviews for this movie?")) return;

    saveReviews(currentMovie, []);
    loadReviews(currentMovie);
});

// =========================
// Add Movie
// =========================
addMovieBtn.addEventListener("click", () => {
    const name = newMovieName.value.trim();
    const desc = newMovieDesc.value.trim();
    const poster = newMoviePoster.value.trim();

    if (!name || !desc || !poster) {
        alert("Please fill in all movie fields.");
        return;
    }

    movies[name] = { description: desc, poster: poster };
    saveMovies();
    updateMovieListUI();

    newMovieName.value = "";
    newMovieDesc.value = "";
    newMoviePoster.value = "";
});

// =========================
// Watchlist
// =========================
watchlistBtn.addEventListener("click", () => {
    if (!currentMovie) {
        alert("Select a movie to add to your watchlist.");
        return;
    }

    let list = JSON.parse(localStorage.getItem("watchlist")) || [];

    if (!list.includes(currentMovie)) {
        list.push(currentMovie);
        localStorage.setItem("watchlist", JSON.stringify(list));
        alert(currentMovie + " added to your watchlist!");
    } else {
        alert("Already in your watchlist.");
    }
});
