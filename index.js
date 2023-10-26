const API_KEY = '3264a131020d738a0896d5230d569d50'; // Replace with your TMDb API key
const SEARCH_URL = `https://api.themoviedb.org/3/search/movie`;
const POPULAR_MOVIES_URL = `https://api.themoviedb.org/3/movie/popular`;
const NOW_PLAYING_URL = 'https://api.themoviedb.org/3/movie/now_playing?language=en-US';
const TRENDING_URL = 'https://api.themoviedb.org/3/trending/movie/day?language=en-US';
const TOP_RATED_URL = 'https://api.themoviedb.org/3/movie/top_rated?language=en-US';
const UPCOMING_MOVIES_URL = 'https://api.themoviedb.org/3/movie/upcoming?language=en-US';
const MOVIE_DATA_URL = 'https://api.themoviedb.org/3/movie/';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';
let SELECTED_MOVIE = -1;

const BACKDROP_SIZE = 'w300';
const POSTER_SIZE = 'w300';

const BUTTON_UPCOMING = document.getElementById('button-upcoming');
const BUTTON_NOW_PLAYING = document.getElementById('button-now-playing');
const BUTTON_TOP_RATED = document.getElementById('button-top-rated');
const BUTTON_POPULAR = document.getElementById('button-popular');

const BUTTON_REVIEWS = document.getElementById('button-movie-reviews');
BUTTON_REVIEWS.addEventListener('click', () => {
    document.getElementById('movie-data').innerHTML = "";
    getMovieReviews();
});

const nowPlayingSection = document.getElementById('app-container');


document.addEventListener('DOMContentLoaded', async function(e) {
    document.addEventListener('scroll', function(e) {
        let documentHeight = document.body.scrollHeight;
        let currentScroll = window.scrollY + window.innerHeight;
        let modifier = 200;
        if(currentScroll + modifier > documentHeight) {
            if (currentPage < totalPages) {
                currentPage++;
                 setContainerMovies('now_playing');
              }
        }
    })
})


nowPlayingSection.addEventListener('scroll', async () => {
  if (nowPlayingSection.offsetHeight + nowPlayingSection.scrollTop <= nowPlayingSection.scrollHeight) {
    if (currentPage < totalPages) {
      currentPage++;
      await setContainerMovies('now_playing');
    }
  }
});

/* Buttons */
const SEARCH_BUTTON = document.getElementById('search-button');
SEARCH_BUTTON.addEventListener('click', searchClick);

/* Page Constants */
let currentPage = 1;
let totalPages = 0;

/* Authorization */
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMjY0YTEzMTAyMGQ3MzhhMDg5NmQ1MjMwZDU2OWQ1MCIsInN1YiI6IjYzZDIwOTlkOWY1MWFmMDA3YWY4OTA1YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4uU7Il-XPhPjD_Iqxx3TqXwIBiYURoc6YBM4PhfQoIU'
    }
};

document.getElementById('button-back-movie').addEventListener('click', () => {
    document.getElementById('movie-details').classList.add('hidden');
    document.getElementById('app-container').classList.remove('hidden');
});

const NOW_PLAYING_CONTAINER = document.getElementById('now-playing');
NOW_PLAYING_CONTAINER.addEventListener('click', async function(event) {
    const movieElement = event.target.closest('.movie');

    if (movieElement) {
        document.getElementById('movie-details').classList.remove('hidden');
        document.getElementById('app-container').classList.add('hidden');
        SELECTED_MOVIE = movieElement.dataset.id;

        const movieData = await getIndividualMovie(movieElement.dataset.id);
        console.log(movieData);
        setMovieData(movieData);
    }
});

function setMovieData(data) {
    document.getElementById('movie-hero').style.backgroundImage = `url(${IMAGE_BASE_URL}${BACKDROP_SIZE}${data.backdrop_path})`;;
    document.getElementById('movie-detail-poster').src = `${IMAGE_BASE_URL}${POSTER_SIZE}${data.poster_path}`
    document.getElementById('movie-title').innerText = data.title;
    document.getElementById('movie-year').innerText = data.release_date.substring(0, 4);
    document.getElementById('movie-time').innerText = `${data.runtime} Minutes`;
    document.getElementById('movie-genre').innerText = data.genres[0].name;
    document.getElementById('film-rating').innerText = data.vote_average.toFixed(2);
    document.getElementById('movie-data').innerText = data.overview;
}

const clearAllButtons = () => {
    BUTTON_NOW_PLAYING.classList.remove('cat-button--selected');
    BUTTON_UPCOMING.classList.remove('cat-button--selected');
    BUTTON_TOP_RATED.classList.remove('cat-button--selected');
    BUTTON_POPULAR.classList.remove('cat-button--selected');
};

BUTTON_NOW_PLAYING.addEventListener('click', async () => {
    document.getElementById('now-playing').innerHTML = "";
    clearAllButtons();
    BUTTON_NOW_PLAYING.classList.add('cat-button--selected');
    currentPage = 1;
    await setContainerMovies('now_playing');
});

