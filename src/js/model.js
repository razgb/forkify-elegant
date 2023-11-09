import { async } from "regenerator-runtime";
import { API_URL, RES_PER_PAGE, KEY } from "./config";
// import { getJSON, sendJSON } from './helpers';
import { AJAX } from "./helpers";

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};
// THERE IS A LIVE CONNECTION BETWEEN MODEL AND CONTROLLER ONCE EXPORTED.

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

// ASYNC OPERATION THAT LOADS THE RECIPE
// impure function that changes the model.state object.
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`); // Still a promise. | The KEY is used so the server sends our own recipes as well.
    // console.log(data);
    state.recipe = createRecipeObject(data);

    // console.log(state.recipe);

    // Returns true if just one item matches the condition.
    if (state.bookmarks.some((bookmark) => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err; // resends the error to controller.js
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map((recipe) => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    // console.log(state.search.results);

    state.search.page = 1; // resets the page back to 1 for the new search.
  } catch (err) {
    console.error(`❌ ${err} `);
    throw err;
  }
};

// set to state's default value.
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // 0
  const end = page * state.search.resultsPerPage; // 10

  // THIS IS AN ARRAY THAT IS SLICED
  return state.search.results.slice(start, end);
};

/*

// THIS IS NOT A PURE FUNCTION. MANIPULATES ORIGINAL VALUES OF SERVINGS.
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQt = oldQt * newServings / oldServings.
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark.
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmark.
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

// NOTE: this is a common practice to use the entire obj when adding but
// use the id when deleting.

export const deleteBookmark = function (id) {
  // PURPOSE: removes recipe from bookmarks array and then sets bookmarked to false.

  // Delete bookmark
  const index = state.bookmarks.findIndex((el) => el.id === id);
  state.bookmarks.splice(index, 1); // at index of const index and a span of 1 item.

  // mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem("bookmarks"); // storing in a var first incase it is undefined.
  if (storage) state.bookmarks = JSON.parse(storage); // JavaScript Object Notation into Object.
};

init();

// FOR DEVELOPMENT PURPOSES.
const clearBookmarks = function () {
  localStorage.clear("bookmarks");
};
//

// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  // console.log(Object.entries(newRecipe));
  try {
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
      .map((ing) => {
        const ingArr = ing[1].split(",").map((el) => el.trim());

        if (ingArr.length !== 3) throw new Error("Wrong ingredient format!"); // propagates towards the controlAddRecipe function.
        const [quantity, unit, description] = ingArr;

        // If there is a value in quan, return number of quan, else return null
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    // console.log(ingredients);

    // CONVERT OBJECT BACK INTO FORMAT OF API.
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data); // Turns data back into our data object format.
    addBookmark(state.recipe);
  } catch (err) {
    throw err; // we are in an async function, the error above would be a rejected promise.
  }
};

*/
