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

if (localStorage.getItem("movies")) {
    movies = JSON.parse(localStorage.getItem("movies"));
}

let reviews = JSON.parse(localStorage.getItem("reviews")) || {};

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
const stars = document.querySelectorAll(".star");

let selectedRating = 0;
let currentMovie = null;

// -------------------------------
// Render Movie List
// -------------------------------
function renderMovieList() {
    movieList.innerHTML = "";
    movies.forEach(movie => {
        const li = document.createElement("li");
        li.classList.add("movie-item");
        li.setAttribute("data-movie", movie.title);

        if (movie.poster) {
            const img = document.createElement("img");
            img.src = movie.poster;
            li.appendChild(img);
        }

        li.appendChild(document.createTextNode(movie.title));
        li.addEventListener("click", () => selectMovie(movie));
        movieList.appendChild(li);
    });
}

// -------------------------------
// Select Movie
// -------------------------------
function selectMovie(movie) {
    currentMovie = movie.title;
    document.querySelectorAll(".movie-item").forEach(item => item.classList.remove("selected"));
    document.querySelector(`.movie-item[data-movie="${movie.title}"]`)?.classList.add("selected");

    movieDescription.innerHTML = "";
    if (movie.poster) {
        const img = document.createElement("img");
        img.src = movie.poster;
        movieDescription.appendChild(img);
    }
    const desc = document.createElement("p");
    desc.textContent = movie.description;
    movieDescription.appendChild(desc);

    selectedRating = 0;
    updateStarDisplay();
    renderReviews(movie.title);
}

// -------------------------------
// Star Rating
// -------------------------------
stars.forEach(star => {
    star.addEventListener("click", () => {
        selectedRating = Number(star.getAttribute("data-value"));
        updateStarDisplay();
    });
});

function updateStarDisplay() {
    stars.forEach(star => {
        star.classList.toggle("selected", Number(star.getAttribute("data-value")) <= selectedRating);
    });
}

// -------------------------------
// Reviews
// -------------------------------
submitReviewBtn.addEventListener("click", () => {
    if (!currentMovie) return alert("Select a movie first.");
    const text = reviewInput.value.trim();
    if (!text) return alert("Please write a review.");
    if (!reviews[currentMovie]) reviews[currentMovie] = [];
    reviews[currentMovie].push({ id: Date.now(), text, rating: selectedRating });
    localStorage.setItem("reviews", JSON.stringify(reviews));
    reviewInput.value = "";
    selectedRating = 0;
    updateStarDisplay();
    renderReviews(currentMovie);
});

function renderReviews(title) {
    reviewList.innerHTML = "";
    const movieReviews = reviews[title] || [];
    movieReviews.forEach(r => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${"★".repeat(r.rating) + "☆".repeat(5 - r.rating)}</strong><br>
            <span>${r.text}</span>
        `;
        reviewList.appendChild(li);
    });
}

// Reset all reviews
resetBtn.addEventListener("click", () => {
    if (!confirm("Delete ALL reviews?")) return;
    reviews = {};
    localStorage.setItem("reviews", JSON.stringify(reviews));
    reviewList.innerHTML = "";
});

// Add Movie
addMovieBtn.addEventListener("click", () => {
    const title = newMovieTitle.value.trim();
    const desc = newMovieDescription.value.trim();
    const poster = newMoviePoster.value.trim();
    if (!title || !desc) return alert("Please fill in movie title and description.");
    movies.push({ title, description: desc, poster });
    localStorage.setItem("movies", JSON.stringify(movies));
    renderMovieList();
    newMovieTitle.value = "";
    newMovieDescription.value = "";
    newMoviePoster.value = "";
});

// Initial render
renderMovieList();
