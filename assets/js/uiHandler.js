import { IMAGE_CONFIG } from "./constants.js";
import { getMovieData } from "./movieHandler.js";
import { URLS } from "./constants.js";
import { MOVIE_DATA } from "./movieHandler.js";

export const createMovieTile = (movie, type = "tile") => {
    const movieElement = document.createElement('div');
    movieElement.dataset.id = movie.id;
    movieElement.className = 'movie';

    const titleElement = document.createElement('h2');
    titleElement.textContent = movie.title;

    const posterElement = document.createElement('img');
    posterElement.className = type === "tile" ? 'movie__image' : type === "large" ? "movie__large" : "";
    const posterPath = movie.poster_path ? `${IMAGE_CONFIG.BASE_URL}${IMAGE_CONFIG.POSTER_SIZE}${movie.poster_path}` : "./assets/icons/bookmark.svg";
    posterElement.src = posterPath;
    posterElement.alt = `${movie.title} Poster`;

    if (posterPath === "./assets/icons/bookmark.svg") {
        return undefined;
    }

    movieElement.appendChild(posterElement);

    return movieElement;
};

export const processNowPlaying = (movies) => {
    const CONTAINER = document.getElementById('top-ten');
    movies.forEach(movie => {
        const movieElement = createMovieTile(movie, "large")
        CONTAINER.appendChild(movieElement);
    });
};

export function setMovieData(data) {
    document.getElementById('movie-hero').style.backgroundImage = `url(${IMAGE_CONFIG.BASE_URL}${IMAGE_CONFIG.BACKDROP_SIZE}${data.backdrop_path})`;;
    document.getElementById('movie-detail-poster').src = `${IMAGE_CONFIG.BASE_URL}${IMAGE_CONFIG.POSTER_SIZE}${data.poster_path}`
    document.getElementById('movie-title').innerText = data.title;
    document.getElementById('movie-year').innerText = data.release_date.substring(0, 4);
    document.getElementById('movie-time').innerText = `${data.runtime} Minutes`;
    document.getElementById('movie-genre').innerText = data.genres[0].name;
    document.getElementById('film-rating').innerText = data.vote_average.toFixed(2);
    document.getElementById('movie-data').innerText = data.overview;
}

export async function setContainerMovies(list = 'now_playing') {
    if (list === "now_playing") {
        const movieData = await getMovieData(URLS.NOW_PLAYING);
        processMovieResults(movieData);
    } else if (list === "upcoming") {
        const movieData = await getMovieData(URLS.UPCOMING);
        processMovieResults(movieData);
    } else if (list === "top_rated") {
        const movieData = await getMovieData(URLS.TOP_RATED);
        processMovieResults(movieData);
    } else if (list === "popular") {
        const movieData = await getMovieData(URLS.POPULAR_MOVIES);
        processMovieResults(movieData);
    }
}

export const createCastCard = async (cast) => {
    console.log(cast);
    let castCard = document.createElement('div');
    castCard.className = 'cast-card';

    const cardImage = document.createElement('img');
    if (cast.profile_path) {
        cardImage.src = `${IMAGE_CONFIG.BASE_URL}${IMAGE_CONFIG.POSTER_SIZE}${cast.profile_path}`;
    } else {
        cardImage.src = "./assets/icons/avatar.svg";
    }

    const cardTitle = document.createElement('p');
    cardTitle.innerText = cast.name;

    castCard.appendChild(cardImage);
    castCard.appendChild(cardTitle);
    document.getElementById('movie-data').appendChild(castCard);

};

export const createReviewCard = async (reviewData) => {
    let reviewCard = document.createElement('div');
    reviewCard.className = 'review-card';

    const author = reviewData.author;
    const content = reviewData.content;

    const imageDisplay = document.createElement('img');
    imageDisplay.src = './assets/icons/avatar.svg'

    const authorDisplay = document.createElement('h2');
    authorDisplay.innerText = author;

    const contentDisplay = document.createElement('p');
    contentDisplay.innerText = content;

    reviewCard.appendChild(imageDisplay);
    reviewCard.appendChild(authorDisplay);
    reviewCard.appendChild(contentDisplay);
    document.getElementById('movie-data').appendChild(reviewCard);

};

export const processMovieResults = (movies) => {
    const CONTAINER = document.getElementById('now-playing');

    movies.results.forEach(movie => {
        const movieElement = createMovieTile(movie, "tile");
        if (movieElement) {
            CONTAINER.appendChild(movieElement);
        }
    });
};

export const processSearchResults = (results) => {
    console.log('Search Results:', results);
};

// Setup UI slider (now playing)
const slider = document.querySelector('.top-ten');
let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener('mousedown', (e) => {
  isDown = true;
  slider.classList.add('active');
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
});

slider.addEventListener('mouseleave', () => {
  isDown = false;
  slider.classList.remove('active');
});

slider.addEventListener('mouseup', () => {
  isDown = false;
  slider.classList.remove('active');
});

slider.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - slider.offsetLeft;
  const walk = (x - startX) * 1;
  slider.scrollLeft = scrollLeft - walk;
});


document.addEventListener('DOMContentLoaded', async function() {
    document.addEventListener('scroll', function(e) {
        let documentHeight = document.body.scrollHeight;
        let currentScroll = window.scrollY + window.innerHeight;
        let modifier = 200;
        if(currentScroll + modifier > documentHeight) {
            if (MOVIE_DATA.CURRENT_PAGE < MOVIE_DATA.TOTAL_PAGES) {
                MOVIE_DATA.CURRENT_PAGE++;
                 setContainerMovies('now_playing');
              }
        }
    })
})
