window.addEventListener("DOMContentLoaded", navigator, false);
window.addEventListener("hashchange", navigator, false);

function navigator() {
  if (location.hash.startsWith("#trends")) {
    trendsPage();
  } else if (location.hash.startsWith("#search=")) {
    searchPage();
  } else if (location.hash.startsWith("#movie=")) {
    moviesPage();
  } else if (location.hash.startsWith("#category=")) {
    categoriesPage();
  } else {
    homePage();
  }
}

function homePage() {
  getTrendingMoviesPreview(API_TRENDING_PREVIEW);
  getCategoriesPreview(API_CATEGORIES);
}
function trendsPage() {}
function searchPage() {}
function moviesPage() {}
function moviesPage() {}
