// -------------------------------
// Movie Data (with posters)
// -------------------------------
let movies = [
    { 
        title: "Inception", 
        description: "A skilled thief enters people's dreams to steal ideas.",
        poster: "https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg"
    },
    { 
        title: "Interstellar", 
        description: "A team travels through a wormhole in search of a new home for humanity.",
        poster: "https://image.tmdb.org/t/p/w500/nBNZadXqJSdt05SHLqgT0HuC5Gm.jpg"
    },
    { 
        title: "The Matrix", 
        description: "A hacker discovers the world is a simulated reality.",
        poster: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5Gm.jpg"
    }
];

// Load stored movies if any
if (localStorage.getItem("movies")) {
    movies = JSON.parse(localStorage.getItem("movies"));
}

// -------------------------------
// Reviews (from localStorage)
// -------------------------------
let reviews = JSON.parse(localStorage.getItem("reviews")) || {};

// DOM elements
const movieList = document.querySelector("#movie-list ul");
const movieDescription = document.getElementById("movie-description");
const reviewInput = document.getElementById("review-input");
const submitReviewBtn = document.getElementById("submit-review");
const reviewList = document.getElementById("review-list");
const resetBtn = document.getElementById("resetReviews");
let currentMovie = null;

// Star rating elements
const stars = document.querySelectorAll(".star");
let selectedRating = 0;

// -------------------------------
// Render Movie List
// -------------------------------
function renderMovieList() {
    movieList.innerHTML = "";

    movies.forEach(movie => {
        const li = document.createElement("li");
        li.classList.add("movie-item");
        li.setAttribute("data-movie", movie.title);

        // Thumbnail
        if (movie.poster) {
            const img = document.createElement("img");
            img.src = movie.poster;
            img.style.width = "50px";
            img.style.marginRight = "10px";
            img.style.borderRadius = "4px";
            li.appendChild(img);
        }

        const text = document.createTextNode(movie.title);
        li.appendChild(text);

        li.addEventListener("click", () => selectMovie(movie));

        movieList.appendChild(li);
    });
}

renderMovieList();

// -------------------------------
// Movie Selection
// -------------------------------
function selectMovie(movie) {
    currentMovie = movie.title;

    document.querySelectorAll(".movie-item")
        .forEach(item => item.classList.remove("selected"));

    event.target.classList.add("selected");

    // Render poster + description
    movieDescription.innerHTML = "";

    if (movie.poster) {
        const img = document.createElement("img");
        img.src = movie.poster;
        img.style.maxWidth = "200px";
        img.style.display = "block";
        img.style.marginBottom = "10px";
        movieDescription.appendChild(img);
    }

    const desc = document.createElement("p");
    desc.textContent = movie.description;
    movieDescription.appendChild(desc);

    // Load that movie’s reviews
    renderReviews(movie.title);
}

// -------------------------------
// Star Rating System
// -------------------------------
stars.forEach(star => {
    star.addEventListener("click", () => {
        selectedRating = Number(star.getAttribute("data-value"));
        updateStarDisplay();
    });
});

function updateStarDisplay() {
    stars.forEach(star => {
        star.classList.toggle(
            "selected",
            Number(star.getAttribute("data-value")) <= selectedRating
        );
    });
}

// -------------------------------
// Submit Review
// -------------------------------
submitReviewBtn.addEventListener("click", () => {
    if (!currentMovie) {
        alert("Select a movie first.");
        return;
    }

    const reviewText = reviewInput.value.trim();
    if (reviewText === "") {
        alert("Please write a review.");
        return;
    }

    if (!reviews[currentMovie]) reviews[currentMovie] = [];

    const review = {
        id: Date.now(),
        text: reviewText,
        rating: selectedRating || 0
    };

    reviews[currentMovie].push(review);

    localStorage.setItem("reviews", JSON.stringify(reviews));

    reviewInput.value = "";
    selectedRating = 0;
    updateStarDisplay();

    renderReviews(currentMovie);
});

// -------------------------------
// Render Reviews (with Edit/Delete)
// -------------------------------
function renderReviews(movieTitle) {
    reviewList.innerHTML = "";

    const movieReviews = reviews[movieTitle] || [];

    movieReviews.forEach(review => {
        const li = document.createElement("li");

        const starsDisplay =
            "★".repeat(review.rating) +
            "☆".repeat(5 - review.rating);

        li.innerHTML = `
            <strong>${starsDisplay}</strong><br>
            <span class="review-text">${review.text}</span>
            <button class="edit-btn" data-id="${review.id}">✏️</button>
            <button class="delete-btn" data-id="${review.id}">🗑</button>
        `;

        reviewList.appendChild(li);
    });

    attachReviewButtons(movieTitle);
}

// -------------------------------
// Edit & Delete Review Buttons
// -------------------------------
function attachReviewButtons(movieTitle) {

    // Delete review
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = Number(btn.getAttribute("data-id"));

            reviews[movieTitle] = reviews[movieTitle].filter(
                review => review.id !== id
            );

            localStorage.setItem("reviews", JSON.stringify(reviews));
            renderReviews(movieTitle);
        });
    });

    // Edit review
    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = Number(btn.getAttribute("data-id"));
            const movieReviews = reviews[movieTitle];
            const reviewToEdit = movieReviews.find(r => r.id === id);

            const newText = prompt("Edit your review:", reviewToEdit.text);

            if (newText && newText.trim() !== "") {
                reviewToEdit.text = newText.trim();
                localStorage.setItem("reviews", JSON.stringify(reviews));
                renderReviews(movieTitle);
            }
        });
    });
}

// -------------------------------
// Reset All Reviews
// -------------------------------
resetBtn.addEventListener("click", () => {
    if (!confirm("Delete ALL reviews?")) return;

    reviews = {};
    localStorage.setItem("reviews", JSON.stringify(reviews));
    reviewList.innerHTML = "";
});
