/**** Begin Loader Class ****/
class Loader {
  //1. select DOM elements, and keep track of any useful data
  constructor(loadingContentElement, classList = ['loader'], id = 'loader') {
    this.loadingContentElement = loadingContentElement;
    this.loaderHTML = `<div class="${classList.join(' ')}" id="${id}"></div>`;
    this.loadingContentElement.insertAdjacentHTML('afterend', this.loaderHTML);
    this.loaderElement = document.getElementById('loader');
  }
  // Methods
  show() {
    this.loaderElement.hidden = false;
    this.loadingContentElement.hidden = true;
  }
  //hide the loader
  hide() {
    this.loaderElement.hidden = true;
    this.loadingContentElement.hidden = false;
  }
}
/**** End Loader Class ****/

const quoteContainer = document.getElementById('quote-container');
const faIcon = document.getElementById('fa-icon');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = new Loader(quoteContainer);
let previousQuoteObjString;
let sameQuoteCount = 0;

// Get Quote From API
//using "http://api.allorigins.win/get?url="
//instead of "https://cors-anywhere.herokuapp.com/"

async function getQuote() {
  loader.show();
  const handleError = function () {
    faIcon.classList.remove('fa-quote-left');
    faIcon.classList.add('fa-bomb');
    quoteText.classList.add('error');
    authorText.classList.add('error');
    quoteText.innerText = 'Anything that can go wrong, will go wrong... and it has. Please try again.';
    authorText.innerText = 'Mr. Murphy';
  };
  const resetAfterError = function () {
    faIcon.classList.add('fa-quote-left');
    faIcon.classList.remove('fa-bomb');
    quoteText.classList.remove('error');
    authorText.classList.remove('error');
  };
  let tooFrequent;
  const proxyUrl = 'https://api.allorigins.win/get?url=';
  const apiUrl = 'https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
  try {
    const response = await fetch(proxyUrl + encodeURIComponent(apiUrl), {cache: 'no-store'});
    let data = await response.text();
    let quoteObjString = JSON.parse(data).contents;
    if (previousQuoteObjString === quoteObjString) {
      // prevent too many requests
      sameQuoteCount++;
      //console.log('number of duplicate quotes is now: ' + sameQuoteCount);
      if (sameQuoteCount > 1) throw new Error('Too many duplicate responses');
      tooFrequent = setTimeout(getQuote, 800);
      return false;
    } else {
      clearTimeout(tooFrequent);
      sameQuoteCount = 0;
      //check if quote is the same as last quote
      previousQuoteObjString = quoteObjString;
      //extract quoteText
      let quoteString = quoteObjString.match(new RegExp('quoteText":"' + '(.*)' + '", "quoteAuthor"'));
      let cleanQuoteString = quoteString[1].replace(/\"/g, '"').replace(/\n/g, '\\n').replace(/\\'/g, "'").replace(/\&/g, '\\&').replace(/\r/g, '\\r').replace(/\t/g, '\\t').replace(/\f/g, '\\f');

      //extract authorText
      let authorString = quoteObjString.match(new RegExp('quoteAuthor":"' + '(.*)' + '", "senderName"'));
      let cleanAuthorString = authorString[1].replace(/\"/g, '"').replace(/\n/g, '\\n').replace(/\\'/g, "'").replace(/\&/g, '\\&').replace(/\r/g, '\\r').replace(/\t/g, '\\t').replace(/\f/g, '\\f');
      let cleanQuoteObj = {quoteText: cleanQuoteString, quoteAuthor: cleanAuthorString};

      // If Author is blank, add Unknown
      if (cleanQuoteObj.quoteAuthor === '') {
        authorText.innerText = 'Unknown';
      } else {
        authorText.innerText = cleanQuoteObj.quoteAuthor;
      }
      // Make font smaller for quotes longer than 120 characters
      if (cleanQuoteObj.quoteText.length > 120) {
        quoteText.classList.add('long-quote');
      } else {
        quoteText.classList.remove('long-quote');
      }
      quoteText.innerText = cleanQuoteObj.quoteText;
      //if the previous request had returned and error, reset styles
      resetAfterError();
    }
  } catch (error) {
    console.log(error);
    handleError();
  }
  loader.hide();
}

// Tweet Quote
function tweetQuote() {
  const quote = quoteText.innerText;
  const author = authorText.innerText;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - author=${author}`;
  window.open(twitterUrl, '_blank');
}

// Event Listeners
this.addEventListener('load', getQuote);
newQuoteBtn.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweetQuote);
