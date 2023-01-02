import { Notify } from 'notiflix';

export function showMessage(searchResult, page, pages) {
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
