module.exports = function getPreparedInsertSql(rowsToInsert) {
  let preparedInt = 1;
  let preparedValues = [];
  let preparedRows = rowsToInsert.map((row) => {
    let sqlRow = '';
    let newPreparedIntTotal = preparedInt + row.length;
    let lastRow = newPreparedIntTotal - 1;
    let seperator = ', ';

    for (let i = preparedInt; i < newPreparedIntTotal; i++) {
      if (i === lastRow) {
        seperator = '';
      }
      preparedValues.push(row[i - preparedInt]);
      sqlRow += `$${i}${seperator}`;
    }
    preparedInt = newPreparedIntTotal;

    return `(${sqlRow})`;
  }).join(',\n') + ' ';

  return {
    sql: preparedRows,
    values: preparedValues
  };
}