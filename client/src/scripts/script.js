import Swiper from 'swiper/bundle';
import { addImage, deleteImage, getAllImages } from '../http/carouselApi.js';
import 'swiper/swiper-bundle.css';

const inputAdd = document.querySelector('#imageAdd').addEventListener('input', onAddImage);
const inputAddSpan = document.querySelector('#imageAddSpan');

const modal = document.querySelector('.main__modal');
modal.addEventListener('click', () => {
  modal.classList.remove('active');
})
const modalImage = document.querySelector('#modalImage');
modalImage.addEventListener('click', (e) => {
  e.stopPropagation()
})
const modalButton = document.querySelector('.main__modal-button').addEventListener('click', onDeleteImage);

const swiper = new Swiper('.swiper', {
  loop: false,
  slidesPerView: 2,
  slidesPerGroup: 1,
  spaceBetween: 5,
  centeredSlides: false,
  grabCursor: true,
  pagination: {
    el: '.swiper-pagination',
    type: 'bullets',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    541: {
      slidesPerView: 2
    },
    768: {
      slidesPerView: 3,
    },
    960: {
      slidesPerView: 4,
    },
    1200: {
      slidesPerView: 5
    },
  }
});

getAllImages().then(data => {
  data.sort((a, b) => a.index - b.index);
  data.forEach(item => {
    const slide = document.createElement('div');
    const image = document.createElement('img');
    const lazyPreloader = document.createElement('div');
    image.addEventListener('click', (e) => {
      modal.classList.add('active');
      modalImage.src = e.target.src;
      modalImage.removeAttribute('style');
      if(window.innerWidth <= 540) {
        modalImage.style.width = window.innerWidth - 30 + 'px';
        modalImage.style.height = window.innerWidth - 30 + 'px';
      }
    })
    slide.classList.add('swiper-slide');
    image.loading = 'lazy';
    image.src = `${process.env.APP_API_URL}/${item}`;
    lazyPreloader.classList.add('swiper-lazy-preloader');
    slide.appendChild(image);
    slide.appendChild(lazyPreloader);
    swiper.appendSlide(slide);
  });
})

function onAddImage(e) {
  const loading = document.createElement('div');
  loading.classList.add('loading');
  inputAddSpan.style.width = inputAddSpan.offsetWidth + 'px';
  inputAddSpan.style.height = inputAddSpan.offsetHeight + 'px';
  inputAddSpan.innerHTML = '';
  this.disabled = true;
  inputAddSpan.appendChild(loading);
  const image = e.target.files[0];
  const formData = new FormData();
  formData.append('img', image)
  addImage(formData).then(data => {
    e.target.value = '';
    inputAddSpan.innerHTML = 'Загрузить фотографию';
    inputAddSpan.removeAttribute("style");
    this.disabled = false;
    getAllImages().then(dataImages => {
      dataImages.forEach(item => {
        const existingSlide = Array.from(swiper.slides).find(slide => {
          const imgElement = slide.querySelector('img');
          return imgElement.src === `${process.env.APP_API_URL}/${item}`;
        });
        if (!existingSlide) {
          const slide = document.createElement('div');
          const image = document.createElement('img');
          const lazyPreloader = document.createElement('div');
          image.addEventListener('click', (e) => {
            modal.classList.add('active');
            modalImage.src = e.target.src;
          })
          slide.classList.add('swiper-slide');
          image.loading = 'lazy';
          image.src = `${process.env.APP_API_URL}/${item}`;
          lazyPreloader.classList.add('swiper-lazy-preloader')

          slide.appendChild(image);
          slide.appendChild(lazyPreloader);
          swiper.appendSlide(slide);
        }
      });
    })
  }).catch(e => console.log(e))
}

function onDeleteImage(e) {
  e.stopPropagation();
  const loading = document.createElement('div');
  loading.classList.add('loading');
  this.style.height = this.offsetHeight + 'px';
  this.style.width = this.offsetWidth + 'px';
  this.innerHTML = '';
  this.disabled = true;
  this.appendChild(loading);
  const imageName = modalImage.src.replace(`${process.env.APP_API_URL}/`, '')
  deleteImage(imageName).then(data => {
    this.innerHTML = 'Удалить фотографию';
    modal.classList.remove('active');
    this.removeAttribute('style');
    this.disabled = false;
     swiper.slides.forEach((item, i) => {
      const itemImage = item.querySelector('img');
      if(itemImage.src.includes(imageName)) {
        swiper.removeSlide(i)
      }
     })
  }).catch(e => console.log(e))
}