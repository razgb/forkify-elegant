// THIS IS A PARENT CLASS FOR ALL THE VIEWS SO THAT THEY SHARE THE SAME METHODS.
import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  /**
   * Render the recieved object to the DOM.
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe).
   * @param {Boolean} [render = true] If false, creates markup string instead of rendering to the DOM.
   * @returns {undefined | string} A markup string is returned if render === false.
   * @this {Object} View instance.
   * @author Raz Neaiz
   * @todo Finish implementation.
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup; // to prevent render from the previewView occuring.

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // DYNAMICALLY UPDATES ANY ELEMENT THAT HAS CHANGED.

  update(data) {
    // updated elements
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup); // converts str to dom node objects. (this is a virtual dom element living only in the memory)
    const newElements = Array.from(newDOM.querySelectorAll('*'));

    // current elements array made from a nodelist
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    // console.log(curElements);
    // console.log(newElements);

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl)); // equality checks nodes to each other.

      // update changed TEXT.
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      // update changed ATTRIBUTES.
      if (!newEl.isEqualNode(curEl)) {
        // console.log(Array.from(newEl.attributes));
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  // CLEARS DISPLAY PAGE.
  _clear() {
    this._parentElement.innerHTML = '';
  }

  // RENDERS THE SPINNING ANIMATION FOR ASYNC OPERATIONS.
  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
  `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._successMessage) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
} // This is not an instance, it is the whole class.
