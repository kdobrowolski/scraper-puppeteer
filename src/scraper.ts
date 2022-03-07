import puppeteer, { Browser } from 'puppeteer';
import scenariosList from './config/scenarios';
import { GetDataFromPageExtension } from './exceptions/get-data-from-page.extension';
import { InsertDataException } from './exceptions/insert-data.exception';
import { DatabaseService } from './services/database.service';

export class Scraper {
    databaseService: DatabaseService;
    puppeteer: typeof puppeteer;
    browser!: Browser;

    constructor () {
        this.puppeteer = puppeteer;
        this.databaseService = new DatabaseService();
    }

    async boot (): Promise<void> {
        this.browser = await this.puppeteer.launch();
    }

    async waitForSeconds (time: number): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(resolve, time);
          });
    }

    async run (): Promise<void> {
        while (true) {
            try {
                scenariosList.map(async (item) => {
                    const page = await this.browser.newPage();
                    await page.goto(item.url);
                    const Scenario = await item.scenario;
                    
                    const data = await Scenario.getData(page);
        
                    await this.databaseService.insertToDb(data, item.src);
                })
            } catch (error) {
                if (error instanceof Error) {
                    switch (error.constructor) {
                        case InsertDataException:
                            throw new Error(error.message);
                        case GetDataFromPageExtension: 
                            throw new Error(error.message);
                    }
                    throw new Error("Internal Error");
                }
            }
            await this.waitForSeconds(120000);
        }

        await this.browser.close();
    }
}