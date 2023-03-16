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

//Helpers
function createMovie(movies, container) {
  container.innerHTML = "";

  movies.forEach((movie) => {
    const movieContainer = document.createElement("div");
    movieContainer.classList.add("movie-container");

    const movieImg = document.createElement("img");
    movieImg.classList.add("movie-img");
    movieImg.setAttribute("alt", movie.title);
    movieImg.setAttribute(
      "src",
      `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    );

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
    categoriesPreviewList.appendChild(categoryContainer);
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

    createMovie(movies, trendingMoviesPreviewList);
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

    createMovie(movies, genericSection);
  } catch (error) {
    console.log(error);
  }
}
