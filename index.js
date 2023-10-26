const API_KEY = '3264a131020d738a0896d5230d569d50'; // Replace with your TMDb API key
const SEARCH_URL = `https://api.themoviedb.org/3/search/movie`;
const POPULAR_MOVIES_URL = `https://api.themoviedb.org/3/movie/popular`;
const NOW_PLAYING_URL = 'https://api.themoviedb.org/3/movie/now_playing?language=en-US';
const TRENDING_URL = 'https://api.themoviedb.org/3/trending/movie/day?language=en-US';
const TOP_RATED_URL = 'https://api.themoviedb.org/3/movie/top_rated?language=en-US';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

const BACKDROP_SIZE = 'original';
const POSTER_SIZE = 'w342';

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
    console.log("HI");
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


async function entryPoint() {
    //await getTrendingMovies();
    await getNowPlaying();
    await setContainerMovies('top_rated');
}

async function setContainerMovies(list = 'now_playing') {
    if (list === "now_playing") {
        const movieData = await getMovieData(NOW_PLAYING_URL);
        processMovieResults(movieData);
    } else if (list === "upcoming") {

    } else if (list === "top_rated") {
        const movieData = await getMovieData(TOP_RATED_URL);
        processMovieResults(movieData);
    } else if (list === "popular") {

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

const getNowPlaying = async () => {
    try {
        const response = await fetch(NOW_PLAYING_URL, options);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data && data.results) {
            processNowPlaying(data);
        }
    } catch (error) {
        console.error('Error fetching search data: ', error);
    }
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
        CONTAINER.appendChild(movieElement);
    });
};

const createMovieTile = (movie, type = "tile") => {
    const movieElement = document.createElement('div');
    movieElement.className = 'movie';

    const titleElement = document.createElement('h2');
    titleElement.textContent = movie.title;

    const posterElement = document.createElement('img');
    posterElement.className = type === "tile" ? 'movie__image' : type === "large" ? "movie__large" : "";
    posterElement.src = `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}`;
    posterElement.alt = `${movie.title} Poster`;
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