BUTTON_UPCOMING.addEventListener('click', async () => {
    document.getElementById('now-playing').innerHTML = "";
    clearAllButtons();
    BUTTON_UPCOMING.classList.add('cat-button--selected');
    currentPage = 1;
    await setContainerMovies('upcoming');
});

BUTTON_TOP_RATED.addEventListener('click', async () => {
    document.getElementById('now-playing').innerHTML = "";
    clearAllButtons();
    BUTTON_TOP_RATED.classList.add('cat-button--selected');
    currentPage = 1;
    await setContainerMovies('top_rated');
});

BUTTON_POPULAR.addEventListener('click', async () => {
    document.getElementById('now-playing').innerHTML = "";
    clearAllButtons();
    BUTTON_POPULAR.classList.add('cat-button--selected');
    currentPage = 1;
    await setContainerMovies('popular');
});

async function entryPoint() {
    //await getTrendingMovies();
    await getNowPlaying();
    await setContainerMovies('now_playing');
}

async function setContainerMovies(list = 'now_playing') {
    if (list === "now_playing") {
        const movieData = await getMovieData(NOW_PLAYING_URL);
        processMovieResults(movieData);
    } else if (list === "upcoming") {
        const movieData = await getMovieData(UPCOMING_MOVIES_URL);
        processMovieResults(movieData);
    } else if (list === "top_rated") {
        const movieData = await getMovieData(TOP_RATED_URL);
        processMovieResults(movieData);
    } else if (list === "popular") {
        const movieData = await getMovieData(POPULAR_MOVIES_URL);
        processMovieResults(movieData);
    }
}

async function getMovieData(URL) {
    try {
        const response = await fetch(`${URL}&page=${currentPage}`, options);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.results) {
            totalPages = data.total_pages;
            return data;
        }
    } catch (error) {
        console.log('Error fetching data: ', error);
    }
}

async function getIndividualMovie(ID) {
    try {
        const response = await fetch(`${MOVIE_DATA_URL}${ID}?language=en-US`, options);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data) {
            return data;
        }
    } catch (error) {
        console.log('Error fetching data: ', error);
    }
}

async function searchClick(e) {
    const SEARCH_INPUT = document.getElementById('app-search-input');
    if (e) {
        e.preventDefault();
    }
    const searchTitle = SEARCH_INPUT.value;
    const searchResults = await getSearchData(searchTitle);
    SEARCH_INPUT.value = "";
    if (searchResults) {
        processSearchResults(searchResults);
    }
}

const getMovieReviews = async () => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${SELECTED_MOVIE}/reviews?language=en-US&page=1`, options);
        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.results) {
            data.results.forEach(review => {
                console.log(review);
                createReviewCard(review);
            });
        }
    } catch (error) {
        console.log('Error fetching search data: ', error);
    }
};

const getNowPlaying = async () => {
    try {
        const response = await fetch(NOW_PLAYING_URL, options);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data && data.results) {
            processNowPlaying(data.results);
        }
    } catch (error) {
        console.error('Error fetching search data: ', error);
    }
};

const createReviewCard = async (reviewData) => {

        console.log(reviewData);

        let reviewCard = document.createElement('div');
        const author = reviewData.author;
        const content = reviewData.content;

        const authorDisplay = document.createElement('h2');
        authorDisplay.innerText = author;

        const contentDisplay = document.createElement('p');
        contentDisplay.innerText = content;

        reviewCard.appendChild(authorDisplay);
        reviewCard.appendChild(contentDisplay);
        document.getElementById('movie-data').appendChild(reviewCard);

};

const getSearchData = async (title, page = 1) => {
    try {
        const response = await fetch(`${SEARCH_URL}?query=${title}&language=en-US&page=${page}`, options);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data && data.results) {
            currentPage = data.page;
            totalPages = data.total_pages;
            return data.results;
        } else {
            console.log('No results found');
        }
    } catch (error) {
        console.error('Error fetching search data:', error);
    }
};

const processSearchResults = (results) => {
    console.log('Search Results:', results);
};

const processNowPlaying = (movies) => {
    const CONTAINER = document.getElementById('top-ten');
    movies.results.forEach(movie => {
        const movieElement = createMovieTile(movie, "large")
        CONTAINER.appendChild(movieElement);
    });
};

const processMovieResults = (movies) => {
    const CONTAINER = document.getElementById('now-playing');

    movies.results.forEach(movie => {
        const movieElement = createMovieTile(movie, "tile");
        if (movieElement) {
            CONTAINER.appendChild(movieElement);
        }
    });
};

const createMovieTile = (movie, type = "tile") => {
    const movieElement = document.createElement('div');
    movieElement.dataset.id = movie.id;
    movieElement.className = 'movie';

    const titleElement = document.createElement('h2');
    titleElement.textContent = movie.title;

    const posterElement = document.createElement('img');
    posterElement.className = type === "tile" ? 'movie__image' : type === "large" ? "movie__large" : "";
    const posterPath = movie.poster_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}` : "./assets/icons/bookmark.svg";
    posterElement.src = posterPath;
    posterElement.alt = `${movie.title} Poster`;

    if (posterPath === "./assets/icons/bookmark.svg") {
        return undefined;
    }

    movieElement.appendChild(posterElement);

    return movieElement;
};

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


entryPoint();
