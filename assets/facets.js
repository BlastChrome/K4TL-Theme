class FacetFiltersForm extends HTMLElement {
  constructor() {
    super();
    const facetForm = this.querySelector('form');
    const clearBtn = this.querySelector('.clear-btn');
    facetForm.addEventListener('input', this.handleInputFilters.bind(this));
    clearBtn.addEventListener('click', this.handleFilterClear);
  }

  handleFilterClear(e) {
    e.preventDefault();
    const cleanUrl = '/collections/all';
    window.location.href = cleanUrl;
  }

  handleInputFilters(e) {
    const input = e.target;
    switch (e.target.type) {
      case 'checkbox':
        this.handleCheckBoxFilter(input);
        break;
      case 'number':
        this.handlePriceFilter(input);
        break;
      default:
        console.warn(`Unhandled input type: ${e.target.type}`);
    }
  }

  handleCheckBoxFilter2(checkboxInput) {
    let inputValue = checkboxInput.value.replace(' ', '+'); // replaces any whitespace with '+'

    let params = window.location.href.includes('?')
      ? `&${checkboxInput.name}=${inputValue}`
      : `?${checkboxInput.name}=${inputValue}`;

    checkboxInput.checked
      ? (window.location.href = window.location.href + params)
      : (window.location.href = window.location.href.replace(params, ''));
  }
  handleCheckBoxFilter(checkboxInput) {
    // replaces any whitespace with '+'

    // http://127.0.0.1:9292/collections/all                                                      - no param
    // http://127.0.0.1:9292/collections/all?filter.p.vendor=Nike                                 - last param
    // http://127.0.0.1:9292/collections/all?filter.p.vendor=Nike&filter.p.vendor=Kicks4ThaLow    - not last param

    const inputValue = checkboxInput.value.replace(' ', '+');
    let param = '';
    console.log(window.location.pathname);
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
