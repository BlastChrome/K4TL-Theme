class FacetFiltersForm extends HTMLElement {
  constructor() {
    super();
    const facetForm = this.querySelector('form');
    const clearBtn = this.querySelector('.clear-btn');
    this.urlParams = new URLSearchParams();

    facetForm.addEventListener('input', this.handleInputFilters.bind(this));
    clearBtn.addEventListener('click', this.handleFilterClear.bind(this));
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

  // handleCheckBoxFilter2(checkboxInput) {
  //   let filter = `${checkboxInput.name}=${checkboxInput.value.replace(' ', '+')}`;
  //   let params = window.location.href.includes('?') ? `&` : '?';
  //   let isLastFilter = !window.location.href.includes('&') ? true : false;
  //   debugger;

  //   if (isLastFilter) {
  //     checkboxInput.checked
  //       ? (window.location.href = window.location.href + `${params}${filter}`)
  //       : (window.location.href = window.location.href.replace(`?${filter}`, ''));
  //   } else {
  //     checkboxInput.checked
  //       ? (window.location.href = window.location.href + `${params}${filter}`)
  //       : (window.location.href = window.location.href.replace(`${params}${filter}`, ''));
  //   }
  // }

  // handleCheckBoxFilter2(checkboxInput) {
  //   let isChecked = checkboxInput.checked;
  //   let filter = `${checkboxInput.name}=${checkboxInput.value.replace(' ', '+')}`;
  //   if (isChecked) {
  //     // Adding a Filter
  //     if (!window.location.href.includes('?')) {
  //       window.location.href = `${window.location.href}?${filter}`;
  //     } else {
  //       window.location.href = `${window.location.href}&${filter}`;
  //     }
  //   } else {
  //     // Removing Filter
  //     // get the current filter to remove
  //     window.location.search = window.location.search.replace(filter, '');
  //   }
  // }

  handleCheckBoxFilter(checkboxInput) {
    let name = `${checkboxInput.name}`;
    let value = `${checkboxInput.value.replace(' ', '+')}`;
    this.urlParams.append(name, value);
    checkboxInput.checked ? this.urlParams.delete(name, value) : this.urlParams.append(name, value);
    console.log(this.urlParams.get(name));
    // console.log(value);
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
