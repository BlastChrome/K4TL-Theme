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
    const clickedCheckbox = e.target.closest('input[type="checkbox"]');

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
    if (clickedCheckbox) {
      const isFilterInput = clickedCheckbox.classList.contains('checkbox-filters');
      const isSortByInput = clickedCheckbox.classList.contains('checkbox-sortby');
      if (isFilterInput) {
        const isChecked = clickedCheckbox.checked;
        FacetFiltersForm.updateParams(clickedCheckbox.name, clickedCheckbox.value, isChecked ? 'add' : 'delete');
      }
      if (isSortByInput) {
        const hasSortByFilter = FacetFiltersForm.searchParams.get('sort_by');
        FacetFiltersForm.updateParams('sort_by', clickedCheckbox.value, hasSortByFilter ? 'update' : 'add');
      }
    }
  }

  handleFormChangeEvent(e) {
    e.preventDefault();
    const isSortFiler = e.target.closest('[data-sortby="option"]') ? true : false;
    if (!isSortFiler) return;
    const hasSortByFilter = FacetFiltersForm.searchParams.get('sort_by');
    FacetFiltersForm.updateParams('sort_by', e.target.value, hasSortByFilter ? 'update' : 'add');
  }

  static updateParams(name, value, action) {
    if (!action) return;

    if (action === 'clear') {
      FacetFiltersForm.searchParams = new URLSearchParams();
      FacetFiltersForm.updateFiltersProducts('/collections/all');
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
    FacetFiltersForm.updateFiltersProducts();
  }

  static async updateFiltersProducts(url = `/collections/all?${FacetFiltersForm.searchParams.toString()}`) {
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

        // Update filters and drawers
        const filterContentWrappers = document.querySelectorAll('[data-filter="wrapper"]');
        const updatedContentWrappers = html.querySelectorAll('[data-filter="wrapper"]');
        filterContentWrappers.forEach((wrapper, idx) => {
          if ([...wrapper.classList].sort().join(' ') === [...updatedContentWrappers[idx].classList].sort().join(' ')) {
            wrapper.innerHTML = '';
            const newContent = updatedContentWrappers[idx].querySelector('[data-filter="content"]');
            wrapper.appendChild(newContent);
          }
        });
      });
  }
}
customElements.define('facet-filters-form', FacetFiltersForm);
