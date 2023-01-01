import { Notify } from 'notiflix';
import { fetchPixabay } from './js/fetchPixabay';

const gallery = document.querySelector('.gallery');
const form = document.querySelector('#search-form');
const buttonLoad = document.querySelector('.load-more');
form.addEventListener('submit', onSearch);
buttonLoad.addEventListener('click', onLoadGallery);

buttonLoad.hidden = true;

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
  const {
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  } = res;
  const markup = res.reduce((acc, item) => {
    return (acc += `
    <div class="photo-card">
      <img class="card-image" src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          ${item.likes}
        </p>
        <p class="info-item">
          <b>Views</b>
          ${item.views}
        </p>
        <p class="info-item">
          <b>Comments</b>
          ${item.comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
          ${item.downloads}
        </p>
      </div>
    </div>`);
  }, '');
  gallery.insertAdjacentHTML('beforeend', markup);
}
