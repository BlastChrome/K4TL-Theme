class FacetFiltersForm extends HTMLElement {
  constructor() {
    super();
    const facetForm = this.querySelector('form');
    facetForm.addEventListener('input', (e) => {
      console.log(e.target);
    });
  }
}

customElements.define('facet-filters-form', FacetFiltersForm);
