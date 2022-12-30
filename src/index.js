import { fetchPixabay } from './js/fetchPixabay';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
form.addEventListener('submit', onSearch);

let page = 1;

// submit
async function onSearch(event) {
  event.preventDefault();
  //   const {
  //     elements: { searchQuery },
  //   } = event.currentTarget;
  //   const search = searchQuery.value;
  const search = event.currentTarget.elements.searchQuery.value;
  const res = await getData(search, page);
  createMarkup(res);
}

// fetch
async function getData(search, page) {
  try {
    const responce = await fetchPixabay(search, page);
    return responce.data.hits;
  } catch (error) {
    console.log('error :>> ', error.message);
  }
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
