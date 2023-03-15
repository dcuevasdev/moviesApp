const API_TRENDING_PREVIEW = `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`;
const API_CATEGORIES = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`;

async function fetchData(urlApi, API) {
  const response = await fetch(urlApi, API);
  const data = await response.json();
  return data;
}

//Get Movies Preview
async function getTrendingMoviesPreview(urlApi) {
  try {
    const trendingPreviewMoviesContainer = document.querySelector(
      "#trendingPreview .trendingPreview-movieList"
    );
    const res = await fetchData(urlApi);

    const movies = res.results;
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
      trendingPreviewMoviesContainer.appendChild(movieContainer);
    });
  } catch (error) {
    console.log(error);
  }
}

getTrendingMoviesPreview(API_TRENDING_PREVIEW);

//Get Categories Preview
async function getCategoriesPreview(urlApi) {
  try {
    const PreviewCategoriesContainer = document.querySelector(
      "#categoriesPreview .categoriesPreview-list"
    );
    const res = await fetchData(urlApi);

    const categories = res.genres;
    categories.forEach((category) => {
      const categoryContainer = document.createElement("div");
      categoryContainer.classList.add("category-container");

      const categoryTitle = document.createElement("h3");
      categoryTitle.classList.add("category-title");
      categoryTitle.setAttribute("id", `id${category.id}`);
      const categoryTitleText = document.createTextNode(category.name);

      categoryTitle.appendChild(categoryTitleText);
      categoryContainer.appendChild(categoryTitle);
      PreviewCategoriesContainer.appendChild(categoryContainer);
    });
  } catch (error) {
    console.log(error);
  }
}

getCategoriesPreview(API_CATEGORIES);
