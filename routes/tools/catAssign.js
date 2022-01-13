const categoryAssigner = function(text) {
  const allKeyWords = [
    'movie',
    'watch',
    'show',
    'drama',
    'Netflix',
    'Hulu',
    'Disney',
    'HBO',
    'cartoon',
    'anime',
    'Crunchyroll',
    'cable',
    'restaurant',
    'dinner',
    'eat',
    'takeout',
    'food',
    'menu',
    'dine',
    'lunch',
    'brunch',
    'drink',
    'tea',
    'bar',
    'cafe',
    'book',
    'read',
    'library',
    'more',
    'buy'
  ];

  let keyWord = '';
  for (let word of allKeyWords) {
    if (text.toLowerCase().includes(word.toLowerCase())) {
      keyWord = word;
      break;
    } else {
      keyWord = '';
    }
  }

  const categoryKeys = {
    movie: [
      'movie',
      'watch',
      'show',
      'drama',
      'Netflix',
      'Hulu',
      'Disney',
      'HBO',
      'cartoon',
      'anime',
      'Crunchyroll',
      'cable'
    ],
    restaurant: [
      'restaurant',
      'dinner',
      'eat',
      'takeout',
      'food',
      'menu',
      'dine',
      'lunch',
      'brunch',
      'drink',
      'tea',
      'bar',
      'cafe'
    ],
    book: [ 'book', 'read', 'library' ],
    product: [ 'more', 'buy' ]
  };

  let category = undefined;
  if (categoryKeys['movie'].includes(keyWord)) category = 'movie';
  if (categoryKeys['restaurant'].includes(keyWord)) category = 'restaurant';
  if (categoryKeys['book'].includes(keyWord)) category = 'book';
  if (categoryKeys['product'].includes(keyWord)) category = 'product';

  return category;
};

module.exports = categoryAssigner;
