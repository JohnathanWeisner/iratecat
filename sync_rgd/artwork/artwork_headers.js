const getValue = (value) => {
  return value;
};
const intOrZero = (value) => {
  return parseInt(value) || 0;
};
const getName = (value) => {
  return value.name;
};
const bool = (value) => {
  return value === 'true';
};
const getPermalink = (value) => {
  return value.replace('?ref=search_posts', '');
};
const getUrls = (value) => {
  value = value.replace(/\\/g, '');
  var urlMatches = /<a href=\"+([^\"]+?)\"+ ?>/g.exec(value);
  if (!urlMatches) return [];
  return urlMatches.slice(1, urlMatches.length);
};
const removeSubmissionPrefix = (value) => {
  return value.replace('t3_', '');
};
const getReplies = (value, depth = 0) => {
  value = value.map((reply) => {
    return headers.map((header) => {
      return header.mod(reply[header.name], depth + 1);
    });
  });
  return depth === 0 ? JSON.stringify(value) : value;
};

const headers = [
  { name: 'id', mod: getValue },
  { name: 'author', mod: getName },
  { name: 'link_id', mod: removeSubmissionPrefix, newName: 'submission_id' },
  { name: 'likes', mod: intOrZero },
  { name: 'score', mod: intOrZero },
  { name: 'gilded', mod: intOrZero },
  { name: 'controversiality', mod: intOrZero },
  { name: 'body', mod: getValue },
  { name: 'downs', mod: intOrZero },
  { name: 'created', mod: intOrZero },
  { name: 'created_utc', mod: intOrZero },
  { name: 'ups', mod: intOrZero },
  { name: 'depth', mod: intOrZero },
  { name: 'body_html', mod: getUrls, newName: 'urls' },
  { name: 'replies', mod: getReplies }
];

module.exports = headers;
