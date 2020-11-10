const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');

function showLoadingSpinner() {
  loader.hidden = false;
  quoteContainer.hidden = true;
}

function removeLoadingSpinner() {
  if (!loader.hidden) {
    quoteContainer.hidden = false;
    loader.hidden = true;
  }
}

// Get Quote From API
//using "http://api.allorigins.win/get?url="
//instead of "https://cors-anywhere.herokuapp.com/"

async function getQuote() {
  showLoadingSpinner();
  const proxyUrl = 'http://api.allorigins.win/get?url=';
  const apiUrl = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
  try {
    const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
    const data = await response.json();
    const quoteObj = JSON.parse(data.contents);
    //If Authoe balnk, add Unknown
    if (quoteObj.quoteAuthor === '') {
      authorText.innerText = 'Unknown';
    } else {
      authorText.innerText = quoteObj.quoteAuthor;
    }
    //make font smaller for quotes longer than 120 characters
    if (quoteObj.quoteText.length > 120) {
      quoteText.classList.add('long-quote');
    } else {
      quoteText.classList.remove('long-quote');
    }
    quoteText.innerText = quoteObj.quoteText;

    removeLoadingSpinner();
  } catch (error) {
    getQuote();
    console.log('whoops, no quote', error);
  }
}

// Tweet Quote
function tweetQuote() {
  const quote = quoteText.innerText;
  const author = authorText.innerText;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - author=${author}`;
  window.open(twitterUrl, '_blank');
}

//Event Listeners
newQuoteBtn.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweetQuote);

// On Load
getQuote();
