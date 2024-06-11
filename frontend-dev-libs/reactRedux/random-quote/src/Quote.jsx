import './Quote.css';
import React from 'react'

class Quote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quote: '',
      author: '',
      quotes: []
    }
  }

  componentDidMount() {
    let component = this;
    let index = Math.floor(Math.random() * 15);
    fetch("https://type.fit/api/quotes").then(function (response) {
      return response.json();
    }).then((data) => {
      component.setState({
        quote: data.at(index).text,
        author: data.at(index).author,
        quotes: data
      });
    });
  }

  fetchQuote = () => {
    let index = Math.floor(Math.random() * 15);
    let text = this.state.quotes.at(index).text;
    let author = this.state.quotes.at(index).author;
    this.setState({
      quote: text,
      author: author
    });
  }

  render() {
    return (
      <div id="quote-box">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous" />
        <div class="quote-text">
          <i class="fas fa-quote-left"> </i><span id="text"> {this.state.quote}</span>
        </div>
        <div class="quote-author">
          - <span id="author">{this.state.author}</span>
        </div>
        <div class="buttons">
          <button class="button" id="tweet-quote" title="Tweet this quote!" target="_blank">
            <i class="fab fa-twitter"></i>  Tweet quote
          </button>
          <button class="button" id="new-quote" onClick={this.fetchQuote}>
          <i class="fa fa-play"></i>  New quote
          </button>
        </div>
      </div>
    );
  }
};

export default Quote;
