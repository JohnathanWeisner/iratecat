const escapeSingleQuote = (value) => { 
    if (value) {
        return value;
    } else {
        return null;
    }
};
const getValue = (value) => {
  return value;
};
const intOrZero = (value) => { return parseInt(value) || 0; };
const getName = (value) => {
    if (value.name) {
        return escapeSingleQuote(value.name);
    } else {
        return null;
    }
};
const bool = (value) => { return value === 'true'; };
const getStringifiedValue = (value) => { return JSON.stringify(value) };
const getPermalink = (value) => {
  return getValue(value).replace(/\?ref=search_posts/g, '');
}

module.exports = [
  { name: 'id', mod: getValue },
  { name: 'author', mod: getName },
  { name: 'score', mod: intOrZero },
  { name: 'over_18', mod: bool },
  { name: 'domain', mod: getValue },
  { name: 'preview', mod: getStringifiedValue },
  { name: 'gilded', mod: intOrZero },
  { name: 'permalink', mod: getPermalink },
  { name: 'created', mod: intOrZero },
  { name: 'url', mod: getValue },
  { name: 'title', mod: getValue },
  { name: 'created_utc', mod: intOrZero },
  { name: 'num_comments', mod: intOrZero },
  { name: 'ups', mod: intOrZero },
  { name: 'downs', mod: intOrZero },
  { name: 'depth', mod: intOrZero }
];
