import { ELEMENT_IDS } from "./assets/js/constants.js";
import { MOVIE_DATA, getSearchData, getIndividualMovie, getMovieCast, getMovieReviews, getNowPlaying } from "./assets/js/movieHandler.js";
import { processSearchResults, createReviewCard, setMovieData, setContainerMovies, createCastCard, createBookmarkCard } from "./assets/js/uiHandler.js";
import { bookmarks } from "./assets/js/bookmarks.js";

const buttonHandlers = {
    [ELEMENT_IDS.BUTTON_HOME]: handleHomeClick,
    [ELEMENT_IDS.BUTTON_UPCOMING]: handleUpcomingClick,
    [ELEMENT_IDS.BUTTON_NOW_PLAYING]: handleNowPlayingClick,
    [ELEMENT_IDS.BUTTON_TOP_RATED]: handleTopRatedClick,
    [ELEMENT_IDS.BUTTON_POPULAR]: handlePopularClick,
    [ELEMENT_IDS.BUTTON_ABOUT_MOVIE]: handleAboutMovieClick,
    [ELEMENT_IDS.BUTTON_MOVIE_REVIEWS]: handleReviewsClick,
    [ELEMENT_IDS.BACK_BUTTON]: handleBackButtonClick,
    [ELEMENT_IDS.BUTTON_BOOKMARK]: handleBookmarkClick,
    [ELEMENT_IDS.BUTTON_BOOKMARKS_BACK]: handleBookmarkBackClick,
    [ELEMENT_IDS.BUTTON_BACK_SEARCH]: handleButtonBackSearch,
    [ELEMENT_IDS.BUTTON_BOOKMARKS_VIEW]: handleBookmarksViewClick,
    [ELEMENT_IDS.SEARCH_BUTTON]: handleSearchButtonClick,
    [ELEMENT_IDS.BUTTON_MOVIE_CAST]: handleCastButtonClick
}

async function handleSearchButtonClick(e) {
    const SEARCH_INPUT = document.getElementById('app-search-input');
    if (e) {
        e.preventDefault();
    }

    SEARCH_RESULTS_DATA.innerHTML = "";

    const searchTitle = SEARCH_INPUT.value;
    const searchResults = await getSearchData(searchTitle);
    SEARCH_INPUT.value = "";
    if (searchResults) {
        switchDisplay('search');
        processSearchResults(searchResults);
    }
}

function addEventListeners() {
    Object.entries(buttonHandlers).forEach(([id, handler]) => {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', handler);
        }
    });
}

function handleBookmarksViewClick(e) {
    switchDisplay('bookmark');
}

function handleHomeClick(e) {
    switchDisplay();
}

async function handleUpcomingClick(e) {
    document.getElementById('now-playing').innerHTML = "";
    clearAllButtons();
    document.getElementById(ELEMENT_IDS.BUTTON_UPCOMING).classList.add('cat-button--selected');
    MOVIE_DATA.CURRENT_PAGE  = 1;
    await setContainerMovies('upcoming');
}

async function handleNowPlayingClick(e) {
    document.getElementById('now-playing').innerHTML = "";
    clearAllButtons();
    document.getElementById(ELEMENT_IDS.BUTTON_NOW_PLAYING).classList.add('cat-button--selected');
    MOVIE_DATA.CURRENT_PAGE = 1;
    await setContainerMovies('now_playing');
}

async function handleTopRatedClick(e) {
    document.getElementById('now-playing').innerHTML = "";
    clearAllButtons();
    document.getElementById(ELEMENT_IDS.BUTTON_TOP_RATED).classList.add('cat-button--selected');
    MOVIE_DATA.CURRENT_PAGE  = 1;
    await setContainerMovies('top_rated');
}

async function handlePopularClick(e) {
    document.getElementById('now-playing').innerHTML = "";
    clearAllButtons();
    document.getElementById(ELEMENT_IDS.BUTTON_POPULAR).classList.add('cat-button--selected');
    MOVIE_DATA.CURRENT_PAGE  = 1;
    await setContainerMovies('popular');
}

