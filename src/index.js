import { fetchPixabay } from './js/fetchPixabay';

const form = document.querySelector('#search-form');
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
  console.log('res :>> ', res);
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

function createMarkup(res) {}

// webformatURL - посилання на маленьке зображення для списку карток.
// largeImageURL - посилання на велике зображення.
// tags - рядок з описом зображення. Підійде для атрибуту alt.
// likes - кількість лайків.
// views - кількість переглядів.
// comments - кількість коментарів.
// downloads - кількість завантажень.
