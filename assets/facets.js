class FacetFiltersForm extends HTMLElement {
  constructor() {
    super();
    const facetForm = this.querySelector('form');
    const clearBtn = this.querySelector('.clear-btn');
    const sizeButtons = this.querySelector('.filter-group__buttons');
    facetForm.addEventListener('input', this.handleInputFilters.bind(this));
    clearBtn.addEventListener('click', this.handleFilterClear.bind(this));
    sizeButtons.addEventListener('click', this.handleSizeButtonClick.bind(this));
    // initialize searchParams with the current URL params,
    this.searchParams = new URLSearchParams(window.location.search);
  }

  handleFilterClear(e) {
    e.preventDefault();
    const cleanUrl = '/collections/all';
    window.location.href = cleanUrl;
  }

  handleInputFilters(e) {
    const input = e.target;
    const inputType = e.target.type;

    if (inputType == 'checkbox') this.handleCheckBoxFilter(input);
    if (inputType == 'number') this.handlePriceFilter(input);
  }

  handleCheckBoxFilter(checkboxInput) {
    const isChecked = checkboxInput.checked;
    const name = checkboxInput.name;
    const value = checkboxInput.value;

    isChecked ? this.addParams(name, value) : this.removeParams(name, value);
  }

  addParams(name, value) {
    this.searchParams.append(name, value);
    // update and send the url
    window.location.search = this.searchParams.toString();
  }
  removeParams(name, value) {
    this.searchParams.delete(name, value);
    // update and send the url
    window.location.search = this.searchParams.toString();
  }

  handlePriceFilter(numInput) {
    const name = numInput.name;
    const value = numInput.value;
  }

  handleSizeButtonClick(e) {
    e.preventDefault();
    const clickedButton = e.target;
    const isActive = clickedButton.classList.contains('active');
    const name = clickedButton.getAttribute('name');
    const value = clickedButton.getAttribute('value');

    isActive ? this.removeParams(name, value) : this.addParams(name, value);
  }
}

customElements.define('facet-filters-form', FacetFiltersForm);
