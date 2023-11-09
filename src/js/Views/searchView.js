class SearchView {
  _parentElement = document.querySelector(".searchForm");

  getQuery() {
    const query = this._parentElement.querySelector(".inputForm").value;
    this._clearInput();
    console.log(query);
    return query;
  }

  _clearInput() {
    this._parentElement.querySelector(".inputForm").value = "";
  }

  addHandlerSearch(handler) {
    this._parentElement.addEventListener("submit", function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView(); // instance of.
