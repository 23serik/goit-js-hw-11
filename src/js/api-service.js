import axios from 'axios';

const API_KEY = '35181841-9fecac201a9845ea64ff3e056'
const ITEMS_PER_PAGE = 40;
const INIT_PAGE = 1;

export default class NewsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = INIT_PAGE;
    this.items_per_page = ITEMS_PER_PAGE;
  }

  async fetchGallery() {
    const axiosOptions = {
      method: 'get',
      url: 'https://pixabay.com/api/',
      params: {
        key: API_KEY,
        q: `${this.searchQuery}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: `${this.page}`,
        per_page: `${this.items_per_page}`,
      },
    };

    try {
      const { data } = await axios(axiosOptions);
      return data;
    } catch (err) {
      console.error(err);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  resetEndOfHits() {
    this.endOfHits = false;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
