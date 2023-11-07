import * as model from "./model.js";
import { MODAL_CLOSE_SEC } from "./config.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";

import "core-js/stable";
import "regenerator-runtime/runtime";

// KEY: 6346fc4a-d3d9-4eaa-a308-317e7621c533

// if (module.hot) {
//   module.hot.accept();
// }

// DYNAMICALLY REQUESTS URL FROM WEBSITE AND DISPLAYS ENTIRE DATA.
const controlRecipes = async function () {
  // Anchors change the hash of the page.
  try {
    const id = window.location.hash.slice(1); // removes the hash character from the ID. (e.g. everything after the hash of something.com/#489q73049w87340w39874)

    if (!id) return; // Does nothing on home page.
    recipeView.renderSpinner();

    // 1) Update result & bookmarks View to HIGHLIGHT selected search results.
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 2) Loading recipe
    await model.loadRecipe(id);

    // 3) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
};

const controlSearchResult = async function () {
  try {
    // 1) Get search query.
    const query = searchView.getQuery();
    if (!query) return;

    resultsView.renderSpinner();

    // 2) Load search query.
    await model.loadSearchResults(query);

    // 3) Render search.
    resultsView.render(model.getSearchResultsPage(1));

    // 4) Render initial Pagination buttons.
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

// RECEIVES PAGE TO GO TO FROM THE PUBLISHER FUNCTION.
const controlPagination = function (goToPage) {
  // 1) Render NEW results.
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render NEW pagination buttons.
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (inside the state).
  model.updateServings(newServings);

  // Update the recipe view.
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add/Remove bookmark.
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update Recipe view.
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks.
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner.
    addRecipeView.renderSpinner();

    // Upload new recipe data.
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe.
    recipeView.render(model.state.recipe);

    // Success message.
    addRecipeView.renderMessage();

    // Render bookmark view.
    bookmarksView.render(model.state.bookmarks); // New element inserted, so update does not work.

    // Change ID in URL.
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    // Close form window.

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, 1000 * MODAL_CLOSE_SEC);

    setTimeout(function () {
      addRecipeView.render();
    }, 2000 * MODAL_CLOSE_SEC);
  } catch (err) {
    console.error("❌", err);
    addRecipeView.renderError(err.message);
  }
};

///////////////////////////////////////////////////////////////////////////////

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks); // First renders the bookmarks received from localstorage.
  searchView.addHandlerSearch(controlSearchResult);
  recipeView.addHandlerRender(controlRecipes); // Subscriber function that calls a func from the view and passes in a func to run.
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
