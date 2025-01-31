import Swiper from 'swiper';
import {Navigation, Pagination} from 'swiper/modules';
import 'swiper/css';

const container = document.querySelector('.container');

// PLAYER
const playerElements = container.querySelectorAll('.player');

const initPlayer = (player) => {
  const query = '?rel=0&showinfo=0&autoplay=1';
  let iframe;
  const videoHref = player.dataset.src + query;
  const videoPlaceholderElement = player.querySelector('.player__placeholder');
  const playerButtonElement = player.querySelector('.player__button');

  const createIframe = () => {
    iframe = document.createElement('iframe');

    iframe.classList.add('player__video');
    iframe.setAttribute('src', videoHref);
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('title', 'YouTube video player');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
    iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    iframe.setAttribute('allowfullscreen', '');
  };

  const onPlayerButtonClick = (evt) => {
    evt.preventDefault();
    createIframe();
    videoPlaceholderElement.remove();
    playerButtonElement.remove();
    player.append(iframe);
  };

  const registerButtonEvents = () => {
    if (player) {
      playerButtonElement.addEventListener('click', onPlayerButtonClick);
    }
  };

  registerButtonEvents();
};

const initAllPlayers = () => {
  if (playerElements.length) {
    playerElements.forEach((player) => {
      initPlayer(player);
    });
  }
};

// SLIDER
const mWidth = 1020;

const tabletWidthOnlyMediaQuery = window.matchMedia(`(max-width: ${mWidth - 1}px)`);
const desktopWidthMediaQuery = window.matchMedia(`(min-width: ${mWidth}px)`);

const sliderElements = container.querySelectorAll('.slider');


const initSlider = (sliderElement) => {
  let slider;
  let sliderNavigationPrevElement;
  let sliderNavigationNextElement;
  let swiperElement;
  let sliderPaginatonElement;

  if (sliderElement) {
    swiperElement = sliderElement.querySelector('.slider__swiper');

    sliderNavigationPrevElement = sliderElement.querySelector('.swiper-button-prev');
    sliderNavigationNextElement = sliderElement.querySelector('.swiper-button-next');
    sliderPaginatonElement = sliderElement.querySelector('.slider__pagination');
  }

  const resizeObserver = new ResizeObserver((entries) => {
    entries.forEach(() => {
      slider.updateAutoHeight(300);
    });
  });

  const createSlider = () => {
    slider = new Swiper(swiperElement, {
      modules: [Navigation, Pagination],
      slidesPerView: 1,
      spaceBetween: 10,
      loop: true,
      init: false,
      autoHeight: true,
      slideActiveClass: 'slider__slide--active',
      navigation: {
        nextEl: sliderNavigationNextElement,
        prevEl: sliderNavigationPrevElement,
      },
      pagination: {
        el: sliderPaginatonElement,
        clickable: true,
        bulletClass: 'slider__pagination-button',
        bulletActiveClass: 'slider__pagination-button--active',
        renderBullet: function (index, className) {
          return `<button class="${className}" type="button">
                    <span class="visually-hidden">Cлайд ${index + 1}</span>
                  </button>`;
        },
      },
      breakpoints: {
        700: {
          slidesPerView: 2,
          spaceBetween: 25,
        },
      },
    });

    slider.init();
    slider.slides.forEach((slide) => {
      resizeObserver.observe(slide);
    });
  };

  const destroySlider = () => {
    if (slider) {
      slider.destroy(true, true);
    }
  };

  const registerResizeWindowEvents = () => {
    tabletWidthOnlyMediaQuery.addEventListener('change', (evt) => {
      if (evt.matches) {
        createSlider();
      }
    });

    desktopWidthMediaQuery.addEventListener('change', (evt) => {
      if (evt.matches) {
        destroySlider();
      }
    });
  };

  const initSliderElement = () => {
    if (sliderElement) {
      createSlider();
      registerResizeWindowEvents();

      if (window.innerWidth >= mWidth) {
        destroySlider();
      }
    }
  };

  initSliderElement();
};

const initAllSliders = () => {
  if (sliderElements.length) {
    sliderElements.forEach((slider) => {
      initSlider(slider);
    });
  }
};

// FEATURES-CARDS

const featuresCardElements = container.querySelector('.features-list');

const openDescription = (evt) => {
  const card = evt.target.closest('.feature-card');
  const descriptionWrapper = card.querySelector('.feature-card__description-wrapper');
  const description = card.querySelector('.feature-card__description');

  const descriptionHeight = description.offsetHeight;
  descriptionWrapper.style.height = `${descriptionHeight}px`;

  evt.target.closest('.feature-card__button').classList.add('button-plus--active');
};

const closeDescription = (evt) => {
  const card = evt.target.closest('.feature-card');
  const descriptionWrapper = card.querySelector('.feature-card__description-wrapper');

  descriptionWrapper.style.height = 0;

  evt.target.closest('.feature-card__button').classList.remove('button-plus--active');
};

const onCardButtonClick = (evt) => {
  if (evt.target.closest('.feature-card__button')) {

    if (!evt.target.closest('.feature-card__button').classList.contains('button-plus--active')) {
      openDescription(evt);
    } else {
      closeDescription(evt);
    }
  }
};

const registerFeaturesCardsEvents = () => {
  if (featuresCardElements) {
    featuresCardElements.addEventListener('click', onCardButtonClick);
  }
};

// BOOTSTRAP
window.addEventListener('DOMContentLoaded', () => {
  initAllPlayers();
  initAllSliders();
  registerFeaturesCardsEvents();
});
