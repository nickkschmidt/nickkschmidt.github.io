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
let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

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
const deleteMovieBtn = document.getElementById("delete-movie-btn");
const watchlistBtn = document.getElementById("watchlist-btn");
const watchlistList = document.getElementById("watchlist-list");
const searchInput = document.getElementById("search-input");

const stars = document.querySelectorAll(".star");
let selectedRating = 0;
let currentMovie = null;

// -------------------------------
// Render Movie List
// -------------------------------
function renderMovieList(filter="") {
    movieList.innerHTML = "";

    movies
    .filter(movie => movie.title.toLowerCase().includes(filter.toLowerCase()))
    .forEach(movie => {
        const li = document.createElement("li");
        li.classList.add("movie-item");
        li.setAttribute("data-movie", movie.title);

        if (movie.poster) {
            const img = document.createElement("img");
            img.src = movie.poster;
            li.appendChild(img);
        }

        li.appendChild(document.createTextNode(movie.title));
        li.addEventListener("click", (e) => selectMovie(movie, e));
        movieList.appendChild(li);
    });
}

// -------------------------------
// Select Movie
// -------------------------------
function selectMovie(movie, event) {
    currentMovie = movie.title;
    document.querySelectorAll(".movie-item").forEach(item => item.classList.remove("selected"));
    event.currentTarget.classList.add("selected");

    movieDescription.innerHTML = "";
    if (movie.poster) {
        const img = document.createElement("img");
        img.src = movie.poster;
        movieDescription.appendChild(img);
    }
    const desc = document.createElement("p");
    desc.textContent = movie.description;
    movieDescription.appendChild(desc);

    deleteMovieBtn.style.display = "inline-block";
    watchlistBtn.style.display = "inline-block";

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
            <button class="edit-btn" data-id="${r.id}">✏️</button>
            <button class="delete-btn" data-id="${r.id}">🗑</button>
        `;
        reviewList.appendChild(li);
    });
    attachReviewButtons(title);
}

function attachReviewButtons(title) {
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.onclick = () => {
            reviews[title] = reviews[title].filter(r => r.id != btn.dataset.id);
            localStorage.setItem("reviews", JSON.stringify(reviews));
            renderReviews(title);
        };
    });
    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.onclick = () => {
            const r = reviews[title].find(r => r.id == btn.dataset.id);
            const newText = prompt("Edit your review:", r.text);
            if (newText && newText.trim() !== "") {
                r.text = newText.trim();
                localStorage.setItem("reviews", JSON.stringify(reviews));
                renderReviews(title);
            }
        };
    });
}

resetBtn.addEventListener("click", () => {
    if (!confirm("Delete ALL reviews?")) return;
    reviews = {};
    localStorage.setItem("reviews", JSON.stringify(reviews));
    reviewList.innerHTML = "";
});

// -------------------------------
// Add Movie
// -------------------------------
addMovieBtn.addEventListener("click", () => {
    const title = newMovieTitle.value.trim();
    const desc = newMovieDescription.value.trim();
    const poster = newMoviePoster.value.trim();
    if (!title || !desc) return alert("Please fill in movie title and description.");
    if (movies.some(m => m.title === title)) return alert("Movie already exists!");
    movies.push({ title, description: desc, poster });
    localStorage.setItem("movies", JSON.stringify(movies));
    renderMovieList();
    newMovieTitle.value = "";
    newMovieDescription.value = "";
    newMoviePoster.value = "";
});

// -------------------------------
// Delete Movie
// -------------------------------
deleteMovieBtn.addEventListener("click", () => {
    if (!currentMovie) return;
    if (!confirm(`Delete "${currentMovie}" and its reviews?`)) return;
    movies = movies.filter(m => m.title !== currentMovie);
    delete reviews[currentMovie];
    localStorage.setItem("movies", JSON.stringify(movies));
    localStorage.setItem("reviews", JSON.stringify(reviews));
    currentMovie = null;
    movieDescription.innerHTML = "Click a movie to view its description.";
    reviewList.innerHTML = "";
    deleteMovieBtn.style.display = "none";
    watchlistBtn.style.display = "none";
    renderMovieList();
});

// -------------------------------
// Watchlist
// -------------------------------
watchlistBtn.addEventListener("click", () => {
    if (!currentMovie) return alert("Select a movie first.");
    if (!watchlist.includes(currentMovie)) watchlist.push(currentMovie);
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    renderWatchlist();
});

function renderWatchlist() {
    watchlistList.innerHTML = "";
    watchlist.forEach(title => {
        const li = document.createElement("li");
        li.textContent = title;
        watchlistList.appendChild(li);
    });
}

renderWatchlist();

// -------------------------------
// Search
// -------------------------------
searchInput.addEventListener("input", () => {
    renderMovieList(searchInput.value);
});

// -------------------------------
// Initial Render
// -------------------------------
renderMovieList();
