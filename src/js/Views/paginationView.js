import View from "./View.js";

class PaginationView extends View {
  _parentElement = document.querySelector(".search__pagination");

  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".search__pagination--btn");
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    console.log(numPages);

    // If we are on page 1 and there are other pages.
    if (currPage === 1 && numPages > 1) {
      this._parentElement.style.justifyContent = "flex-end";
      return `
      <button data-goto="${currPage + 1}"
        class="search__pagination--btn search__pagination--btn-right"
      >
        Page ${currPage + 1} &rarr; 
      </button>
      `;
    }

    // If we are on the last page.
    if (currPage === numPages && numPages > 1) {
      this._parentElement.style.justifyContent = "space-between";
      return `
      <button data-goto="${currPage - 1}"
        class="search__pagination--btn search__pagination--btn-left"
      >
        &larr; Page ${currPage - 1}
      </button>
      `;
    }

    // Other page.
    if (currPage < numPages) {
      this._parentElement.style.justifyContent = "space-between";
      return `
      <button data-goto="${currPage - 1}"
          class="search__pagination--btn search__pagination--btn-left"
        >
          &larr; Page ${currPage - 1}
      </button>
        
      <button data-goto="${currPage + 1}"
          class="search__pagination--btn search__pagination--btn-left"
        >
          Page ${currPage + 1} &rarr; 
      </button>
      `;
    }

    // If we are on page 1 an no other pages.
    if (currPage <= numPages) {
      return;
    }
  }
}

export default new PaginationView();
