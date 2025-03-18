class FacetFiltersForm extends HTMLElement {
  constructor() {
    super();
    const facetForm = this.querySelector('form');
    this.searchParams = new URLSearchParams(window.location.search);
    facetForm.addEventListener('click', this.handleFormClickEvents.bind(this));
  }
  handleFormClickEvents(e) {
    const facetRemoveElement = e.target.closest('facet-remove');
    const filterClearElement = e.target.closest('.clear-btn');
    const sizeButton = e.target.closest('.filter-group__buttons button');
    const clickedInput = e.target.closest('input[type="checkbox"]');

    if (facetRemoveElement) {
      e.preventDefault();
      const linkToRemove = e.target.closest('a');
      const name = linkToRemove.dataset.name;
      const value = linkToRemove.dataset.value;
      this.updateParams(name, value, 'delete');
    }
    if (filterClearElement) {
      e.preventDefault();
      this.updateParams(null, null, 'clear');
    }
    if (sizeButton) {
      e.preventDefault();
      const isActive = sizeButton.classList.contains('active');
      const name = sizeButton.getAttribute('name');
      const value = sizeButton.getAttribute('value');
      isActive ? this.updateParams(name, value, 'delete') : this.updateParams(name, value, 'add');
    }
    if (clickedInput) {
      const isChecked = clickedInput.checked;
      const name = clickedInput.name;
      const value = clickedInput.value;
      isChecked ? this.updateParams(name, value, 'add') : this.updateParams(name, value, 'delete');
    }
  }

  updateParams(name, value, action) {
    if (!action) return;
    if (action == 'clear') {
      this.searchParams.forEach((_, key) => this.searchParams.delete(key)); // Remove all parameters
      const cleanUrl = '/collections/all';
      this.updatePageWithFilters(cleanUrl);
      return;
    }
    if (action == 'add') {
      this.searchParams.append(name, value);
    }
    if (action == 'delete') {
      this.searchParams.delete(name, value);
    }
    if (action == 'update') {
      this.searchParams.set(name, value);
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
        // get the updated filters and products from the html element
        const updatedProducts = html.querySelectorAll('.product-card');
        productGrid.innerHTML = '';
        updatedProducts.forEach((product) => productGrid.appendChild(product));

        // wrapper element for the mobile/sidebar filter
        const oldFilterWrappers = document.querySelectorAll('facet-filters-form .wrapper');

        const newSidebarFilters = html.querySelector('facet-filters-form.sidebar-filters .filter--sidebar');
        const newMobileFilters = html.querySelector('facet-filters-form.mobile-filters .filter-wrapper__content');

        oldFilterWrappers.forEach((wrapper) => {
          wrapper.innerHTML = '';
          wrapper.classList.contains('mobile-wrapper')
            ? wrapper.appendChild(newMobileFilters)
            : wrapper.appendChild(newSidebarFilters);
        });
      });
  }
}

customElements.define('facet-filters-form', FacetFiltersForm);

class SortBy extends FacetFiltersForm {
  constructor() {
    super();
    const isDrawer = this.classList.contains('drawer') ? true : false;
    if (!isDrawer) {
      const facetSelection = this.querySelector('select');
      facetSelection.addEventListener('change', this.handleSelectionChange.bind(this));
    }
  }

  handleSelectionChange(e) {
    const value = e.target.value;
    // FacetFiltersForm.updateParams('sortby', value, 'add');
  }
}

customElements.define('sort-by', SortBy);
