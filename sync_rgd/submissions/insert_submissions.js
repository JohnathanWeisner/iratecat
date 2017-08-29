const headers = require('./submission_headers');
const getPreparedInsertSql = require('../helpers/get_prepared_insert_sql');
const getInsertSubmissions = require('./get_insert_submissions');
const getInsertUsers = require('../users/get_insert_users');
const getArtwork = require('../artwork/get_artwork');

module.exports = function insertSubmission(db, limiter, reddit, submissions) {
  let normalizedSubmissions = submissions.filter((submission) => {
    let numComments = parseInt(submission.num_comments);
    return numComments > 1 && submission.stickied !== 'true' && submission.is_self !== 'true';
  }).map((submission) => {
    let sub = headers.map((header) => {
      return header.mod(submission[header.name]);
    });

    sub.author_flair_text = submission.author_flair_text;

    return sub;
  });
  let submissionIds = normalizedSubmissions.map((submission) => submission[0]);
  submissionIds.forEach((id) => {
    limiter.schedule(getArtwork, db, limiter, reddit, id);
  });

  if (normalizedSubmissions.length > 0) {
    let preparedSubmitters = getInsertUsers(normalizedSubmissions, 'submissions');
    let preparedSubmissions = getInsertSubmissions(normalizedSubmissions, headers);

    db.tx((tx) => {
      let submittersExist = preparedSubmitters.values && preparedSubmitters.values.length > 0;
      let submissionsExist = preparedSubmissions.values && preparedSubmissions.values.length > 0;
      if (submittersExist && submissionsExist) {
        tx.batch([
          tx.none(preparedSubmitters.sql, preparedSubmitters.values),
          tx.none(preparedSubmissions.sql, preparedSubmissions.values)
        ]);
      } else if (submittersExist) {
        tx.batch([
          tx.none(preparedSubmitters.sql, preparedSubmitters.values)
        ]);
      } else if (submissionsExist) {
        tx.batch([
          tx.none(preparedSubmissions.sql, preparedSubmissions.values)
        ]);
      }
    });
  }
}
