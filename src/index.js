import { Notify } from 'notiflix';
import { fetchPixabay } from './js/fetchPixabay';

// Описаний в документації
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('.gallery');
const form = document.querySelector('#search-form');
const buttonLoad = document.querySelector('.load-more');
form.addEventListener('submit', onSearch);
buttonLoad.addEventListener('click', onLoadGallery);

buttonLoad.hidden = true;

const simpleLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  close: true,
});

let page = 1;
let userInput = '';
let pages = 1;
const perPage = 20;

// submit
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
  const res = await getData(userInput, page, perPage);
  buttonLoad.hidden = true;
  createMarkup(res);
  simpleLightbox.refresh();
  if (pages > page) buttonLoad.hidden = false;
  page += 1;
}

// fetch
async function getData(userInput, page, perPage) {
  try {
    const responce = await fetchPixabay(userInput, page, perPage);
    pages = Math.ceil(responce.data.total / perPage);
    const searchResult = responce.data;
    showResourseInfoMessage(searchResult);
    return searchResult.hits;
  } catch (error) {
    console.log('error :>> ', error.message);
  }
}

function showResourseInfoMessage(searchResult) {
  const totalHits = searchResult.totalHits;
  if (page === 1 && searchResult.hits.length) {
    Notify.success(`Hooray! We found ${totalHits} images.`);
  }
  if (!searchResult.hits.length) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  if (pages === page) {
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
}

function createMarkup(res) {
  const markup = res.reduce(
    (
      acc,
      { webformatURL, largeImageURL, tags, likes, views, comments, downloads }
    ) => {
      return (acc += `<div class="photo-card">
      <a href="${largeImageURL}">
        <img 
          class="card-image" 
          src="${webformatURL}" 
          alt="${tags}" 
          loading="lazy"
        />
      </a>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          ${likes}
        </p>
        <p class="info-item">
          <b>Views</b>
          ${views}
        </p>
        <p class="info-item">
          <b>Comments</b>
          ${comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
          ${downloads}
        </p>
      </div>
    </div>`);
    },
    ''
  );
  gallery.insertAdjacentHTML('beforeend', markup);
}
