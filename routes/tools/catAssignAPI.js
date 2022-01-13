const axios = require('axios').default;

/** RESTAURANTS */
function checkRestaurants(taskDescription) {
  return axios({
    method: 'get',
    url: 'https://api.yelp.com/v3/businesses/search',
    params: {
      term: `${taskDescription}`,
      categories: 'restaurants',
      location: 'toronto'
    },
    headers: {
      Authorization:
        'Bearer rvJqW1cJQnq4DGs813g5mb2OMzx2xbMWepAymEjOTww6F_ZA56bRYRBqQWLPrvBVym-VD7Ky2rJJEOAJItZUEbVukOgDyAa6E1WQ1FqX6Cz_bKCnRPorDzYMquHcYXYx'
    }
  })
    .then((res) => {
      // console.log(res.data.businesses)
      const restaurantArr = res.data.businesses
        .filter((business) => (business.rating >= 3) & (business.review_count > 10))
        .map((business) => business.review_count);
      console.log('restaurant API complete')
      return { restaurant: restaurantArr.length > 0 ? true : false };
    })
    .catch((err) => {
      console.log(err.message);
      return { restaurant: false };
    });
  }

  /** MOVIES */
  function checkMovies(taskDescription) {
    return axios({
      method: 'get',
      url: 'https://api.themoviedb.org/3/search/movie',
      params: {
        api_key: 'b5de8465e12bd91ba8a8402b92f34e93',
        query: `${taskDescription}`
      }
    })
    .then((res) => {
      const movieArr = res.data.results.filter((movie) => movie.vote_count > 500).map((movie) => movie.vote_count);
      console.log('movie API complete')
      return { movie: movieArr.length > 0 ? true : false };
    })
    .catch((err) => {
      console.log(err.message);
      return { movie: false };
    });
  }

  /** BOOKS */
  function checkBooks(taskDescription) {
    //https://developers.google.com/books/docs/v1/using
    return axios({
      method: 'get',
      url: 'https://www.googleapis.com/books/v1/volumes',
      params: {
        // api_key: 'b5de8465e12bd91ba8a8402b92f34e93',
        q: `intitle:${taskDescription}`
      }
    })
    .then((res) => {
      let items = res.data.items;
      booksArr = items
      .filter((items) => items.volumeInfo)
      .filter((item) => item.volumeInfo.ratingsCount && item.volumeInfo.ratingsCount > 5)
      .map((item) => item.volumeInfo.ratingsCount);
      console.log('book API complete')
      return { book: booksArr.length > 0 ? true : false };
    })
    .catch((err) => {
      console.log(err.message);
      return { book: false };
    });
  }

/** CATEGORIZER */
const catAssignerAPI = function(taskDescription) {
  const restaurantProm = checkRestaurants(taskDescription);
  const movieProm = checkMovies(taskDescription);
  const bookProm = checkBooks(taskDescription);

  return Promise.all([ restaurantProm, movieProm, bookProm ])
    .then((arr) => {
      console.log('category Assigner API complete')
      return arr.filter((catObj) => Object.values(catObj)[0]).map((catObj) => Object.keys(catObj)[0]);
    }) // return array of categories that have HITS
    .catch((err) => {
      console.log(err.message);
      return [];
    });
};
module.exports = catAssignerAPI;
