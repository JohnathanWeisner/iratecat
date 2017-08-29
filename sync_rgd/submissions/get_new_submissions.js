const options = {
  promiseLib: Promise
};
const bottleneck = require("bottleneck");
const limiter = new bottleneck(1, 2000);
const pgp = require('pg-promise')(options);
const connectionString = 'postgres://localhost:5432/gotdrawn';
const db = pgp(connectionString);
const headers = require('./submission_headers.js');
const insertSubmissions = require('./insert_submissions');
const snoowrap = require('snoowrap');
const reddit = new snoowrap({
  userAgent: 'GotDrawn',
  clientId: '8MCUWEa8UcHFoA',
  clientSecret: '9w6c42ggRikbEDmaX-SHZhQ7R1o',
  refreshToken: '10596738924-ls0N5tNaEw58BKVDDzkF6IgblcM'
});

function searchQuery(start, end) {
  return {
    query: `timestamp:${start}..${end}`,
    subreddit: 'redditgetsdrawn',
    limit: 1000,
    sort: 'top',
    syntax: 'cloudsearch',
    restrictSr: true
  };
}

function syncRgd() {
  return db.any('SELECT created_utc FROM submissions ORDER BY created_utc DESC LIMIT 1')
    .then((submissions) => {
      return new Promise((resolve, reject) => {
        if (submissions.length > 0 && submissions[0].created_utc) {
          let newestPostCreated = parseInt(submissions[0].created_utc);
          resolve(newestPostCreated);
        } else {
          reject('No submissions received from DB');
        }
      })
    })
    .then((lastCreatedUtc) => {
      const millisecondsInASecond = 1000;
      let currentUtc = Math.floor((new Date()).getTime() / millisecondsInASecond);
      let aDaysTime = 60 * 60 * 24;
      let twoDaysAgo = currentUtc - aDaysTime * 2;

      if (lastCreatedUtc > twoDaysAgo) {
        lastCreatedUtc = twoDaysAgo;
      }
      let start = lastCreatedUtc;
      let end = lastCreatedUtc + aDaysTime;

      function doSearch(start, end) {
        if (start > currentUtc) {
          start = currentUtc;
        }

        if (end > currentUtc) {
          return new Promise((resolve, reject) => {
            resolve();
          });
        }

        let numDaysToCheck = ((currentUtc - start) / aDaysTime);
        console.log('DAYS TO ADD TO DB: ', numDaysToCheck, start);

        return reddit.search(searchQuery(start, end))
          .then((submissions) => {
            insertSubmissions(db, limiter, reddit, submissions);
            console.log(
              'Submissions found: ', submissions.length,
              ' Start: ', new Date(start * 1000),
              ' End: ', new Date(end * 1000)
            );
            limiter.schedule(doSearch, start + aDaysTime, end + aDaysTime);
          }).catch((error) => {
            console.log(error);
          });
      }

      limiter.schedule(doSearch, start, end);

    })
    .catch(function(err) {
      return console.log(err);
    });
}

limiter.on('idle', () => {
  limiter.schedule(syncRgd);
});

limiter.schedule(syncRgd);
