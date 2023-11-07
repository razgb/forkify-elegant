import icons from 'url:../../img/icons.svg';
import View from './View.js';
import previewView from './previewView.js';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list'); // must be the same name as what the _clear method uses. Otherwise leads to error.
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it ;) ';
  _successMessage = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    // console.log(this._data); // This is an array. Must be looped over.
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView(); // an instance of. Only 1 results view allowed.
