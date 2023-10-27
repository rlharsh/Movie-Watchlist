import { ELEMENT_IDS } from "./assets/js/constants.js";
import { MOVIE_DATA, getSearchData, getIndividualMovie, getMovieCast, getMovieReviews, getNowPlaying } from "./assets/js/movieHandler.js";
import { processSearchResults, createReviewCard, setMovieData, setContainerMovies, createCastCard } from "./assets/js/uiHandler.js";
import { bookmarks } from "./assets/js/bookmarks.js";

const BUTTON_UPCOMING = document.getElementById(ELEMENT_IDS.BUTTON_UPCOMING);
const BUTTON_NOW_PLAYING = document.getElementById(ELEMENT_IDS.BUTTON_NOW_PLAYING);
const BUTTON_TOP_RATED = document.getElementById(ELEMENT_IDS.BUTTON_TOP_RATED);
const BUTTON_POPULAR = document.getElementById(ELEMENT_IDS.BUTTON_POPULAR);
const BUTTON_ABOUT_MOVIE = document.getElementById(ELEMENT_IDS.BUTTON_ABOUT_MOVIE);
const BUTTON_MOVIE_CAST = document.getElementById(ELEMENT_IDS.BUTTON_CAST);
const NOW_PLAYING_CONTAINER = document.getElementById(ELEMENT_IDS.NOW_PLAYING_CONTAINER);
const BUTTON_REVIEWS = document.getElementById(ELEMENT_IDS.BUTTON_MOVIE_REVIEWS);
const MOVIE_DATA_CONTAINER = document.getElementById(ELEMENT_IDS.MOVIE_DATA_CONTAINER);
const SEARCH_BUTTON = document.getElementById(ELEMENT_IDS.SEARCH_BUTTON);
const BACK_BUTTON = document.getElementById(ELEMENT_IDS.BACK_BUTTON);
const APPLICATION_CONTAINER = document.getElementById(ELEMENT_IDS.APPLICATION_CONTAINER);
const MOVIE_DETAILS = document.getElementById(ELEMENT_IDS.MOVIE_DETAILS);
const SEARCH_CONTAINER = document.getElementById(ELEMENT_IDS.SEARCH_RESULTS_CONTAINER);
const SEARCH_RESULTS_DATA = document.getElementById(ELEMENT_IDS.SEARCH_RESULTS_DATA);
const BUTTON_BOOKMARK = document.getElementById(ELEMENT_IDS.BUTTON_BOOKMARK);

BUTTON_BOOKMARK.addEventListener('click', () => {
    bookmarks.movies.push(MOVIE_DATA.MOVIE_JSON);
    console.log(bookmarks.movies);
});

// Listener for the cast button click.
BUTTON_MOVIE_CAST.addEventListener('click', () => {
    clearAllButtons();
    BUTTON_MOVIE_CAST.classList.add('cat-button--selected');
    MOVIE_DATA_CONTAINER.innerHTML = "";

    if (MOVIE_DATA.MOVIE_CAST.length > 0) {
        MOVIE_DATA.MOVIE_CAST.forEach(cast => {
            createCastCard(cast);
        });
    }
});

// Listener for the review button click.
BUTTON_REVIEWS.addEventListener('click', () => {
    clearAllButtons();
    BUTTON_REVIEWS.classList.add('cat-button--selected');
    MOVIE_DATA_CONTAINER.innerHTML = "";

    if (MOVIE_DATA.MOVIE_REVIEWS.length > 0) {
        MOVIE_DATA.MOVIE_REVIEWS.forEach(review => {
            createReviewCard(review);
        });
    } else {
        console.log("NO REVIEWS");
    }
});

// Listener for the about movie button click.
BUTTON_ABOUT_MOVIE.addEventListener('click', async () => {
    clearAllButtons();
    BUTTON_ABOUT_MOVIE.classList.add('cat-button--selected');
    MOVIE_DATA_CONTAINER.innerHTML = "";
    MOVIE_DATA_CONTAINER.innerText = MOVIE_DATA.MOVIE_JSON.overview;
});

// Listener for the search button click.
SEARCH_BUTTON.addEventListener('click', searchClick);

// Listener for the back button click.
BACK_BUTTON.addEventListener('click', () => {
    MOVIE_DETAILS.classList.add('hidden');
    APPLICATION_CONTAINER.classList.remove('hidden');
});

// Listener for the movie tile click
NOW_PLAYING_CONTAINER.addEventListener('click', async function(event) {
    const movieElement = event.target.closest('.movie');

    if (movieElement) {
        MOVIE_DETAILS.classList.remove('hidden');
        APPLICATION_CONTAINER.classList.add('hidden');
        MOVIE_DATA.SELECTED_MOVIE = movieElement.dataset.id;

        const movieData = await getIndividualMovie(movieElement.dataset.id);
        await getMovieReviews();
        await getMovieCast();
        setMovieData(movieData);
    }
});

// Clear all button highlighting.
const clearAllButtons = () => {
    BUTTON_NOW_PLAYING.classList.remove('cat-button--selected');
    BUTTON_UPCOMING.classList.remove('cat-button--selected');
    BUTTON_TOP_RATED.classList.remove('cat-button--selected');
    BUTTON_POPULAR.classList.remove('cat-button--selected');
    BUTTON_REVIEWS.classList.remove('cat-button--selected');
    BUTTON_ABOUT_MOVIE.classList.remove('cat-button--selected');
    BUTTON_MOVIE_CAST.classList.remove('cat-button--selected');
};

// Listener for the now playing button click.
BUTTON_NOW_PLAYING.addEventListener('click', async () => {
    document.getElementById('now-playing').innerHTML = "";
    clearAllButtons();
    BUTTON_NOW_PLAYING.classList.add('cat-button--selected');
    MOVIE_DATA.CURRENT_PAGE = 1;
    await setContainerMovies('now_playing');
});

// Listener for the upcoming button click.
BUTTON_UPCOMING.addEventListener('click', async () => {
    document.getElementById('now-playing').innerHTML = "";
    clearAllButtons();
    BUTTON_UPCOMING.classList.add('cat-button--selected');
    MOVIE_DATA.CURRENT_PAGE  = 1;
    await setContainerMovies('upcoming');
});

// Listener for the top rated button click.
BUTTON_TOP_RATED.addEventListener('click', async () => {
    document.getElementById('now-playing').innerHTML = "";
    clearAllButtons();
    BUTTON_TOP_RATED.classList.add('cat-button--selected');
    MOVIE_DATA.CURRENT_PAGE  = 1;
    await setContainerMovies('top_rated');
});

// Listener for the popular button click.
BUTTON_POPULAR.addEventListener('click', async () => {
    document.getElementById('now-playing').innerHTML = "";
    clearAllButtons();
    BUTTON_POPULAR.classList.add('cat-button--selected');
    MOVIE_DATA.CURRENT_PAGE  = 1;
    await setContainerMovies('popular');
});

async function entryPoint() {
    //await getTrendingMovies();
    await getNowPlaying();
    await setContainerMovies('now_playing');
}

// Listener for the search button click.
async function searchClick(e) {
    const SEARCH_INPUT = document.getElementById('app-search-input');
    if (e) {
        e.preventDefault();
    }

    SEARCH_RESULTS_DATA.innerHTML = "";

    const searchTitle = SEARCH_INPUT.value;
    const searchResults = await getSearchData(searchTitle);
    SEARCH_INPUT.value = "";
    if (searchResults) {
        SEARCH_CONTAINER.classList.remove('hidden');
        APPLICATION_CONTAINER.classList.add('hidden');
        processSearchResults(searchResults);
    }
}

entryPoint();
