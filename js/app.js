


var my_news = [
  {
    author: 'Саша	Печкин',
    text: 'В	четверг,	четвертого	числа...',
    bigText: 'в четыре с четвертью часа четыре чёрненьких чумазеньких чертёнка чертили чёрными чернилами чертёж.'
  },
  {
    author: 'Просто	Вася',
    text: 'Считаю,	что	$	должен	стоить	35	рублей!',
    bigText: 'в четыре с четвертью часа четыре чёрненьких чумазеньких чертёнка чертили чёрными чернилами чертёж.'
  },
  {
    author: 'Гость',
    text: 'Бесплатно.	Скачать.	Лучший	сайт	-	http://localhost:3000',
    bigText: 'в четыре с четвертью часа четыре чёрненьких чумазеньких чертёнка чертили чёрными чернилами чертёж.'
  }
];

window.ee = new EventEmitter();


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      news: my_news
    }
  }

  componentDidMount() {
    window.ee.addListener('News.add', (item) => {
      let nextNews = this.state.news;
      nextNews.push(item);
      this.setState({
        news: nextNews
      });
    })
  }

  addArticle(article)  {
    let nextNews = this.state.news;
      nextNews.push(article);
      this.setState({
        news: nextNews
      });
  }

  render() {
    return (
      <div className='app'>
        <NewArticleForm onaddArticle={this.addArticle.bind(this)}/>
        <News news={this.state.news}/>
      </div>
    );
  }
}


class News extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div calssName='news'>
        {this.renderNews()}
        <strong className={this.props.news.length > 0 ? '' : 'none '}> Number of the news - {this.props.news.length}</strong>
      </div>
    )
  }

  renderNews() {
    let news = this.props.news;
    let newsTemplate;

    if (news.length > 0) {
      newsTemplate = news.map((singleNews, index) => {
        return (
          <div key={index}>
            <Article singleNews={singleNews} />
          </div>
        );
      });
    } else {
      newsTemplate = <p>No news</p>;
    }

    return newsTemplate;
  }
}

class Article extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }


  showBigText() {
    this.setState({
      visible: true
    });
  }

  render() {
    let visible = this.state.visible;
    return (
      <div className='article'>
        <p className='news__author'>{this.props.singleNews.author}:</p>
        <p className='news__text'>{this.props.singleNews.text}</p>
        <a href='#'
          className={'news__readmore ' + (visible ? 'none ' : '')}
          onClick={() => this.showBigText()}>
          Read more....
        </a>
        <p className={'news__big-text ' + (visible ? '' : 'none ')}>
          {this.props.singleNews.bigText}
        </p>
      </div>
    );
  }


}
class NewArticleForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      agreeWithRules: false,
      emptyAuthor: true,
      emptyText: true
    }
  }

  componentDidMount() {
    ReactDOM.findDOMNode(this.refs.author).focus();
  }


  render() {
    return (
      <form className='add cf'>
        <input
          type='text'
          className='add__author'
          defaultValue=''
          placeholder='Ваше имя'
          ref='author'
          onChange={ this.onFieldChange.bind(this, 'emptyAuthor') }
        /> 
        <textarea
          className='add__text'
          defaultValue=''
          placeholder='Текст новости'
          ref='text'
          onChange={ this.onFieldChange.bind(this, 'emptyText') }
        ></textarea>
        <label className='add__checkrule'>
          <input type='checkbox' onClick={() => this.onCheckRuleClick() } ref='checkrule' />Я согласен с
          правилами
        </label>
        <button
          className='add__btn'
          onClick={() => this.onBtnClickHandler()}
          ref='alert_button'
          disabled={(!this.state.agreeWithRules) || this.state.emptyAuthor || this.state.emptyText }>
          Добавить новость
       </button>
      </form>
    );
  }

  onFieldChange(fieldName,e) {
    if(e.target.value.trim().length > 0) {
      this.setState({
        [''+fieldName]: false
      })
    } else {
      this.setState({
        [''+fieldName]:true
      })
    }    
  }

  onCheckRuleClick() {
    this.setState({
      agreeWithRules: !this.state.agreeWithRules
    });
  }
  onBtnClickHandler() {
    let newArticle = {
      author: this.refs.author.value,
      text: this.refs.text.value.split(0,8),
      bigText: this.refs.text.value
    }

    this.refs.text.value = '';
    this.setState({
      emptyText: true
    });
    

    this.props.onaddArticle(newArticle);
  }
 
}



ReactDOM.render(
  <App />,
  document.getElementById('root')
);
