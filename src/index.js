import { fetchPixabay } from './js/fetchPixabay';

const gallery = document.querySelector('.gallery');
const form = document.querySelector('#search-form');
const buttonSubmit = document.querySelector(
  '#search-form button[type="submit"]'
);
const buttonLoad = document.querySelector('.load-more');
form.addEventListener('submit', onSearch);
buttonLoad.addEventListener('click', onLoad);

let page = 1;
let query = '';
let pages = 0;
const perPage = 20;

// fetch
async function getData(query, page) {
  try {
    const responce = await fetchPixabay(query, page);
    // console.log('responce :>> ', responce.data.total);
    pages = Math.ceil(responce.data.total / perPage);
    return responce.data.hits;
  } catch (error) {
    console.log('error :>> ', error.message);
  }
}

// submit
async function onSearch(event) {
  event.preventDefault();
  //   const {
  //     elements: { searchQuery },
  //   } = event.currentTarget;
  //   const search = searchQuery.value;
  const newQuery = event.currentTarget.elements.searchQuery.value.trim();
  if (query !== newQuery) {
    query = newQuery;
    page = 1;
    buttonLoad.disabled = false;
    onClean();
  }
  await onLoad();
}

async function onLoad() {
  const res = await getData(query, page, perPage);
  createMarkup(res);
  if (pages === page) {
    console.log('pages === page');
    buttonLoad.disabled = true;
  }
  page += 1;
}

function onClean() {
  gallery.innerHTML = '';
}

function createMarkup(res) {
  console.log('res :>> ', res);
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
