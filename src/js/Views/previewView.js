import View from "./View.js";

// THIS VIEW IS LIKE A CHILD VIEW OF THE BOOKMARKS AND RESULTS VIEW. (They share similar code)

class PreviewView extends View {
  _parentElement = "";

  _generateMarkup() {
    // Used to highlight selected results by adding an active version of the class.
    const id = window.location.hash.slice(1);

    return `
    <li class="preview">
      <a class="preview__link ${
        this._data.id === id ? "preview__link--active" : ""
      }" href="#${this._data.id}">
        <figure class="preview__fig">
          <img src="${this._data.image}" alt="${this._data.title}"/>
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">
            ${this._data.title}
          </h4>
          <p class="preview__publisher">${this._data.publisher}</p>
          <div class="preview__user-generated ${
            this._data.key ? "" : "hidden"
          }">
            <svg>
            <use href="${icons}#icon-user"></use>
            </svg>
          </div>
        </div>
      </a>
    </li>
    `;
  }
}

export default new PreviewView(); // an instance of. Only 1 results view allowed.
