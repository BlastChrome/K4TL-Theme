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
    this.inputBuffer = [];
    this.timeoutID = undefined;
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
    // determine if the paramater already exists
    const paramExists = this.searchParams.get(name) ? true : false;

    if (!paramExists) {
      // add the new parameter
      this.searchParams.append(name, value);
    } else {
      // update existing parameter
      this.searchParams.set(name, value);
    }
    window.location.search = this.searchParams.toString();
  }
  removeParams(name, value) {
    this.searchParams.delete(name, value);
    // update and send the url
    window.location.search = this.searchParams.toString();
  }

  updateParams(oldName, newName, value) {
    this.searchParams.get(oldName);
  }

  handlePriceFilter(numInput) {
    // determine if it's the max or min input
    const isMAX = numInput.id == 'max-price' ? true : false;

    //determine if the url has
    console.log(this.searchParams.getAll('filter.v.price.lte'));

    // clear the last input timeout
    clearInterval(this.timeoutID);

    const name = numInput.name;
    // get the last input
    const lastInput = numInput.value.split('').pop();

    // add that input to the buffer
    this.inputBuffer.push(lastInput);

    //combine the array into a single value, [1,2,5] = $125
    const result = this.inputBuffer.join('');

    //after a certain amount of time update the filters with the result
    this.timeoutID = setTimeout(() => {
      this.addParams(name, result);
    }, 500);
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
