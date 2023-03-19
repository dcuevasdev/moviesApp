const api = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  params: {
    api_key: API_KEY,
  },
});

const API_TRENDING_PREVIEW = `trending/movie/day`;
const API_CATEGORIES = `genre/movie/list`;
const API_GENDER_MOVIES = `discover/movie`;
const API_SEARCH_QUERY = `search/movie`;

//Utils
const lazyLoader = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const url = entry.target.getAttribute("data-img");
      entry.target.setAttribute("src", url);
    }
  });
});

function createMovie(movies, container, lazyLoad = false) {
  container.innerHTML = "";

  movies.forEach((movie) => {
    const movieContainer = document.createElement("div");
    movieContainer.classList.add("movie-container");
    movieContainer.addEventListener("click", () => {
      location.hash = `#movie=${movie.id}`;
    });

    const movieImg = document.createElement("img");
    movieImg.classList.add("movie-img");
    movieImg.setAttribute("alt", movie.title);
    movieImg.setAttribute(
      lazyLoad ? "data-img" : "src",
      `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    );
    movieImg.addEventListener("error", () => {
      movieImg.setAttribute("src", "https://i.imgflip.com/11fjj7.jpg");
    });

    if (lazyLoad) {
      lazyLoader.observe(movieImg);
    }

    movieContainer.appendChild(movieImg);
    container.appendChild(movieContainer);
  });
}

function createCategories(categories, container) {
  container.innerHTML = "";

  categories.forEach((category) => {
    const categoryContainer = document.createElement("div");
    categoryContainer.classList.add("category-container");

    const categoryTitle = document.createElement("h3");
    categoryTitle.classList.add("category-title");
    categoryTitle.setAttribute("id", `id${category.id}`);
    categoryTitle.addEventListener("click", () => {
      location.hash = `#category=${category.id}-${category.name}`;
    });
    const categoryTitleText = document.createTextNode(category.name);

    categoryTitle.appendChild(categoryTitleText);
    categoryContainer.appendChild(categoryTitle);
    container.appendChild(categoryContainer);
  });
}

//Calls to API
//fetchData
async function fetchData(urlApi, params) {
  const { data } = await api(urlApi, params);
  return data;
}

//Get Movies Preview
async function getTrendingMoviesPreview(urlApi) {
  try {
    const res = await fetchData(urlApi);
    const movies = res.results;

    createMovie(movies, trendingMoviesPreviewList, true);
  } catch (error) {
    console.log(error);
  }
}

//Get Categories Preview
async function getCategoriesPreview(urlApi) {
  try {
    const res = await fetchData(urlApi);
    const categories = res.genres;

    createCategories(categories, categoriesPreviewList);
  } catch (error) {
    console.log(error);
  }
}

//Get movies by category
async function getMoviesByCategory(urlApi, id) {
  try {
    const res = await fetchData(urlApi, {
      params: {
        with_genres: id,
      },
    });
    const movies = res.results;

    createMovie(movies, genericSection, true);
  } catch (error) {
    console.log(error);
  }
}

//Get movies by Query
async function getMoviesBySearch(urlApi, query) {
  try {
    const res = await fetchData(urlApi, {
      params: {
        query,
      },
    });
    const movies = res.results;

    createMovie(movies, genericSection);
  } catch (error) {
    console.log(error);
  }
}

//Get Trending Movies Preview
async function getTrendingMovies(urlApi) {
  try {
    const res = await fetchData(urlApi);
    const movies = res.results;

    createMovie(movies, genericSection);
  } catch (error) {
    console.log(error);
  }
}

//Get Trending Movies by Id
async function getMovieById(movieId) {
  try {
    const movie = await fetchData(`movie/${movieId}`);

    const movieImgUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    headerSection.style.background = `linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.35) 19.27%,
      rgba(0, 0, 0, 0) 29.17%
    ),
    url("${movieImgUrl}")`;

    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;

    createCategories(movie.genres, movieDetailCategoriesList);

    getRelatedMoviesId(movieId);
  } catch (error) {
    console.log(error);
  }
}

//Get movies recommendation
async function getRelatedMoviesId(movieId) {
  const res = await fetchData(`movie/${movieId}/recommendations`);
  const relatedMovies = res.results;

  createMovie(relatedMovies, relatedMoviesContainer);
}
