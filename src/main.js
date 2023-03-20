//Data
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

function likedMovieList() {
  const item = JSON.parse(localStorage.getItem("liked_movies"));
  let movies;

  if (item) {
    movies = item;
  } else {
    movies = {};
  }

  return movies;
}

function likeMovie(movie) {
  const likedMovies = likedMovieList();

  if (likedMovies[movie.id]) {
    likedMovies[movie.id] = undefined;
  } else {
    likedMovies[movie.id] = movie;
  }

  localStorage.setItem("liked_movies", JSON.stringify(likedMovies));
}

//Utils
const lazyLoader = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const url = entry.target.getAttribute("data-img");
      entry.target.setAttribute("src", url);
    }
  });
});

function createMovie(
  movies,
  container,
  { lazyLoad = false, clean = true } = {}
) {
  if (clean) {
    container.innerHTML = "";
  }

  movies.forEach((movie) => {
    const movieContainer = document.createElement("div");
    movieContainer.classList.add("movie-container");

    const movieImg = document.createElement("img");
    movieImg.classList.add("movie-img");
    movieImg.setAttribute("alt", movie.title);
    movieImg.setAttribute(
      lazyLoad ? "data-img" : "src",
      `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    );
    movieImg.addEventListener("click", () => {
      location.hash = `#movie=${movie.id}`;
    });
    movieImg.addEventListener("error", () => {
      movieImg.setAttribute("src", "https://i.imgflip.com/11fjj7.jpg");
    });

    const movieBtn = document.createElement("button");
    movieBtn.classList.add("movie-btn");
    likedMovieList()[movie.id] && movieBtn.classList.add("movie-btn--liked");
    movieBtn.addEventListener("click", () => {
      movieBtn.classList.toggle("movie-btn--liked");
      likeMovie(movie);
      if (location.hash === "") {
        homePage();
      }
    });

    if (lazyLoad) {
      lazyLoader.observe(movieImg);
    }

    movieContainer.appendChild(movieImg);
    movieContainer.appendChild(movieBtn);
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

    createMovie(movies, trendingMoviesPreviewList, { lazyLoad: true });
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
    maxPage = res.total_pages;

    createMovie(movies, genericSection, { lazyLoad: true });
  } catch (error) {
    console.log(error);
  }
}

function getPaginateMoviesByCategory(id) {
  return async function () {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    const scrollIsBottom = scrollTop + clientHeight >= scrollHeight - 15;
    const pageIsNotMax = page < maxPage;

    if (scrollIsBottom && pageIsNotMax) {
      page++;
      const res = await api(API_GENDER_MOVIES, {
        params: {
          with_genres: id,
          page,
        },
      });
      const movies = res.data.results;

      createMovie(movies, genericSection, { lazyLoad: true, clean: false });
    }
  };
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
    maxPage = res.total_pages;

    createMovie(movies, genericSection);
  } catch (error) {
    console.log(error);
  }
}

function getPaginateMoviesBySearch(query) {
  return async function () {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    const scrollIsBottom = scrollTop + clientHeight >= scrollHeight - 15;
    const pageIsNotMax = page < maxPage;

    if (scrollIsBottom && pageIsNotMax) {
      page++;
      const res = await api(API_SEARCH_QUERY, {
        params: {
          query,
          page,
        },
      });
      const movies = res.data.results;

      createMovie(movies, genericSection, { lazyLoad: true, clean: false });
    }
  };
}

//Get Trending Movies Preview
async function getTrendingMovies(urlApi) {
  try {
    const res = await fetchData(urlApi);
    const movies = res.results;
    maxPage = res.total_pages;

    createMovie(movies, genericSection, { lazyLoad: true, clean: true });
  } catch (error) {
    console.log(error);
  }
}

async function getPaginatedTrendingMovies() {
  try {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    const scrollIsBottom = scrollTop + clientHeight >= scrollHeight - 15;
    const pageIsNotMax = page < maxPage;

    if (scrollIsBottom && pageIsNotMax) {
      page++;
      const res = await fetchData(API_TRENDING_PREVIEW, {
        params: {
          page,
        },
      });
      const movies = res.results;

      createMovie(movies, genericSection, { lazyLoad: true, clean: false });
    }
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

//Render favorite
function getLikedMovies() {
  const likedMovies = likedMovieList();
  const moviesArray = Object.values(likedMovies);

  createMovie(moviesArray, likedMoviesListArticle, {
    lazyLoad: true,
    clean: true,
  });
}
