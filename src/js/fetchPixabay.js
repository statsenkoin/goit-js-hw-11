import axios from 'axios';

const API_KEY = '32468715-2ee7d1cef437ed65ce73ff92a';
const BASE_URL = 'https://pixabay.com/api/';

const params = new URLSearchParams({
  key: API_KEY,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  //   per_page: 40,
  per_page: 20,
});

export async function fetchPixabay(search, page) {
  return await axios.get(`${BASE_URL}?q=${search}&page=${page}`, { params });
}

// ========================================================================
// const params = new URLSearchParams({
//   image_type: 'photo',
//   orientation: 'horizontal',
//   safesearch: true,
//   per_page: 40,
// });

// export async function fetchPixabay(search, page) {
//   return await axios.get(
//     `${BASE_URL}?key=${API_KEY}&q=${search}&page=${page}&${params}`
//   );
// }

// =========================================================================
// export async function fetchPixabay(search, page) {
//   const responce = await fetch(
//     `${BASE_URL}?key=${API_KEY}&q=${search}&${params}&page=${page}`
//   );
//   if (!responce.ok) throw new Error(responce.statusText);
//   return await responce.json();
// }

// export async function fetchPixabay(search, page) {
//   try {
//     const responce = await axios.get(
//       `${BASE_URL}?key=${API_KEY}&q=${search}&${params}&page=${page}`
//     );
//     console.log('responce :>> ', responce);
//     return responce;
//   } catch (error) {
//     console.log('error :>> ', error);
//   }
// }
