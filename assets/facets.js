class FacetFiltersForm extends HTMLElement {
  static searchParams = new URLSearchParams(window.location.search);

  constructor() {
    super();
    const facetForm = this.querySelector('form');
    facetForm.addEventListener('click', this.handleFormClickEvents.bind(this));
    facetForm.addEventListener('change', this.handleFormChangeEvent.bind(this));
  }

  handleFormClickEvents(e) {
    const facetRemoveElement = e.target.closest('facet-remove');
    const filterClearElement = e.target.closest('.clear-btn');
    const sizeButton = e.target.closest('.filter-group__buttons button');
    const clickedInput = e.target.closest('input[type="checkbox"]');

    if (facetRemoveElement) {
      e.preventDefault();
      const linkToRemove = e.target.closest('a');
      FacetFiltersForm.updateParams(linkToRemove.dataset.name, linkToRemove.dataset.value, 'delete');
    }
    if (filterClearElement) {
      e.preventDefault();
      FacetFiltersForm.updateParams(null, null, 'clear');
    }
    if (sizeButton) {
      e.preventDefault();
      const name = sizeButton.getAttribute('name');
      const value = sizeButton.getAttribute('value');
      const isActive = sizeButton.classList.contains('active');
      FacetFiltersForm.updateParams(name, value, isActive ? 'delete' : 'add');
    }
    if (clickedInput) {
      const name = clickedInput.name;
      const value = clickedInput.value;
      const isChecked = clickedInput.checked;
      FacetFiltersForm.updateParams(name, value, isChecked ? 'add' : 'delete');
    }
  }

  handleFormChangeEvent(e) {
    const facetSelection = e.target.closest('select');
    if (!facetSelection) return;
    FacetFiltersForm.updateParams(
      'sort_by',
      e.target.value,
      FacetFiltersForm.searchParams.get('sort_by') ? 'update' : 'add'
    );
  }

  static updateParams(name, value, action) {
    if (!action) return;

    if (action === 'clear') {
      FacetFiltersForm.searchParams = new URLSearchParams();
      FacetFiltersForm.updatePageWithFilters('/collections/all');
      return;
    }
    if (action === 'add') {
      FacetFiltersForm.searchParams.append(name, value);
    }
    if (action === 'delete') {
      FacetFiltersForm.searchParams.delete(name, value);
    }
    if (action === 'update') {
      FacetFiltersForm.searchParams.set(name, value);
    }
    FacetFiltersForm.updatePageWithFilters();
  }

  static async updatePageWithFilters(url = `/collections/all?${FacetFiltersForm.searchParams.toString()}`) {
    window.history.pushState({ path: url }, '', url);
    fetch(url)
      .then((response) => response.text())
      .then((text) => {
        const parser = new DOMParser();
        const html = parser.parseFromString(text, 'text/html');

        // Update product grid
        const productGrid = document.querySelector('.product-slider.product-slider--grid');
        productGrid.innerHTML = '';
        html.querySelectorAll('.product-card').forEach((product) => productGrid.appendChild(product));

        // Update filters
        document.querySelectorAll('facet-filters-form .wrapper').forEach((wrapper) => {
          wrapper.innerHTML = '';
          const newFilters = html.querySelector(
            wrapper.classList.contains('mobile-wrapper')
              ? 'facet-filters-form.mobile-filters .filter-wrapper__content'
              : 'facet-filters-form.sidebar-filters .filter--sidebar'
          );
          wrapper.appendChild(newFilters);
        });
      });
  }
}

customElements.define('facet-filters-form', FacetFiltersForm);
