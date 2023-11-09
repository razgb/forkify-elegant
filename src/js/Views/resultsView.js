import View from "./View.js";

class ResultsView extends View {
  _parentElement = document.querySelector(".results"); // must be the same name as what the _clear method uses. Otherwise leads to error.
  _errorMessage = "No recipes found for you query! Please try again. ";
  _successMessage = "";

  _generateMarkup() {
    return this._data
      .map((result) => {
        return `
        <li class="search__item">
          <a href="#${result.id}" class="search__link">
            <img
              src="${result.image}"
              alt="Image of a recipe"
              class="search__img"
            />
            <div class="search__content">
              <h3 class="search__heading">${result.title}</h3>
              <span class="search__subheading">${result.publisher}</span>
            </div>
            ${result.key ? '<i class="icon fi-rs-user"></i>' : ""}
          </a>
        </li>
      `;
      })
      .join("");
  }
}

export default new ResultsView(); // an instance of. Only 1 results view allowed.
