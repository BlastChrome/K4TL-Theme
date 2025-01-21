class FacetFiltersForm extends HTMLElement {
  constructor() {
    super();
    const facetForm = this.querySelector('form');
    const clearBtn = this.querySelector('.clear-btn');
    facetForm.addEventListener('input', this.handleInputFilters.bind(this));
    clearBtn.addEventListener('click', this.handleFilterClear.bind(this));
    // // initialize searchParams with the current URL params,
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
    if (numInput.id == 'min-price') {
      console.log('min-price');
    } else {
      console.log('max-price');
    }
  }
}

customElements.define('facet-filters-form', FacetFiltersForm);
