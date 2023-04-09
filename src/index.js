import './sass/index.scss';
import NewsApiService from './js/api-service';
import { lightbox } from './js/lightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const newsApiService = new NewsApiService();
let shownHits = 0;

const searchFormEl = document.querySelector('.search-form');
const galleryContainerEL = document.querySelector('.gallery-items');
const loadMoreBtnEl = document.querySelector('.load-more');

searchFormEl.addEventListener('submit', onSearch);
loadMoreBtnEl.addEventListener('click', onLoadMore);


function onSearch(event) {
  event.preventDefault();
  
  galleryContainerEL.innerHTML = '';
  newsApiService.query = event.currentTarget.elements.searchQuery.value.trim();
  newsApiService.resetPage();

  if (newsApiService.query === '') {
    Notify.warning('Please, fill the main field');
    loadMoreBtnEl.classList.add('is-hidden');
    return;
  }

  shownHits = 0;
  fetchGalleryItems();
}

function onLoadMore() {
  newsApiService.incrementPage();
  fetchGalleryItems();
}

async function fetchGalleryItems() {
  const result = await newsApiService.fetchGallery();
  const { hits, totalHits } = result;
  shownHits += hits.length;
  
  if (!hits.length) {
    Notify.failure(
      `Sorry, there are no images matching your search query. Please try again.`
    );
    loadMoreBtnEl.classList.add('is-hidden');
    return;
  }

  onRenderGallery(hits);
  
  if(totalHits <= 40) {
    loadMoreBtnEl.classList.add('is-hidden');
  }
  else {
    loadMoreBtnEl.classList.remove('is-hidden');
  }


  if (shownHits <= totalHits) {
    Notify.success(`Hooray! We found ${totalHits - shownHits || totalHits} images !!!`);
    return;
  }

  if (shownHits >= totalHits) {
    Notify.info("We're sorry, but you've reached the end of search results.");
    loadMoreBtnEl.classList.add('is-hidden');
  }
}

function onRenderGallery(elements) {
  const markup = elements
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
    <a href="${largeImageURL}">
      <img class="photo-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
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
    </div>`;
      }
    )
    .join('');
  galleryContainerEL.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}
