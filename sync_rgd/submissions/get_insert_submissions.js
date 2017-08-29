const getPreparedInsertSql = require('../helpers/get_prepared_insert_sql');

module.exports = function getInsertSubmissions(normalizedSubmissions, headers) {
  let preparedSqlValues = getPreparedInsertSql(normalizedSubmissions);
  let insertSubmissions = `INSERT INTO "submissions" (${headers.map((header) => header.name).join(', ')}) VALUES\n${preparedSqlValues.sql}`;

  insertSubmissions += `ON CONFLICT (id) DO UPDATE 
    SET ${headers.slice(2, headers.length)
      .map((header) => `${header.name} = excluded.${header.name}`)
      .join(',\n')};`;

  return {
    sql: insertSubmissions,
    values: preparedSqlValues.values
  };
}