import View from "./View.js";
import previewView from "./previewView.js";

class ResultsView extends View {
  _parentElement = document.querySelector(".results"); // must be the same name as what the _clear method uses. Otherwise leads to error.
  _errorMessage = "No recipes found for you query! Please try again. ";
  _successMessage = "";

  _generateMarkup() {
    // console.log(this._data); // This is an array. Must be looped over.
    return this._data
      .map((result) => previewView.render(result, false))
      .join("");
  }
}

export default new ResultsView(); // an instance of. Only 1 results view allowed.
