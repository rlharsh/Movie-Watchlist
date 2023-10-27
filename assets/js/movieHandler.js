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

const fetchData = async (url, options) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const getSearchData = async (title, page = 1) => {
  const data = await fetchData(`${URLS.SEARCH_URL}?query=${title}&language=en-US&page=${page}`, options);
  if (data && data.results) {
    return data.results;
  } else {
    console.log('No results found');
  }
};

export const getMovieData = async (URL) => {
  const data = await fetchData(`${URL}&page=${MOVIE_DATA.CURRENT_PAGE}`, options);
  if (data && data.results) {
    MOVIE_DATA.TOTAL_PAGES = data.total_pages;
    return data;
  }
};

export const getIndividualMovie = async (ID) => {
  const data = await fetchData(`${URLS.MOVIE_DATA}${ID}?language=en-US`, options);
  if (data) {
    MOVIE_DATA.MOVIE_JSON = data;
    return data;
  }
};

export const getMovieReviews = async () => {
  const data = await fetchData(`${URLS.MOVIE_DATA}${MOVIE_DATA.SELECTED_MOVIE}/reviews?language=en-US&page=1`, options);
  if (data && data.results) {
    MOVIE_DATA.MOVIE_REVIEWS = data.results;
  }
};

export const getMovieCast = async () => {
  const data = await fetchData(`${URLS.MOVIE_DATA}${MOVIE_DATA.SELECTED_MOVIE}/credits`, options);
  if (data && data.cast) {
    MOVIE_DATA.MOVIE_CAST = data.cast;
  }
};

export const getNowPlaying = async () => {
  const data = await fetchData(URLS.NOW_PLAYING, options);
  if (data && data.results) {
    processNowPlaying(data.results);
  }
};
