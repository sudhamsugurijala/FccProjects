import './Quote.css';

function Quote() {
  return (
    <div id="quote-box">
        <div id="text">text</div>
        <div id="author">author</div>
        <a href="https://www.twitter.com/intent/tweet" id="tweet-quote"><button>Tweet Quote</button></a>
        <button id="new-quote">New Quote</button>
    </div>
  );
}

export default Quote;
