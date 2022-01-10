// IPR
// Client facing scripts here
$(document).ready(function() {
  // create HTML markup
  const createListElement = function(listObject) {
    const markup = `
      <article>
        <div>
        ${$(`<p>`).text(listObject.content.text).html()}
        </div>
        <footer>
          <div>
            <i>placeholder for time posted</i>
          </div>
        </footer>
      </article>
      `;
    return markup;
  };

  // render HTML markup
  const renderMarkup = function(listArr) {
    for (let listObject of listArr) {
      // Create HTML element
      const markup = createListElement(listObject);
      // Append item to container, newest to oldest
      // ADD LIST CONTAINER
      $('#tweets-container').prepend(markup);
    }
  };

  // GET items from db
  const getTweets = function() {
    // Get request - old items
    $.ajax({
      url: `/tweets/`,
      method: 'GET'
    })
      .done(listArr => {
        renderMarkup(listArr);
      })
      .fail(err => {
        console.log(`ERROR: ${err.message}`);
      })
      .always(()=> {
        console.log('Request to add list item has been executed');
      });
  };

  // POST item
  $('.new-tweet-form').on('submit', function(event) {
    event.preventDefault();
    console.log('Submit is being triggered');

    // Post request - new tweets
    const inputBox = $(this).children('#tweetText');
    const tweetText = inputBox.val();
    console.log(`Tweet: ${tweetText}`);


    // post to /tweets
    $.ajax({
      url: `/tweets/`,
      method: 'POST',
      data: $(this).serialize()
    }).then(function() {
      $('#tweetText').val("");
      $.get('/tweets/', (data) => {
        const latestTweet = data.slice(-1).pop();
        const latestTweetObj = createListElement(latestTweet);
        $('#tweets-container').prepend(latestTweetObj);
      });
    })
      .fail(err => {
        console.log(`ERROR: ${err.message}`);
      })

  });
  getTweets();
});
