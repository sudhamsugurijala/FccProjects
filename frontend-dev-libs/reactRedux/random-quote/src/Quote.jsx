import './Quote.css';
import React from 'react'

class Quote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quote: 'This is the first quote',
      author: 'Myself',
      quotes: []
    }
  }

  componentDidMount() {
    let component = this;
    let index = Math.floor(Math.random()*15);
    fetch("https://type.fit/api/quotes").then(function(response) {
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
    let index = Math.floor(Math.random()*15);
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
        <div id="text">{this.state.quote}</div>
        <div id="author">{this.state.author}</div>
        <a href="https://www.twitter.com/intent/tweet" id="tweet-quote"><button>Tweet Quote</button></a>
        <button id="new-quote" onClick={this.fetchQuote}>New Quote</button>
    </div>
    );
  }
};

export default Quote;
