const options = {
    promiseLib: Promise
};

const pgp = require('pg-promise')(options);
const connectionString = 'postgres://localhost:5432/gotdrawn';
const db = pgp(connectionString);
const maxLimit = 20;

function getSubmissions(req, res, next) {
  let limit = parseInt(req.query.limit) || 10;
  let offset = parseInt(req.query.offset) || 0;
  limit = limit > maxLimit ? maxLimit : limit;
  db.any('select * from submissions order by created_utc limit $1 offset $2', [limit, offset])
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved submissions'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingleSubmission(req, res, next) {
  let submissionId = parseInt(req.params.id);

  db.one('select * from submissions where id = $1', submissionId)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE submission'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getTopArtwork(req, res, next) {
  db.any(`SELECT artwork.id AS id,
                 artwork.submission_id AS submission_id,
                 artwork.likes AS likes,
                 artwork.score AS score,
                 artwork.gilded AS gilded,
                 artwork.author AS author, 
                 artwork.controversiality as controversiality,
                 artwork.body AS body, 
                 artwork.downs AS downs,
                 artwork.created AS created, 
                 artwork.created_utc AS created_utc,
                 artwork.ups AS ups, 
                 artwork.urls AS urls, 
                 artwork.replies AS replies,
                 users.is_submitter AS is_submitter, 
                 users.is_artist AS is_artist,
                 users.best_of_rgd_wins AS best_of_rgd_wins, 
                 users.great_photos_wins AS great_photos_wins,
                 users.is_annual_award_winner AS is_annual_award_winner
              FROM artwork, users
              WHERE artwork.author = users.name
              ORDER BY artwork.score DESC
              LIMIT 30;`)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL artwork'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getTopArtworkByRating(req, res, next) {
  let daysAgo = parseInt(req.params.days_ago) || 0;
  let daysAgoQuery = daysAgo > 0 ? `WHERE a.created_utc > $1 AND s.over_18 = false` : '';
  let utcTimeAgo = ((new Date()).getTime() / 1000) - daysAgo * 24 * 60 * 60;
  console.log('utcTimeAgo', utcTimeAgo, req.params.days_ago)

  db.any(`SELECT (CAST(a.ups AS float) / GREATEST(CAST(s.score AS float), 2)) * 100 AS rating,
    a.id AS id,
    a.submission_id AS submission_id,
    a.likes AS likes,
    a.score AS score,
    a.gilded AS gilded,
    a.author AS author,
    a.controversiality AS controversiality,
    a.body AS body,
    a.downs AS downs,
    a.created AS created,
    a.created_utc AS created_utc,
    a.ups AS ups,
    a.urls AS urls,
    a.replies AS replies,
    u.is_submitter AS is_submitter,
    u.is_artist AS is_artist,
    u.best_of_rgd_wins AS best_of_rgd_wins,
    u.great_photos_wins AS great_photos_wins,
    u.is_annual_award_winner AS is_annual_award_winner,
    s.score AS submission_score,
    s.permalink AS submission_permalink
    FROM artwork a
    JOIN users u
      ON a.author = u.name
    JOIN submissions s
      ON a.submission_id = s.id
    ${daysAgoQuery}
    ORDER BY rating DESC
    LIMIT 30;`, utcTimeAgo)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved highest rated artwork'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getTopArtists(req, res, next) {
  db.any('select * from users')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL users'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}



module.exports = {
    getSubmissions,
    getSingleSubmission,
    getTopArtwork,
    getTopArtworkByRating,
    getTopArtists
};


