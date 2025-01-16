class TopHeader extends HTMLElement {
  constructor() {
    super();
    this.nav = this.querySelector('.header__nav-bar');
    this.hamburger = this.querySelector('#hamburger');
    this.headerElements = [this.nav, this.hamburger];
    this.outerLinks = [...this.nav.querySelectorAll('li.has-submenu')];
    this.hasTitleLinksClickListener = false;
    this.isSticky = this.parentElement.classList.contains('header--sticky') ? true : false; // returns true if the sticky nav is enabled
    this.hamburger.addEventListener('click', this.handleHamburgerClick.bind(this));
    window.addEventListener('resize', this.handleWindowResize.bind(this));
    window.addEventListener('load', this.handleWindowResize.bind(this));
    if (this.isSticky) {
      this.handleStickyNavSettings();
    }
  }

  handleHamburgerClick() {
    // toggle the active state of the hamburger
    if (this.hamburger.classList.contains('open')) {
      this.headerElements.forEach((item) => item.classList.remove('open'));
      document.querySelector('body').style.overflowY = 'visible';
    } else {
      this.headerElements.forEach((item) => item.classList.add('open'));
      document.querySelector('body').style.overflowY = 'hidden';
    }
  }

  handleMBTitleLinkClick(e, link) {
    e.preventDefault();
    // show the submenu, if it exists
    link.classList.contains('has-submenu') && !link.classList.contains('open')
      ? link.classList.add('open')
      : link.classList.remove('open');
  }

  handleStickyNavSettings() {
    // get the nav
    const header = this.parentElement;

    // get the first section on the page
    const firstSection = document.querySelector('#main section'); // gets the first section within <main></main>

    // add spacing equal to the height of the nav and then some
    const observer = new ResizeObserver((entries) => {
      firstSection.style.paddingTop = entries[0].contentRect.height + 50 + 'px';
    });
    observer.observe(header);
  }

  removeMBTitleEvents() {
    this.outerLinks.forEach((link) => {
      link.classList.remove('open');
      link.querySelector('a').removeEventListener('click', link._clickHandler);
      delete link._clickHandler;
    });
    this.hasTitleLinksClickListener = false;
  }

  addMbTitleEvents() {
    this.outerLinks.forEach((link) => {
      link._clickHandler = (e) => this.handleMBTitleLinkClick(e, link);
      link.querySelector('a').addEventListener('click', link._clickHandler);
    });
    this.hasTitleLinksClickListener = true;
  }

  handleWindowResize() {
    // default mobile breakpoint = 768px
    const BP = 768;
    if (window.innerWidth <= BP) {
      if (!this.hasTitleLinksClickListener) {
        this.addMbTitleEvents();
      }
    } else {
      if (this.hasTitleLinksClickListener) {
        this.removeMBTitleEvents();
      }
    }
  }
}
customElements.define('top-header', TopHeader);

class MenuDrawer extends HTMLElement {
  constructor() {
    super();
    this.targets = Array.from(document.querySelectorAll(`[data-target='${this.id}']`));
    this.content = this.querySelector('[data-drawer="content"');
    this.overlay = document.querySelector('[data-drawer="overlay"');
    this.handleOpenCloseEvents();

    this.overlay.addEventListener('click', () => {
      this.closeDrawer();
    });
  }

  handleOpenCloseEvents() {
    this.targets.forEach((target) => {
      const action = target.getAttribute('data-drawer');
      if (action == 'open') {
        target.addEventListener('click', this.openDrawer.bind(this));
      } else if (action == 'close') {
        target.addEventListener('click', this.closeDrawer.bind(this));
      }
    });
  }

  openDrawer() {
    this.overlay.classList.add('active');
    this.content.classList.add('active');
    // disable the sroll on the body
    document.querySelector('body').style.overflowY = 'hidden';
  }

  closeDrawer() {
    this.overlay.classList.remove('active');
    this.content.classList.remove('active');
    // enable the sroll on the body
    document.querySelector('body').style.overflowY = 'visible';
  }
}
customElements.define('menu-drawer', MenuDrawer);
