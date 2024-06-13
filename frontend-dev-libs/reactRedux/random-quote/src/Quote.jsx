import './Quote.css';
import React from 'react'

class Quote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quote: '',
      author: '',
      quotes: [],
      color: ''
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
        author: data.at(index).author.split(',')[0],
        color: '#16a085',
        quotes: data
      });
    });
  }

  componentDidUpdate() {
    document.body.style.backgroundColor = this.state.color;
    document.body.style.transition = 'background-color 2s ease';
  }

  fetchQuote = () => {
    var colors = ['#16a085', '#27ae60', '#2c3e50', '#f39c12', '#e74c3c', '#9b59b6', '#FB6964', '#342224', "#472E32", "#BDBB99", "#77B1A9", "#73A857"];
    let index = Math.floor(Math.random() * 12);
    let text = this.state.quotes.at(index).text;
    let author = this.state.quotes.at(index).author.split(',')[0];
    this.setState({
      quote: text,
      author: author,
      color: colors[index]
    });
  }

  render() {
    return (
      <div id="quote-box">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous" />
        <div class="quote-text" style={{color: this.state.color}}>
          <i class="fas fa-quote-left"></i><span id="text" >{this.state.quote}</span>
        </div>
        <div class="quote-author" style={{color: this.state.color}}>
          - <span id="author">{this.state.author}</span>
        </div>
        <div class="buttons">
          <button class="button" id="tweet-quote" title="Tweet this quote!" target="_blank" style={{backgroundColor: this.state.color}}>
            <i class="fab fa-twitter"></i>
          </button>
          <button class="button" id="new-quote" onClick={this.fetchQuote} style={{backgroundColor: this.state.color}}>New quote</button>
        </div>
      </div>
    );
  }
};

export default Quote;
