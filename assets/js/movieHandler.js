import { options } from './config.js';
import { URLS } from './constants.js';
import { processNowPlaying } from './uiHandler.js';

export const MOVIE_DATA = {
    SELECTED_MOVIE: -1,
    MOVIE_JSON: {},
    MOVIE_REVIEWS: {},
    MOVIE_CAST: {},
    CURRENT_PAGE: 1,
    TOTAL_PAGES: 0
};

export const getSearchData = async (title, page = 1) => {
    try {
        const response = await fetch(`${URLS.SEARCH_URL}?query=${title}&language=en-US&page=${page}`, options);

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

export async function getMovieData(URL) {
    try {
        const response = await fetch(`${URL}&page=${MOVIE_DATA.CURRENT_PAGE}`, options);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.results) {
            MOVIE_DATA.TOTAL_PAGES = data.total_pages;
            return data;
        }
    } catch (error) {
        console.log('Error fetching data: ', error);
    }
}

export async function getIndividualMovie(ID) {
    try {
        const response = await fetch(`${URLS.MOVIE_DATA}${ID}?language=en-US`, options);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data) {
            MOVIE_DATA.MOVIE_JSON = data;
            return data;
        }
    } catch (error) {
        console.log('Error fetching data: ', error);
    }
}

export const getMovieReviews = async () => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${MOVIE_DATA.SELECTED_MOVIE}/reviews?language=en-US&page=1`, options);
        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.results) {
            MOVIE_DATA.MOVIE_REVIEWS = data.results;
        }
    } catch (error) {
        console.log('Error fetching search data: ', error);
    }
};

export const getMovieCast = async() => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${MOVIE_DATA.SELECTED_MOVIE}/credits`, options);
        const data = await response.json();
        MOVIE_DATA.MOVIE_CAST = data.cast;
    } catch (error) {
        console.error('Error fetching search data: ', error);
    }
};

export const getNowPlaying = async () => {
    try {
        const response = await fetch(URLS.NOW_PLAYING, options);

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
