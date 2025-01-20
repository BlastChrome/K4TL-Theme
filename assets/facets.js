class FacetFiltersForm extends HTMLElement {
  constructor() {
    super();
    const facetForm = this.querySelector('form');
    facetForm.addEventListener('input', (e) => {
      console.log(e.currentTarget);
    });
  }
}

customElements.define('facet-filters-form', FacetFiltersForm);
