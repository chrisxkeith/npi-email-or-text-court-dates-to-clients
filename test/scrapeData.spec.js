// Partically generated by Selenium IDE.
const { Builder, By } = require('selenium-webdriver')

class Scraper {
  trimString(s) {
    return s.trimStart().trimEnd().replace(',','')
  }
  async scrapeOnePage(driver) {
    const NAME_CORPORATION_COLUMN = 2
    const ADDRESS_COLUMN = 3
    const PARTY_TYPE_COLUMN = 4
    const FILING_DATE_COLUMN = 5
    await driver.switchTo().frame(1)
        // Firefox fails here with "NoSuchWindowError: Browsing context has been discarded"
    // TODO : loop down table rows
    const party_type = await driver.findElement(By.css("tr:nth-child(2) > td:nth-child(" + PARTY_TYPE_COLUMN + ")")).getText()
    if (party_type === 'DEFENDANT') {
      const defendant_name = await driver.findElement(By.css("tr:nth-child(2) > td:nth-child(" + NAME_CORPORATION_COLUMN + ")")).getText()
      const address = await driver.findElement(By.css("tr:nth-child(2) > td:nth-child(" + ADDRESS_COLUMN + ")")).getText()
      const filing_date = await driver.findElement(By.css("tr:nth-child(2) > td:nth-child(" + FILING_DATE_COLUMN + ")")).getText()
      // TODO : (1) parse address, case number and landlord name, (2) CSV-ify?
      let first_name
      let last_name
      if (defendant_name.includes(',')) {
        [last_name, first_name] = defendant_name.split(',')
      } else {
        first_name = defendant_name
        last_name = defendant_name
      }
      console.log(this.trimString(first_name) + ',' + this.trimString(last_name) + ',' + address + ',' + this.trimString(filing_date))
    }
  }
  async scrapeByFirstLetter(driver, firstLetter) {
    await driver.get("https://gscivildata.shelbycountytn.gov/pls/gnweb/ck_public_qry_cpty.cp_personcase_setup_idx")
    await driver.switchTo().frame(1)
    await driver.findElement(By.name("partial_ind")).click()
    await driver.findElement(By.name("last_name")).click()
    await driver.findElement(By.name("last_name")).sendKeys(firstLetter)
    await driver.findElement(By.name("begin_date")).click()
    await driver.findElement(By.name("begin_date")).sendKeys("01-NOV-2021")
    await driver.findElement(By.css("tr:nth-child(7) > td:nth-child(1)")).click()
    await driver.findElement(By.name("end_date")).click()
    await driver.findElement(By.name("end_date")).sendKeys("14-NOV-2021")
    await driver.findElement(By.name("case_type")).click()
    await driver.findElement(By.css("option:nth-child(17)")).click()
    await driver.findElement(By.css("input:nth-child(4)")).click()
    await this.scrapeOnePage(driver)
  }
  async scrapeData() {
    const TIMEOUT_IN_SECONDS = 30 * 1000
    let driver = await new Builder().forBrowser('chrome').build()
    await driver.manage().setTimeouts( { implicit: TIMEOUT_IN_SECONDS, pageLoad: TIMEOUT_IN_SECONDS, script: TIMEOUT_IN_SECONDS } )
    for (let letter of ['A']) {
      await this.scrapeByFirstLetter(driver, letter)
    }
    await driver.quit();
  }
}
new Scraper().scrapeData()
