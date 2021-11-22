class App1 {
    /**
    * @param {string | EvictionsMessages2Table_Record} rec
    */
    sendEmail(rec) {
        console.log('To be emailed ' + rec.getCellValue('UID'));
    }
    /**
    * @param {string | EvictionsMessages2Table_Record} rec
    */
    sendSMS(rec) {
        console.log('To be texted ' + rec.getCellValue('UID'));
    }
    runIt(query) {
        let filteredRecords = query.records.filter(rec => {
            return !(rec.getCellValue('Date Email Sent') || rec.getCellValue('Date SMS Sent'))
        })
        for (let rec of filteredRecords) {
            if (!rec.getCellValue('Date Email Sent')) {
                this.sendEmail(rec);
            }
            if (!rec.getCellValue('Date SMS Sent')) {
                this.sendSMS(rec);
            }
        }
    }
}
let table = base.getTable('Evictions Messages 2');
let query = await table.selectRecordsAsync({fields: table.fields});
new App1().runIt(query);