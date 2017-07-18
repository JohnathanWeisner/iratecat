import React, {Component, PropTypes} from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

const getStyle = (context) => {
  return {
    display: 'inline-block',
    width: '100%',
    marginBottom: '8px'
  };
}

export default class Artwork extends Component {
  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      url: '/square-image.png'
    };

  }

  componentDidMount() {
    if (this.props.urls && this.props.urls.length > 0) {
      this.updateUrl(this.props.urls[0]);
    }
    
  }

  async convertImgurAlbumToImage(albumId) {
    let imgurAlbumUrl = 'https://api.imgur.com/3/album/';
    let imgurClientId = 'af72ed44734d314';
    let response = await fetch(imgurAlbumUrl + albumId, {
      headers: new Headers({
        'Authorization': `Client-ID ${imgurClientId}`
      })
    }).then((response) => response.json());
    let images = response && response.data && response.data.images;
    if (images && images.length > 0) {
      console.log('images[0].link', images[0].link)
      this.setState({url: images[0].link});
    }
  }

  async convertInstagramUrlToImage(instagramUrl) {
    let response = await fetch(instagramUrl.replace(/https?:\/\/w?w?w?\.?instagram\.com/, '') + '?__a=1');
    if (response && response.graphql) console.log(response.graphql.shortcode_media.display_url)
  }

  updateUrl(url) {
    if (/(\.jpg|\.jpeg|\.gif|\.png)/i.test(url)) {
      this.setState({url: url});
      return;
    }

    let isImgur = /imgur\.com/.test(url);

    if (isImgur) {
      if (!/imgur\.com\/a\//i.test(url)) {
        url = url.replace(/m\.imgur\.com/ig, 'i.imgur.com')
        this.setState({url: `${url}.jpg`});
        return;
      }

      let imgurAlbumMatch = url.match(/https?:\/\/imgur.com\/a\/(.+)/i);
      if (imgurAlbumMatch && imgurAlbumMatch.length > 1) {
        this.convertImgurAlbumToImage(imgurAlbumMatch[1]);
        return;
      }
    }
    if (/instagram\.com\/p\//i.test(url)) {
      this.convertInstagramUrlToImage(url)
    }
    console.log(url)
    // this.setState({url: url});
  }

  render() {
    // submission_id, likes, score,
    // gilded, author, controversiality,
    // body, downs, created, created_utc,
    // ups, depth, urls, replies, submitter,
    // artist, best_of_rgd_wins, great_photos_wins,
    // is_annual_award_winner
    let {
      best_of_rgd_wins,
      great_photos_wins,
      is_annual_award_winner,
      urls,
      author,
      score,
      submission_score,
      submission_permalink,
      rating,
      created_utc
    } = this.props;
    console.log('created_utc', created_utc);
    let cardTitle = rating ? `Rating: ${rating}` : '';
    cardTitle += score ? `Artwork Score: ${score}` : '';
    cardTitle += submission_score ? `Submission Score: ${submission_score}` : '';
    let bestOfRgdFlair = best_of_rgd_wins ? `Won Best of RGD award (x${best_of_rgd_wins})` : '';
    let greatPhotosFlair = great_photos_wins ? `Won Great Photos award (x${great_photos_wins})` : '';
    let annualAwardWinnerFlair = is_annual_award_winner ? 'Annual Award Winner!' : '';
    let authorFlair = [bestOfRgdFlair, greatPhotosFlair, annualAwardWinnerFlair].join(' ');
    submission_permalink = 'http://reddit.com' + submission_permalink;
    return (
      <Card style={getStyle(this.context)}>
        <CardHeader
          title={author}
          subtitle={authorFlair}
        />
        <CardMedia>
          <img src={this.state.url} alt="" />
        </CardMedia>
        <CardTitle 
          title={cardTitle}
        />
        <a href={submission_permalink}>Link</a>
      </Card>
    );
  }
}