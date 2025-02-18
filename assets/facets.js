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
    this.minValue = this.querySelector('.range__slide-input--min');
    this.maxValue = this.querySelector('.range__slide-input--max');

    // price filter inputs fields
    this.priceInputMin = this.querySelector('input[type="number"].min-input');
    this.priceInputMax = this.querySelector('input[type="number"].max-input');

    this.minGap = 0;
    this.priceRangeTrack = this.querySelector('.range__track');
    this.sliderMinValue = parseInt(this.minValue.min);
    this.sliderMaxValue = parseInt(this.maxValue.max);

    facetForm.addEventListener('input', this.handleInputFilters.bind(this));
    clearBtn.addEventListener('click', this.handleFilterClear.bind(this));
    sizeButtons.addEventListener('click', this.handleSizeButtonClick.bind(this));

    this.minValue.addEventListener('input', this.priceSlideMin.bind(this));
    this.maxValue.addEventListener('input', this.priceSlideMax.bind(this));
    // initialize the price filter on load
    this.priceSlideMin();
    this.priceSlideMax();

    console.log(this.maxValue.value);
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
    // if (inputType == 'range') this.handlePriceFilterRangeSlider(input);
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

  priceSlideMin() {
    let gap = parseInt(this.maxValue.value) - parseInt(this.minValue.value);
    if (gap <= this.minGap) {
      this.minValue.value = parseInt(this.maxValue.value) - this.minGap;
    }
    this.priceInputMin.value = this.minValue.value;
    this.setPriceArea();
  }

  priceSlideMax() {
    let gap = parseInt(this.maxValue.value) - parseInt(this.minValue.value);
    if (gap <= this.minGap) {
      this.maxValue.value = parseInt(this.minValue.value) + this.minGap;
    }
    this.priceInputMax.value = this.maxValue.value;
    this.setPriceArea();
  }

  setPriceArea() {
    this.priceRangeTrack.style.left = (this.minValue.value / this.sliderMaxValue) * 100 + '%';
    this.priceRangeTrack.style.right = 100 - (this.maxValue.value / this.sliderMaxValue) * 100 + '%';
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
