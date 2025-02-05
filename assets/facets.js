class FacetFiltersForm extends HTMLElement {
  constructor() {
    super();
    const facetForm = this.querySelector('form');
    const clearBtn = this.querySelector('.clear-btn');
    const sizeButtons = this.querySelector('.filter-group__buttons');

    // initialize searchParams with the current URL params,
    this.searchParams = new URLSearchParams(window.location.search);
    this.timeoutID = null;
    this.refreshDelay = 500; // half a second buffer before inputs are processed

    // price filter range inputs
    this.minValue = this.querySelector('input[type="range"]#min');
    this.maxValue = this.querySelector('input[type="range"]#max');

    // price filter inputs fields
    this.priceInputMin = this.querySelector('input.min-input');
    this.priceInputMax = this.querySelector('input.max-input');

    this.minGap = 0;
    this.priceRange = this.querySelector('.range__track');
    this.sliderMinValue = parseInt(this.minValue.min);
    this.sliderMaxValue = parseInt(this.maxValue.max);

    facetForm.addEventListener('input', this.handleInputFilters.bind(this));
    clearBtn.addEventListener('click', this.handleFilterClear.bind(this));
    sizeButtons.addEventListener('click', this.handleSizeButtonClick.bind(this));
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
    if (inputType == 'number') this.handlePriceFilterNumber(input);
    if (inputType == 'range') this.handlePriceFilterRangeSlider(input);
  }

  handleCheckBoxFilter(checkboxInput) {
    const isChecked = checkboxInput.checked;
    const name = checkboxInput.name;
    const value = checkboxInput.value;

    isChecked ? this.updateParams(name, value, 'add') : this.updateParams(name, value, 'delete');
  }

  updateParams(name, value, action) {
    if (!action || !name || !value) return;

    if (action == 'add') {
      this.searchParams.append(name, value);
    }
    if (action == 'delete') {
      this.searchParams.delete(name, value);
    }
    if (action == 'update') {
      this.searchParams.set(name, value);
    }
    window.location.search = this.searchParams.toString();
  }

  handlePriceFilterNumber(numInput) {
    // clear the last input timeout
    clearInterval(this.timeoutID);
    const name = numInput.name;
    const value = numInput.value;

    //after a certain amount of time update the filters with the result
    this.timeoutID = setTimeout(() => {
      const paramExists = this.searchParams.get(name) ? true : false;
      if (!paramExists) {
        this.updateParams(name, value, 'add');
      } else {
        this.updateParams(name, value, 'update');
      }
    }, this.refreshDelay);
  }

  handlePriceFilterRangeSlider(slide) {}

  priceSlideMin(){
    let gap 
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
