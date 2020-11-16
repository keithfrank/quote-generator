/**** Begin Loader Class ****/
class Loader {
  //1. select DOM elements, and keep track of any useful data
  constructor(loadingContentElement, classList = ['loader'], id = 'loader') {
    this.loadingContentElement = loadingContentElement;
    this.loaderHTML = `<div class="${classList.join(' ')}" id="${id}"></div>`;
    this.loadingContentElement.insertAdjacentHTML('afterend', this.loaderHTML);
    this.loaderElement = document.getElementById('loader');
  }
  // Events

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

// Get Quote From API
//using "http://api.allorigins.win/get?url="
//instead of "https://cors-anywhere.herokuapp.com/"

async function getQuote() {
  loader.show();
  const proxyUrl = 'http://api.allorigins.win/get?url=';
  const apiUrl = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
  try {
    const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
    let data = await response.text();
    let quoteObjString = JSON.parse(data).contents;
    //extract quoteText
    let quoteString = quoteObjString.match(new RegExp('quoteText":"' + '(.*)' + '", "quoteAuthor"'));
    let cleanQuoteString = quoteString[1].replace(/\"/g, '\\"').replace(/\n/g, '\\n').replace(/\\'/g, "'").replace(/\&/g, '\\&').replace(/\r/g, '\\r').replace(/\t/g, '\\t').replace(/\f/g, '\\f');

    //extract authorText
    let authorString = quoteObjString.match(new RegExp('quoteAuthor":"' + '(.*)' + '", "senderName"'));
    let cleanAuthorString = authorString[1].replace(/\"/g, '\\"').replace(/\n/g, '\\n').replace(/\\'/g, "'").replace(/\&/g, '\\&').replace(/\r/g, '\\r').replace(/\t/g, '\\t').replace(/\f/g, '\\f');
    let cleanQuoteObj = {quoteText: cleanQuoteString, quoteAuthor: cleanAuthorString};

    //check if quote is the same as last quote
    if (cleanQuoteObj.quoteText === quoteText.innerText) {
      // If quote is the same, request a new quote.
      getQuote();
    } else {
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
      faIcon.classList.add('fa-quote-left');
      faIcon.classList.remove('fa-bomb');
      quoteText.classList.remove('error');
      authorText.classList.remove('error');
      loader.hide();
    }
  } catch (error) {
    // We need to deal with what happens when we get a syntax error TOKEN at
    faIcon.classList.remove('fa-quote-left');
    faIcon.classList.add('fa-bomb');
    quoteText.classList.add('error');
    authorText.classList.add('error');
    quoteText.innerText = 'Anything that can go wrong, will go wrong... and it has. Please try again.';
    authorText.innerText = 'Mr. Murphy';
    // log this to server
    //console.log('whoops, no quote', error);
    loader.hide();
  }
}

// // Tweet Quote
function tweetQuote() {
  const quote = quoteText.innerText;
  const author = authorText.innerText;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - author=${author}`;
  window.open(twitterUrl, '_blank');
}

//Event Listeners
newQuoteBtn.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweetQuote);
window.addEventListener('load', getQuote);
