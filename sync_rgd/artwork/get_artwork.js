const headers = require('./artwork_headers');
const getInsertArtwork = require('./get_insert_artwork');
const getInsertUsers = require('../users/get_insert_users');

module.exports = function getArtwork(db, limiter, reddit, id) {
  let isIdDuplicate = {};
  let artwork = [];
  return reddit.getSubmission(id).fetch()
    .then((submission) => {
      let comments = submission.comments.filter((comment) => {
        var author = comment.author && comment.author.name;
        if (author === 'AutoModerator' ||
            !/(https?\:)/.test(comment.body) ||
            isIdDuplicate[comment.id]) {

          return false;
        }
        isIdDuplicate[comment.id] = true;
        return true;
      });

      let artwork = comments.map((comment) => {
        let art = headers.map((header) => {
          return header.mod(comment[header.name]);
        });

        art.author_flair_text = comment.author_flair_text;

        return art;
      });
      console.log('Artworks found: ', artwork.length);
      let preparedArtists = getInsertUsers(artwork, 'artwork');
      let preparedArtwork = getInsertArtwork(artwork, headers);
      db.tx((tx) => {
        let artistsExists = preparedArtists.values && preparedArtists.values.length > 0;
        let artworkExists = preparedArtwork.values && preparedArtwork.values.length > 0;
        if (artistsExists && artworkExists) {
          tx.batch([
            tx.none(preparedArtists.sql, preparedArtists.values),
            tx.none(preparedArtwork.sql, preparedArtwork.values)
          ]);
        } else if (artistsExists) {
          tx.batch([
            tx.none(preparedArtists.sql, preparedArtists.values)
          ]);
        } else if (artworkExists) {
          tx.batch([
            tx.none(preparedArtwork.sql, preparedArtwork.values)
          ]);
        }
      });
    }).catch((error) => {
      console.log(error);
    });
};