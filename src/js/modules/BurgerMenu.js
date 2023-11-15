import Popup from '../helpers/Popup.js';
import Listeners from '../helpers/listeners.js'

const SELECTORS_MENU_BURGER = {
  BURGER: '[data-menu-burger]',
  BUTTON: '[data-menu-burger-button]',
  MENU: '[data-menu-burger]',
  MENU_BURGER_CONTENT: '[data-menu-burger-content]',
  MENU_LIST: '[data-menu-list]',
  FOCUSABLE_ELEMENTS: '[data-menu-burger-link]',
};

class BurgerMenu extends Popup {
  constructor() {
    super();
    this.element = document.querySelector(SELECTORS_MENU_BURGER.BURGER);
    this.burgerButton = document.querySelector(SELECTORS_MENU_BURGER.BUTTON);
    this.focusableEls = this.element.querySelectorAll(SELECTORS_MENU_BURGER.FOCUSABLE_ELEMENTS);
    this.menuBurgerContent = this.element.querySelector(SELECTORS_MENU_BURGER.MENU_BURGER_CONTENT);
    this.menuList = this.element.querySelector(SELECTORS_MENU_BURGER.MENU_LIST);
    this.open = this.burgerButton.getAttribute('aria-expanded') === 'true';

    this._listeners = new Listeners();
    this._listeners.add(this.burgerButton, 'click', this.onButtonClick.bind(this));
    this._listeners.add(this.menuBurgerContent, 'click', this.onClickOther.bind(this));

    this.firstFocusableEl = this.burgerButton;
    this.lastFocusableEl = this.focusableEls[this.focusableEls.length - 1];
    this.focusableEls.forEach((link) => this._listeners.add(link, 'click', this.onCloseMenu.bind(this)));

    this.KEYCODE_TAB = 9;
    this.KEYCODE_ESCAPE = 27;

  }

  /**
   * Initialize the menu functionality.
   */

  onButtonClick() {
    this.menuBurgerContent.classList.toggle('active');
    this.burgerButton.classList.toggle('menu-open');

    let menuClassName = this.menuBurgerContent.className;

    if (menuClassName.match(/active/)) {
      this.menuBurgerContent.removeAttribute('inert', '');
    } else {
      this.menuBurgerContent.setAttribute('inert', '');
    }

    this.html.classList.toggle('menu-open');
    this.toggleBodyLock(this.isMenuOpen);
    this.toggle(!this.open);

    if (this.open) {
      this._listeners.add(document, 'click', this.onClickOther.bind(this));
      this._listeners.add(document, 'keydown', this.pressKey.bind(this))
    } else {
      this._listeners.removeByElement(document);      
    }


  }

  onCloseMenu() {
    this.menuBurgerContent.classList.remove('active');
    this.burgerButton.firstElementChild.classList.remove('active');

    this.menuBurgerContent.setAttribute('inert', '');

    this.toggleBodyLock(false);
    this.html.classList.remove('menu-open');
    this.toggle(!this.open);

    this._listeners.removeByElement(document);    
  }

  trapFocus() {
    this._listeners.add(document, 'keydown', this.pressKey.bind(this));
  }

  toggle(open) {
    if (open === this.open) {
      return;
    }

    const body = document.getElementsByTagName('body');

    if (open) {
      Array.from(body).forEach((element) => {
        element.classList.add('hiddenAll');
      });
    } else {
      Array.from(body).forEach((element) => {
        element.classList.remove('hiddenAll');
      });
    }

    this.open = open;

    this.burgerButton.setAttribute('aria-expanded', `${open}`);
  }

  onClickOther(event) {
    if (!this.burgerButton.contains(event.target) && !this.menuList.contains(event.target)) {
      this.onCloseMenu();
    }
  }

  pressKey(event) {  
    const isTabPressed = event.key === 'Tab' || event.keyCode === this.KEYCODE_TAB;
    const isEscapePressed = event.key === 'Escape' || event.keyCode === this.KEYCODE_ESCAPE;

    if (isEscapePressed) {
      this.onCloseMenu();
      this.burgerButton.focus();
    }

    if (!isTabPressed) {
      return;
    }

    if (event.shiftKey) {
      if (document.activeElement === this.firstFocusableEl && this.open) {
        this.lastFocusableEl.focus();
        event.preventDefault();
      }
    } else {
      if (document.activeElement === this.lastFocusableEl) {
        this.firstFocusableEl.focus();
        event.preventDefault();
      }
    }
  }

  destroy() {
    this._listeners.removeAll();
  }


  /**
   * Open the menu.
   */
  menuOpen() {
    this.toggleBodyLock(true);
    this.html.classList.add('menu-open');
  }

  /**
   * Close the menu.
   */
  menuClose() {
    this.toggleBodyLock(false);
    this.html.classList.remove('menu-open');
  }

  get isMenuOpen() {
    return this.html.classList.contains('menu-open');
  }
}

export default BurgerMenu;
