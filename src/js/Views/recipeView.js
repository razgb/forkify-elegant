import View from "./View.js";
import icons from "url:../../img/icons.svg";
import * as fracty from "fracty/fracty.js";

// THIS IS THE PARENT CLASS.
class RecipeView extends View {
  _parentElement = document.querySelector(".recipe");
  _errorMessage = "We could not find that recipe. Please try another one.";
  _successMessage = "";

  // PUBLISHER function that executes another function. (controlRecipes)
  addHandlerRender(handler) {
    ["hashchange", "load"].forEach((ev) =>
      window.addEventListener(ev, handler)
    );
  }

  // DYNAMICALLY CHANGES THE NUMBERS RELATED TO SERVINGS WITH -/+.
  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--update-servings");
      if (!btn) return;
      const updateTo = +btn.dataset.updateTo; // datasets are strings.
      if (updateTo > 0) handler(updateTo); // we cannot have 0 servings.
    });
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--bookmark");
      if (!btn) return;
      handler();
    });
  }

  // CREATES THE MARKUP HTML DYNAMICALLY FROM A RECIPE OBJECT.
  _generateMarkup() {
    return `
        <figure class="recipe__fig">
          <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this._data.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock">${this._data.cookingTime}</use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">45</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              this._data.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--update-servings" data-update-to ="${
                this._data.servings - 1
              }">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--update-servings" data-update-to ="${
                this._data.servings + 1
              }">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated ${this._data.key ? "" : "hidden"}">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round btn--bookmark">
            <svg class="">
              <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? "-fill" : ""
    }"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
            ${this._data.ingredients
              .map(this._generateMarkupIngredient)
              .join("")}
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              this._data.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${this._data.sourceUrl}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>
    `;
  }

  _generateMarkup2() {
    return `
    <section class="recipe__section">
      <div class="recipe__img--container">
        <img
          class="recipe__img"
          src="${this.data.image}"
          alt=""
        />
      </div>
      <h3 class="recipe__heading">${this.data.title}</h3>

      <div class="recipe__detail--container">
        <div class="recipe__details">
          <i class="recipe__icon fi fi-rr-alarm-clock"></i>

          <span class="recipe__info"
            ><strong class="ingredient__highlight">${
              this.data.cookingTime
            }</strong> Minutes
          </span>
        </div>

        <div class="recipe__details">
          <i class="recipe__icon fi fi-rs-users"></i>
          <span class="recipe__info"
            ><strong class="ingredient__highlight">${
              this.data.servings
            }</strong>
            Servings</span
          >

          <div class="change-serving-container">
            <button class="serving__icon">
              <i class="recipe__icon fi fi-rr-minus-circle"></i>
            </button>
            <button class="serving__icon">
              <i class="recipe__icon fi fi-rs-add"></i>
            </button>
          </div>
        </div>

        <span
          class="bookmark__icon material-icons"
          style="font-size: 36px"
        >
          bookmark
        </span>
      </div>
    </section>

    <section class="recipe__ingredients">
      <h3 class="ingredients__heading">Recipe Ingredients</h3>
      <ul class="recipe__ingredients--list">
      ${this.data.ingredients.map(this._generateMarkupIngredient).join("")}
      </ul>
    </section>

    <section class="recipe__directions">
      <h3 class="recipe__directions--heading">How to cook it</h3>
      <span class="recipe__directions--text"
        >This recipe was carefully designed and tested by
        <strong>BBC Food</strong>. <br />
        Please check out directions at their website.</span
      >
      <button class="btn recipe__directions--btn">
        Author's website
      </button>
    </section>
    `;
  }

  _generateMarkupIngredient(ing) {
    return `
      <li class="recipe__ingredient">
        <i class="recipe__icon fi fi-rs-check"></i>
        <div>
          <strong class="ingredient__highlight">${
            ing.quantity ? fracty(ing.quantity).toString() : ""
          }</strong> ${ing.unit}
          ${ing.description}
        </div>
      </li>
    `;
  }
}

// EXPORTS A DEFAULT INSTANCE OF THIS CLASS.
export default new RecipeView(); // exports an unnamed instance of this class. (more effiicent than exporting entire class and then creating an instance.)
