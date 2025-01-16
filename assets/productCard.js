// Create a class for the element
if (!customElements.get('product-card')) {
  customElements.define(
    'product-card',
    class ProductCardForm extends HTMLElement {
      constructor() {
        super();
        // cache dom
        this.addForm = this.querySelector('form[action$="/cart/add.js"]');
        this.addBtn = this.querySelector('button[type="submit"]');
        this.addBtnText = this.querySelector('#btn-text');
        this.addBtnSpinner = this.querySelector('#loader-spinner');
        this.addBtn.disabled = false;

        // handle events
        this.addForm.addEventListener('submit', this.handleAddToCart.bind(this));
      }
      async handleAddToCart(e) {
        // prevent the screen from refreshing
        e.preventDefault();

        // set the button to disabled
        this.addBtn.disabled = true;

        // update the state of the btn UI
        this.toggleAddToCartButton(this.addBtn.disabled);

        const formData = new FormData(this.addForm);

        try {
          const res = await fetch(window.Shopify.routes.root + 'cart/add.js', {
            method: 'POST',
            body: formData,
          });

          const data = await res.json();
          console.log(data);

          // don't let the user click the button for atleast 0.6s
          // re-enable the button
          setTimeout(() => {
            this.addBtn.disabled = false;
            this.toggleAddToCartButton(this.addBtn.disabled);
          }, 600);
        } catch (e) {
          this.addBtnText.innerHTML('Error...');
          setTimeout(() => {
            this.addBtn.disabled = true;
            this.toggleAddToCartButton(this.addBtn.disabled);
          }, 1000);
        }
      }

      toggleAddToCartButton(isDisabled) {
        if (isDisabled) {
          this.addBtn.classList.add('adding');
          this.classList.add('disabled');
          this.addBtnText.innerHTML = '';
        } else {
          this.addBtn.classList.remove('adding');
          this.classList.remove('disabled');
          this.addBtnText.innerHTML = 'Add To Cart';
        }
      }
    }
  );
}
