const getPreparedInsertSql = require('../helpers/get_prepared_insert_sql');

module.exports = function getInsertArtwork(normalizedArtwork, headers) {
  let preparedSqlValues = getPreparedInsertSql(normalizedArtwork);
  let insertArtwork = `INSERT INTO "artwork" (${headers.map((header) => header.newName || header.name).join(', ')}) VALUES\n${preparedSqlValues.sql}`;

  insertArtwork += `ON CONFLICT (id) DO UPDATE 
    SET ${headers.slice(2, headers.length)
      .map((header) => `${header.newName || header.name} = excluded.${header.newName || header.name}`)
      .join(',\n')};`;

  return {
    sql: insertArtwork,
    values: preparedSqlValues.values
  };
}
