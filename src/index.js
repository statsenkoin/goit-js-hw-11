import { fetchPixabay } from './js/fetch_pixabay';
import { showMessage } from './js/notify_message';
import { createMarkup } from './js/markup';
import { simpleLightbox } from './js/simple_lightbox';

let page = 1;
let userInput = '';
let pages = 1;
const perPage = 20;

const gallery = document.querySelector('.gallery');
const form = document.querySelector('#search-form');
const buttonLoad = document.querySelector('.load-more');

form.addEventListener('submit', onSearch);
buttonLoad.addEventListener('click', onLoadGallery);

buttonLoad.hidden = true;

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
  }
  if (userInput && pages >= page) await onLoadGallery();
}

function onCleanGallery() {
  gallery.innerHTML = '';
  buttonLoad.hidden = true;
  page = 1;
}

async function onLoadGallery() {
  const res = await getData();
  buttonLoad.hidden = true;
  createMarkup(res, gallery);
  simpleLightbox.refresh();
  if (pages > page) buttonLoad.hidden = false;
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
