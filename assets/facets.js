class FacetFiltersForm extends HTMLElement {
  constructor() {
    super();
    const facetForm = this.querySelector('form');
    const sizeButtons = this.querySelector('.filter-group__buttons');

    // initialize searchParams with the current URL params,
    this.searchParams = new URLSearchParams(window.location.search);
    this.timeoutID = null;

    facetForm.addEventListener('input', this.handleInputFilters.bind(this));
    sizeButtons.addEventListener('click', this.handleSizeButtonClick.bind(this));

    // event delegation approach
    facetForm.addEventListener('click', this.handleEventDelgation.bind(this));
  }

  handleEventDelgation(e) {
    const facetRemoveElement = e.target.closest('facet-remove');
    const filterClearElement = e.target.closest('.clear-btn');

    if (facetRemoveElement) {
      e.preventDefault();
      const linkToRemove = event.target.closest('a');
      const name = linkToRemove.dataset.name;
      const value = linkToRemove.dataset.value;
      this.updateParams(name, value, 'delete');
    }
    if (filterClearElement) {
      e.preventDefault();
      console.log(filterClearElement);
      this.updateParams(null, null, 'clear');
    }
  }

  handleInputFilters(e) {
    const input = e.target;
    const inputType = e.target.type;
    if (inputType == 'checkbox') this.handleCheckBoxFilter(input);
    if (inputType == 'number') this.handlePriceFilterNumber(input);
  }

  handleCheckBoxFilter(checkboxInput) {
    const isChecked = checkboxInput.checked;
    const name = checkboxInput.name;
    const value = checkboxInput.value;

    isChecked ? this.updateParams(name, value, 'add') : this.updateParams(name, value, 'delete');
  }

  updateParams(name, value, action) {
    if (!action) return;

    if (action == 'add') {
      this.searchParams.append(name, value);
    }
    if (action == 'delete') {
      this.searchParams.delete(name, value);
    }
    if (action == 'update') {
      this.searchParams.set(name, value);
    }
    if (action == 'clear') {
      this.searchParams.forEach((_, key) => this.searchParams.delete(key)); // Remove all parameters
      const cleanUrl = '/collections/all';
      window.history.replaceState({}, '', cleanUrl); // Update the URL
    }
    this.updatePageWithFilters();
  }

  async updatePageWithFilters(someUrl) {
    let url = null;
    if (!someUrl) {
      url = `/collections/all?${this.searchParams.toString()}`;
    } else {
      url = someUrl;
    }

    // Use the History API to update the URL in the address bar without reloading the page
    window.history.pushState({ path: url }, '', url);

    fetch(url)
      .then((response) => response.text())
      .then((text) => {
        const parser = new DOMParser();
        const html = parser.parseFromString(text, 'text/html');

        const productGrid = document.querySelector('.product-slider.product-slider--grid');
        const filterWrapper = document.querySelector('facet-filters-form.sidebar-filters');

        // get the updated filters and products from the html element
        const updatedProducts = html.querySelectorAll('.product-card');
        const updatedFilters = html.querySelector('facet-filters-form.sidebar-filters form');

        // clear the old values
        productGrid.innerHTML = '';
        filterWrapper.innerHTML = '';

        // add the new products and filter values
        updatedProducts.forEach((product) => productGrid.appendChild(product));

        // update the filters to show the currently applied tags
        filterWrapper.appendChild(updatedFilters);

        // Reattach event listeners to the new filter form and buttons
        const facetForm = filterWrapper.querySelector('form');
        const sizeButtons = filterWrapper.querySelector('.filter-group__buttons');

        // re-attach event listeners
        facetForm.addEventListener('input', this.handleInputFilters.bind(this));
        sizeButtons.addEventListener('click', this.handleSizeButtonClick.bind(this));

        facetForm.addEventListener('click', this.handleEventDelgation.bind(this));
      });
  }

  handleSizeButtonClick(e) {
    e.preventDefault();
    const clickedButton = e.target;
    const isActive = clickedButton.classList.contains('active');
    const name = clickedButton.getAttribute('name');
    const value = clickedButton.getAttribute('value');

    isActive ? this.updateParams(name, value, 'delete') : this.updateParams(name, value, 'add');
  }
}

customElements.define('facet-filters-form', FacetFiltersForm);
