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
        poster: "https://mythicwall.com/cdn/shop/files/Interstellar_2BMovie_2B_2Bposter_2BPrint_2BWall_2BArt_2BPoster_2B1-W0pfS_1024x1024.jpg?v=1762442294"
    },
    { 
        title: "The Matrix", 
        description: "A hacker discovers the world is a simulated reality.",
        poster: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/83c9adee-fb29-40a6-8232-2f5c1a310874/d25m56x-382054fe-612f-44dd-939d-28df1dfbcb71.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiIvZi84M2M5YWRlZS1mYjI5LTQwYTYtODIzMi0yZjVjMWEzMTA4NzQvZDI1bTU2eC0zODIwNTRmZS02MTJmLTQ0ZGQtOTM5ZC0yOGRmMWRmYmNiNzEuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.LmCL_oCJdLW74Yuuzb7mqMM-ruqoyA9qJEOht2IyMMc"
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
const addMovieBtn = document.getElementById("add-movie-btn");
const newMovieTitle = document.getElementById("new-movie-title");
const newMovieDescription = document.getElementById("new-movie-description");
const newMoviePoster = document.getElementById("new-movie-poster");
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

// Add Movie Event
addMovieBtn.addEventListener("click", () => {
    const title = newMovieTitle.value.trim();
    const description = newMovieDescription.value.trim();
    const poster = newMoviePoster.value.trim();

    if (!title || !description) {
        alert("Please fill in the movie title and description.");
        return;
    }

    // Add to movies array
    movies.push({
        title: title,
        description: description,
        poster: poster
    });

    // Save to localStorage
    localStorage.setItem("movies", JSON.stringify(movies));

    // Re-render movie list
    renderMovieList();

    // Clear form fields
    newMovieTitle.value = "";
    newMovieDescription.value = "";
    newMoviePoster.value = "";
});

// -------------------------------
// Reset All Reviews
// -------------------------------
resetBtn.addEventListener("click", () => {
    if (!confirm("Delete ALL reviews?")) return;

    reviews = {};
    localStorage.setItem("reviews", JSON.stringify(reviews));
    reviewList.innerHTML = "";
});

const deleteMovieBtn = document.getElementById("delete-movie-btn");

deleteMovieBtn.addEventListener("click", () => {
    if (!currentMovie) return;

    if (!confirm(`Are you sure you want to delete "${currentMovie}"? This will also delete its reviews.`)) return;

    // Remove movie from movies array
    movies = movies.filter(m => m.title !== currentMovie);

    // Remove reviews for that movie
    delete reviews[currentMovie];

    // Update localStorage
    localStorage.setItem("movies", JSON.stringify(movies));
    localStorage.setItem("reviews", JSON.stringify(reviews));

    // Clear selection
    currentMovie = null;
    document.getElementById("movie-description").innerHTML = "Click a movie to view its description.";
    reviewList.innerHTML = "";
    deleteMovieBtn.style.display = "none";

    // Re-render movie list
    renderMovieList();
});

// Show the delete button whenever a movie is selected
function selectMovie(movie) {
    currentMovie = movie.title;

    document.querySelectorAll(".movie-item")
        .forEach(item => item.classList.remove("selected"));

    // Highlight selected movie
    event.target.classList.add("selected");

    // Show movie details
    const movieDescriptionEl = document.getElementById("movie-description");
    movieDescriptionEl.innerHTML = "";
    if (movie.poster) {
        const img = document.createElement("img");
        img.src = movie.poster;
        img.style.maxWidth = "200px";
        img.style.display = "block";
        img.style.marginBottom = "10px";
        movieDescriptionEl.appendChild(img);
    }
    const desc = document.createElement("p");
    desc.textContent = movie.description;
    movieDescriptionEl.appendChild(desc);

    // Show delete button
    deleteMovieBtn.style.display = "inline-block";

    // Load reviews for selected movie
    renderReviews(movie.title);
}
 
