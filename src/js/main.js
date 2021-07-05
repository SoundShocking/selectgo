import './components/calc'
import Swiper, { Navigation, EffectCoverflow, Lazy } from 'swiper';
import Modal from 'bootstrap/js/dist/modal';
import Offcanvas from 'bootstrap/js/dist/offcanvas';
import Collapse from 'bootstrap/js/dist/collapse';

Swiper.use([Navigation, EffectCoverflow, Lazy]);

const $modalOrder = document.getElementById('modalOrder');
const $modalOrderSuccess = document.getElementById('modalOrderSuccess');
const $modalOrderTariff = document.getElementById('modalOrderTariff');
const $modalOrderSearch = document.getElementById('modalOrderSearch');
const $modalTariffDescription = document.getElementById('modalTariffDescription');
const $modalSubscribeSuccess = document.getElementById('modalSubscribeSuccess');

const modalOrder = new Modal($modalOrder);
const modalOrderSuccess = new Modal($modalOrderSuccess);
const modalOrderTariff = new Modal($modalOrderTariff);
const modalOrderSearch = new Modal($modalOrderSearch);
const modalTariffDescription = new Modal($modalTariffDescription);
const modalSubscribeSuccess = new Modal($modalSubscribeSuccess);

const offcanvasCall = new Offcanvas(document.getElementById('offcanvasCall'));
const offcanvasQuestion = new Offcanvas(document.getElementById('offcanvasQuestion'));
const offcanvasContacts = new Offcanvas(document.getElementById('offcanvasContacts'));
const offcanvasMenu = new Offcanvas(document.getElementById('offcanvasMenu'));

// modalOrder.show();
// modalOrderSuccess.show();
// modalOrderTariff.show();
// modalOrderSearch.show();
// modalTariffDescription.show();
// modalSubscribeSuccess.show();

const instagramSlider = document.querySelector('.instagram__slider');
const reviewsSlider = document.querySelector('.reviews__slider');
const homeServiceSlider = document.querySelector('.home-services__slider');
const $tariffButtons = document.querySelectorAll('.tariff__button');

if (instagramSlider) {
  new Swiper(instagramSlider, {
    loop: true,
    slidesPerView: 3,
    spaceBetween: 15,
    navigation: {
      nextEl: document.querySelector('.instagram__navigation-next'),
      prevEl: document.querySelector('.instagram__navigation-prev'),
    },
    breakpoints: {
      0: {
        slidesPerView: 1
      },
      768: {
        slidesPerView: 3
      },
    },
    lazy: true,
    preloadImages: true,
    on: {
      lazyImageReady: function (swiper, sliderEl, imageEl) {
        console.log('image load')
        console.log(swiper, sliderEl, imageEl)
      }
    }
  })
}

if (reviewsSlider) {
  new Swiper(reviewsSlider, {
    loop: true,
    slidesPerView: 3,
    spaceBetween: 15,
    navigation: {
      nextEl: document.querySelector('.reviews__navigation-next'),
      prevEl: document.querySelector('.reviews__navigation-prev'),
    },
    breakpoints: {
      0: {
        slidesPerView: 1
      },
      768: {
      },
      992: {
        spaceBetween: 25
      }
    },
    // preloadImages: false,
    // lazy: true
  })
}

if (homeServiceSlider) {
  new Swiper(homeServiceSlider, {
    loop: true,
    slidesPerView: 5,
    spaceBetween: 20,
    lazy: true,
    preloadImages: true,
    on: {
      lazyImageReady: function (swiper, sliderEl, imageEl) {
        console.log('image load')
        console.log(swiper, sliderEl, imageEl)
      }
    }
  })
}

// document.querySelector('.offcanvas-call__toggle').addEventListener('click', e => {
//   e.stopPropagation();
//   offcanvasCall.toggle();
// })

// document.querySelector('.offcanvas-question__toggle').addEventListener('click', e => {
//   e.stopPropagation();
//   offcanvasQuestion.toggle();
// })

// document.querySelector('.offcanvas-contacts__toggle').addEventListener('click', e => {
//   e.stopPropagation();
//   offcanvasContacts.toggle();
// })

// document.querySelector('.header__burger').addEventListener('click', e => {
//   e.stopPropagation();
//   offcanvasMenu.toggle();
// })

if ($tariffButtons.length) {
  $tariffButtons.forEach(el => {
    el.addEventListener('click', e => {
      const $tariffInfo = e.target.closest('.tariff__info');
      const tariffName = $tariffInfo.querySelector('.tariff__name').textContent.trim();

      const $modalTariffTitle = $modalOrderTariff.querySelector('.modal-order-tariff__title');
      const $inputTariff = $modalOrderTariff.querySelector('input[name="tariff"]');
      $modalTariffTitle.querySelector('span').textContent = `“${tariffName}”`;
      $inputTariff.value = tariffName;
      modalOrderTariff.show();
    })
  })
}

function check_webp_feature(feature, callback) {
  var kTestImages = {
    lossy: "UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",
    lossless: "UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==",
    alpha: "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==",
    animation: "UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA"
  };
  var img = new Image();
  img.onload = function () {
    var result = (img.width > 0) && (img.height > 0);
    callback(feature, result);
  };
  img.onerror = function () {
    callback(feature, false);
  };
  img.src = "data:image/webp;base64," + kTestImages[feature];
}

check_webp_feature('lossy', function (feature, isSupported) {
  if (isSupported) {
    document.body.classList.add('webp');
  } else {
    document.body.classList.add('no-webp');
  }
});

const header = document.querySelector('header.header');
document.addEventListener('scroll', e => {
  const scrollDistance = window.scrollY;

  if (scrollDistance >= 1000) {
    header.classList.add('header--sticky');
  } else {
    header.classList.remove('header--sticky');
  }
})

const $amenuTrigger = document.querySelector('.amenu__trigger');
const $amenu = document.querySelector('.amenu');

if ($amenuTrigger && $amenu) {
  $amenuTrigger.addEventListener('click', (e) => {
    $amenu.classList.toggle('amenu--active');
    $amenuTrigger.classList.toggle('amenu__trigger--active');
    e.stopPropagation();
  })

  document.addEventListener('click', e => {
    console.log(e.target);
    const closest = e.target.closest('.amenu');
    console.log('closest: ', closest);
    console.log($amenu.classList.contains('amenu--active'))
    if (!closest && $amenu.classList.contains('amenu--active')) {
      $amenu.classList.remove('amenu--active')
      $amenuTrigger.classList.remove('amenu__trigger--active')
    }
    // $amenu.classList.remove('amenu--active')
  })
}