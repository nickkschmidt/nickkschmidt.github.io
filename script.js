// ---------------------------
// Movies array with posters
// ---------------------------
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
        poster: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg"
    }
];

// ---------------------------
// Review storage
// ---------------------------
let movieReviews = JSON.parse(localStorage.getItem("movieReviews")) || {};
movies.forEach(m => { if (!movieReviews[m.title]) movieReviews[m.title] = []; });

// ---------------------------
// DOM Elements
// ---------------------------
const movieList = document.querySelector("#movie-list ul");
const movieDescription = document.getElementById("movie-description");
const reviewInput = document.getElementById("review-input");
const submitReviewBtn = document.getElementById("submit-review");
const reviewList = document.getElementById("review-list");
const stars = document.querySelectorAll(".star");
let selectedRating = 0;

// ---------------------------
// Render Movie List
// ---------------------------
function renderMovieList() {
    movieList.innerHTML = "";
    movies.forEach(movie => {
        const li = document.createElement("li");
        li.classList.add("movie-item");
        li.setAttribute("data-movie", movie.title);

        if (movie.poster) {
            const thumb = document.createElement("img");
            thumb.src = movie.poster;
            thumb.alt = movie.title + " Poster";
            li.appendChild(thumb);
        }

        li.appendChild(document.createTextNode(movie.title));
        movieList.appendChild(li);

        li.addEventListener("click", () => {
            document.querySelectorAll(".movie-item").forEach(m => m.classList.remove("selected"));
            li.classList.add("selected");

            movieDescription.innerHTML = "";
            if (movie.poster) {
                const img = document.createElement("img");
                img.src = movie.poster;
                img.alt = movie.title + " Poster";
                movieDescription.appendChild(img);
            }
            const desc = document.createElement("p");
            desc.textContent = movie.description;
            movieDescription.appendChild(desc);

            updateReviewList(movie.title);
        });
    });
}

// ---------------------------
// Update Review List
// ---------------------------
function updateReviewList(movie) {
    reviewList.innerHTML = "";
    movieReviews[movie].forEach(review => {
        const li = document.createElement("li");
        const starDisplay = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
        li.textContent = `${starDisplay} — ${review.text}`;
        reviewList.appendChild(li);
    });
}

// ---------------------------
// Star Rating
// ---------------------------
stars.forEach(star => {
    star.addEventListener("click", () => {
        selectedRating = parseInt(star.dataset.value);
        stars.forEach(s => s.classList.toggle("selected", parseInt(s.dataset.value) <= selectedRating));
    });
});

// ---------------------------
// Submit Review
// ---------------------------
submitReviewBtn.addEventListener("click", () => {
    const reviewText = reviewInput.value.trim();
    if (!reviewText) return alert("Please write a review.");
    if (selectedRating === 0) return alert("Please select a rating.");

    const selected = document.querySelector(".movie-item.selected");
    if (!selected) return alert("Select a movie first.");

    const movie = selected.dataset.movie;
    movieReviews[movie].push({ rating: selectedRating, text: reviewText });
    localStorage.setItem("movieReviews", JSON.stringify(movieReviews));
    updateReviewList(movie);

    reviewInput.value = "";
    selectedRating = 0;
    stars.forEach(s => s.classList.remove("selected"));
});

// ---------------------------
// Add Movie Form
// ---------------------------
const addMovieForm = document.getElementById("addMovieForm");
addMovieForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("newTitle").value.trim();
    const description = document.getElementById("newDescription").value.trim();
    const poster = document.getElementById("newPoster").value.trim();

    if (!title || !description) return;

    const newMovie = { title, description, poster: poster || null };
    movies.push(newMovie);
    if (!movieReviews[title]) movieReviews[title] = [];
    renderMovieList();
    addMovieForm.reset();
});

// ---------------------------
// Reset Reviews Button
// ---------------------------
document.getElementById("resetReviews").addEventListener("click", () => {
    localStorage.removeItem("movieReviews");
    movieReviews = {};
    movies.forEach(m => movieReviews[m.title] = []);
    const selected = document.querySelector(".movie-item.selected");
    if (selected) updateReviewList(selected.dataset.movie);
    alert("All reviews cleared!");
});

// ---------------------------
// Initial Render
// ---------------------------
renderMovieList();




