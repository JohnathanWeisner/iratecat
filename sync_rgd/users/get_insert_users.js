const headers = require('./user_headers');
const getPreparedInsertSql = require('../helpers/get_prepared_insert_sql');

module.exports = function getInsertUsers(normalizedListings, type) {
  let users = normalizedListings.map((submission) => {
    let user = {
      name: submission[1],
      author_flair_text: submission.author_flair_text
    };

    return user;
  });
  // get unique users
  let userDuplicate = {};
  users = users.filter((user) => {
    if (!user.name || user.name == 'AutoModerator') return false;
    if (!userDuplicate[user.name]) {
      userDuplicate[user.name] = true;
      return true;
    }
    return false;
  });

  users = users.map((user) => {
    let flair = user.author_flair_text;
    if (flair && flair !== 'null') {
      let greatPhotos = flair.match(/Great Photos ?\(?x?(\d*)?\)?/i);
      let greatPhotosCount = 0;
      let bestOfRgd = flair.match(/RGD Winner ?\(?x?(\d*)?\)?/i);
      let bestOfRgdCount = 0;
      let annualAwardWinner = /Annual Award/i.test(flair);

      if (greatPhotos && greatPhotos[1] > 0) {
        greatPhotosCount = parseInt(greatPhotos[1]);
      } else if (greatPhotos && greatPhotos.length === 1) {
        greatPhotosCount = 1;
      }

      if (bestOfRgd && bestOfRgd[1] > 0) {
        bestOfRgdCount = parseInt(bestOfRgd[1]);
      } else if (bestOfRgd && bestOfRgd.length === 1) {
        bestOfRgdCount = 1;
      }

      user = Object.assign(user, {
        great_photos_wins: greatPhotosCount,
        best_of_rgd_wins: bestOfRgdCount,
        is_annual_award_winner: annualAwardWinner
      });
    } else {
      user = Object.assign(user, {
        great_photos_wins: 0,
        best_of_rgd_wins: 0,
        is_annual_award_winner: false
      });
    }

    let isSubmitter = type === 'submissions';
    let isArtist = type === 'artwork';

    return [
      user.name,
      isSubmitter,
      isArtist,
      user.great_photos_wins,
      user.best_of_rgd_wins,
      user.is_annual_award_winner
    ];
  });

  let preparedSqlValues = getPreparedInsertSql(users);
  let insertSql = `INSERT INTO "users" (${headers.join(', ')}) VALUES\n${preparedSqlValues.sql}`;
  let userField = type === 'submissions' ? 'is_submitter' : 'is_artist';

  let conflict = `ON CONFLICT (name) DO UPDATE
      SET ${userField} = excluded.${userField},
          great_photos_wins = CASE
            WHEN users.great_photos_wins > excluded.great_photos_wins THEN users.great_photos_wins
            ELSE excluded.great_photos_wins END,
          best_of_rgd_wins = CASE
            WHEN users.best_of_rgd_wins > excluded.best_of_rgd_wins THEN users.best_of_rgd_wins
            ELSE excluded.best_of_rgd_wins END,
          is_annual_award_winner = CASE
            WHEN users.is_annual_award_winner = true THEN users.is_annual_award_winner
            ELSE excluded.is_annual_award_winner END;`;
  insertSql += conflict;
  console.log('Users found: ', preparedSqlValues.values.length, ' Type: ', type);
  return {
    sql: insertSql,
    values: preparedSqlValues.values
  };
}
