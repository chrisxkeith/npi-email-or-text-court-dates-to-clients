let table = base.getTable('Evictions Messages 2');
let query = await table.selectRecordsAsync({fields: table.fields});

let filteredRecords = query.records.filter(rec => {
    return !(rec.getCellValue('Date Email Sent') || rec.getCellValue('Date SMS Sent'))
})

output.table(filteredRecords);