import { fetchPixabay } from './js/fetch_pixabay';
import { showMessage } from './js/notify_message';
import { createMarkup } from './js/markup';
import { simpleLightbox } from './js/simple_lightbox';
import { scrollGallery } from './js/scroll_gallery';

let userInput = '';
let page = 1;
let pages = 1;
const perPage = 40;

let observerOptions = {
  root: null,
  rootMargin: '500px',
  threshold: 1.0,
};

// ==========================================================
const isInfiniteScroll = true;
// ==========================================================

const gallery = document.querySelector('.gallery');
const form = document.querySelector('#search-form');
const buttonLoad = document.querySelector('.load-more');
const observerTarget = document.querySelector('.observer-target');

form.addEventListener('submit', onSearch);
buttonLoad.addEventListener('click', onLoadGallery);

let observer = new IntersectionObserver(handleIntersect, observerOptions);

async function onSearch(event) {
  event.preventDefault();

  //   const {
  //     elements: { searchQuery },
  //   } = event.currentTarget;
  //   const newUserInput = searchQuery.value;
  const newUserInput = event.currentTarget.elements.searchQuery.value.trim();

  if (userInput !== newUserInput) {
    userInput = newUserInput;
    pages = 1;
    onCleanGallery();
    observer.unobserve(observerTarget);
  }
  if (userInput && pages >= page) {
    isInfiniteScroll ? observer.observe(observerTarget) : await onLoadGallery();
  }
}

function onCleanGallery() {
  gallery.innerHTML = '';
  observerTarget.textContent = '';
  buttonLoad.hidden = true;
  page = 1;
}

async function onLoadGallery() {
  const res = await getData();
  observerTarget.textContent = '';
  buttonLoad.hidden = true;
  createMarkup(res, gallery);
  simpleLightbox.refresh();
  if (pages === page) {
    observerTarget.textContent =
      "We're sorry, but you've reached the end of search results.";
  }
  if (page > 1 && !isInfiniteScroll) scrollGallery(gallery);
  if (pages > page && !isInfiniteScroll) buttonLoad.hidden = false;
  page += 1;
}

async function getData() {
  try {
    const responce = await fetchPixabay(userInput, page, perPage);
    pages = Math.ceil(responce.data.total / perPage);
    const searchResult = responce.data;
    showMessage(searchResult, page, pages);
    return searchResult.hits;
  } catch (error) {
    console.log('error :>> ', error.message);
  }
}

function handleIntersect(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) onLoadGallery();
    if (pages < page) {
      observer.unobserve(observerTarget);
    }
  });
}
