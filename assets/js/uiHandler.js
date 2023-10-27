import { ELEMENT_IDS, IMAGE_CONFIG } from "./constants.js";
import { getMovieData } from "./movieHandler.js";
import { URLS } from "./constants.js";
import { MOVIE_DATA } from "./movieHandler.js";
import { getIndividualMovie, getMovieReviews, getMovieCast } from "./movieHandler.js";

const APPLICATION_CONTAINER = document.getElementById(ELEMENT_IDS.APPLICATION_CONTAINER);
const MOVIE_DETAILS = document.getElementById(ELEMENT_IDS.MOVIE_DETAILS);
const SEARCH_CONTAINER = document.getElementById(ELEMENT_IDS.SEARCH_RESULTS_CONTAINER);


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
    let castCard = document.createElement('div');
    castCard.className = 'cast-card';

    const cardImage = document.createElement('img');
    if (cast.profile_path) {
        cardImage.src = `${IMAGE_CONFIG.BASE_URL}${IMAGE_CONFIG.POSTER_SIZE}${cast.profile_path}`;
    } else {
        cardImage.src = "./assets/icons/avatar.svg";
    }

    const cardTitle = document.createElement('p');
    cardTitle.innerText = cast.name.toUpperCase();

    const cardTitleCharacter = document.createElement('p');
    cardTitleCharacter.classList.add('character');
    cardTitleCharacter.innerText = cast.character;

    castCard.appendChild(cardImage);
    castCard.appendChild(cardTitle);
    castCard.appendChild(cardTitleCharacter);
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
    results.forEach(movie => {
        createSearchCard(movie);
    });
};

export const createBookmarkCard = (movie) => {
    console.log(movie);
    const searchCard = document.createElement('div');
    searchCard.className = 'search-card';

    const searchCardImageContainer = document.createElement('div');
    const searchCardImage = document.createElement('img');

    const posterPath = movie.poster_path ? `${IMAGE_CONFIG.BASE_URL}${IMAGE_CONFIG.POSTER_SIZE}${movie.poster_path}` : "./assets/icons/bookmark.svg";
    searchCardImage.src = posterPath;
    searchCardImage.alt = `${movie.title} Poster`;
    searchCardImageContainer.appendChild(searchCardImage);

    const movieInformation = document.createElement('div');
    movieInformation.className = 'movie-information';

    const movieTitle = document.createElement('h2');
    movieTitle.classList.add('h2');
    movieTitle.innerText = movie.title;

    const ratingContainer = document.createElement('div');
    ratingContainer.className = 'general-row';

    const starImage = document.createElement('img');
    starImage.src = './assets/icons/star.svg';
    ratingContainer.appendChild(starImage);

    const ratingText = document.createElement('p');
    ratingText.className = 'accent-text';
    ratingText.innerText = movie.vote_average.toFixed(2);
    ratingContainer.appendChild(ratingText);

    const releaseYearContianer = document.createElement('div');
    releaseYearContianer.className = 'general-row';

    const calendarImage = document.createElement('img');
    calendarImage.src = './assets/icons/ticket.svg';
    releaseYearContianer.appendChild(calendarImage);

    const releaseYearText = document.createElement('p');
    releaseYearText.innerText = movie.release_date.substring(0, 4);
    releaseYearContianer.appendChild(releaseYearText);

    movieInformation.appendChild(movieTitle);
    movieInformation.appendChild(ratingContainer);
    movieInformation.appendChild(releaseYearContianer);

    searchCard.appendChild(searchCardImageContainer);
    searchCard.appendChild(movieInformation);

    searchCard.dataset.id = movie.id;

    searchCard.addEventListener('click', async () => {
        MOVIE_DATA.SELECTED_MOVIE = movie.id;
        SEARCH_CONTAINER.classList.add('hidden');
        MOVIE_DETAILS.classList.remove('hidden');
        APPLICATION_CONTAINER.classList.add('hidden');

        const movieData = await getIndividualMovie(movie.id);
        await getMovieReviews();
        await getMovieCast();
        setMovieData(movieData);
    });

    document.getElementById(ELEMENT_IDS.BOOKMARKS_DATA_CONTAINER).appendChild(searchCard);
};

export const createSearchCard = (movie) => {
    console.log(movie);
    const searchCard = document.createElement('div');
    searchCard.className = 'search-card';

    const searchCardImageContainer = document.createElement('div');
    const searchCardImage = document.createElement('img');

    const posterPath = movie.poster_path ? `${IMAGE_CONFIG.BASE_URL}${IMAGE_CONFIG.POSTER_SIZE}${movie.poster_path}` : "./assets/icons/bookmark.svg";
    searchCardImage.src = posterPath;
    searchCardImage.alt = `${movie.title} Poster`;
    searchCardImageContainer.appendChild(searchCardImage);

    const movieInformation = document.createElement('div');
    movieInformation.className = 'movie-information';

    const movieTitle = document.createElement('h2');
    movieTitle.classList.add('h2');
    movieTitle.innerText = movie.title;

    const ratingContainer = document.createElement('div');
    ratingContainer.className = 'general-row';

    const starImage = document.createElement('img');
    starImage.src = './assets/icons/star.svg';
    ratingContainer.appendChild(starImage);

    const ratingText = document.createElement('p');
    ratingText.className = 'accent-text';
    ratingText.innerText = movie.vote_average.toFixed(2);
    ratingContainer.appendChild(ratingText);

    const releaseYearContianer = document.createElement('div');
    releaseYearContianer.className = 'general-row';

    const calendarImage = document.createElement('img');
    calendarImage.src = './assets/icons/ticket.svg';
    releaseYearContianer.appendChild(calendarImage);

    const releaseYearText = document.createElement('p');
    releaseYearText.innerText = movie.release_date.substring(0, 4);
    releaseYearContianer.appendChild(releaseYearText);

    movieInformation.appendChild(movieTitle);
    movieInformation.appendChild(ratingContainer);
    movieInformation.appendChild(releaseYearContianer);

    searchCard.appendChild(searchCardImageContainer);
    searchCard.appendChild(movieInformation);

    searchCard.dataset.id = movie.id;

    searchCard.addEventListener('click', async () => {
        MOVIE_DATA.SELECTED_MOVIE = movie.id;
        SEARCH_CONTAINER.classList.add('hidden');
        MOVIE_DETAILS.classList.remove('hidden');
        APPLICATION_CONTAINER.classList.add('hidden');

        const movieData = await getIndividualMovie(movie.id);
        await getMovieReviews();
        await getMovieCast();
        setMovieData(movieData);
    });

    document.getElementById(ELEMENT_IDS.SEARCH_RESULTS_DATA).appendChild(searchCard);
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
