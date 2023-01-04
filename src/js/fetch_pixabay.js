import axios from 'axios';

const API_KEY = '32468715-2ee7d1cef437ed65ce73ff92a';
const BASE_URL = 'https://pixabay.com/api/';

const params = new URLSearchParams({
  key: API_KEY,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
});

export async function fetchPixabay(search, page, perPage) {
  return await axios.get(
    `${BASE_URL}?q=${search}&page=${page}&per_page=${perPage}`,
    { params }
  );
}