function handleAboutMovieClick(e) {
    clearAllButtons();
    document.getElementById(ELEMENT_IDS.BUTTON_ABOUT_MOVIE).classList.add('cat-button--selected');
    MOVIE_DATA_CONTAINER.innerHTML = "";
    MOVIE_DATA_CONTAINER.innerText = MOVIE_DATA.MOVIE_JSON.overview;
}

function handleReviewsClick(e) {
    clearAllButtons();
    document.getElementById(ELEMENT_IDS.BUTTON_MOVIE_REVIEWS).classList.add('cat-button--selected');
    MOVIE_DATA_CONTAINER.innerHTML = "";

    if (MOVIE_DATA.MOVIE_REVIEWS.length > 0) {
        MOVIE_DATA.MOVIE_REVIEWS.forEach(review => {
            createReviewCard(review);
        });
    } else {
        console.log("NO REVIEWS");
    }
}

function handleCastButtonClick(e) {
    clearAllButtons();
    document.getElementById(ELEMENT_IDS.BUTTON_MOVIE_CAST).classList.add('cat-button--selected');
    MOVIE_DATA_CONTAINER.innerHTML = "";

    if (MOVIE_DATA.MOVIE_CAST.length > 0) {
        MOVIE_DATA.MOVIE_CAST.forEach(cast => {
            createCastCard(cast);
        });
    }
}

function handleBackButtonClick(e) {
    switchDisplay();
}

function handleBookmarkClick(e) {
    bookmarks.movies.push(MOVIE_DATA.MOVIE_JSON);
    createBookmarkCard(MOVIE_DATA.MOVIE_JSON);
    switchDisplay('bookmark');
}

function handleBookmarkBackClick(e) {
    switchDisplay();
}

function handleButtonBackSearch(e) {
    switchDisplay();
}

function switchDisplay(section = "home") {
    MOVIE_DETAILS.classList.add('hidden');
    BOOKMARK_CONTAINER.classList.add('hidden');
    SEARCH_CONTAINER.classList.add('hidden');
    APPLICATION_CONTAINER.classList.add('hidden');

    switch (section) {
        case "home":
            APPLICATION_CONTAINER.classList.remove('hidden');
            break;
        case "details":
            MOVIE_DETAILS.classList.remove('hidden');
            break;
        case "search":
            SEARCH_CONTAINER.classList.remove('hidden');
            break;
        case "bookmark":
            BOOKMARK_CONTAINER.classList.remove('hidden');
            break;
    }
}

const NOW_PLAYING_CONTAINER = document.getElementById(ELEMENT_IDS.NOW_PLAYING_CONTAINER);
const MOVIE_DATA_CONTAINER = document.getElementById(ELEMENT_IDS.MOVIE_DATA_CONTAINER);
const APPLICATION_CONTAINER = document.getElementById(ELEMENT_IDS.APPLICATION_CONTAINER);
const MOVIE_DETAILS = document.getElementById(ELEMENT_IDS.MOVIE_DETAILS);
const SEARCH_CONTAINER = document.getElementById(ELEMENT_IDS.SEARCH_RESULTS_CONTAINER);
const SEARCH_RESULTS_DATA = document.getElementById(ELEMENT_IDS.SEARCH_RESULTS_DATA);
const BOOKMARK_CONTAINER = document.getElementById(ELEMENT_IDS.BOOKMARKS_CONTAINER)


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
    document.getElementById(ELEMENT_IDS.BUTTON_NOW_PLAYING).classList.remove('cat-button--selected');
    document.getElementById(ELEMENT_IDS.BUTTON_UPCOMING).classList.remove('cat-button--selected');
    document.getElementById(ELEMENT_IDS.BUTTON_TOP_RATED).classList.remove('cat-button--selected');
    document.getElementById(ELEMENT_IDS.BUTTON_POPULAR).classList.remove('cat-button--selected');
    document.getElementById(ELEMENT_IDS.BUTTON_MOVIE_REVIEWS).classList.remove('cat-button--selected');
    document.getElementById(ELEMENT_IDS.BUTTON_ABOUT_MOVIE).classList.remove('cat-button--selected');
    document.getElementById(ELEMENT_IDS.BUTTON_MOVIE_CAST).classList.remove('cat-button--selected');
};

async function entryPoint() {
    //await getTrendingMovies();
    addEventListeners();
    await getNowPlaying();
    await setContainerMovies('now_playing');
}

entryPoint();
