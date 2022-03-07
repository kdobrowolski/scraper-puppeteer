import { Page } from "puppeteer";
import { GetDataFromPageExtension } from "../exceptions/get-data-from-page.extension";
import { OlxOffer } from "../interfaces/data.interface";

export class OlxScenario {
    constructor () {
    }

    async getData (page: Page): Promise<Record<string,any>>  {
        try {
            const res = await page.evaluate(() => {
                const results: OlxOffer[] = [];
                const items = document.querySelectorAll('div.offer-wrapper');
                items.forEach((item) => {
                    results.push(({
                        title: (item.querySelector('td.title-cell strong') as HTMLElement)!.innerText,
                        image: (item.querySelector('td.photo-cell img') as HTMLElement)!.getAttribute('src'),
                        link: item.querySelector('td.title-cell a')!.getAttribute('href'),
                        location: (item.querySelector('td.bottom-cell span') as HTMLElement)!.innerText,
                        time: (item.querySelectorAll('td.bottom-cell span')[1] as HTMLElement).innerText,
                        price: (item.querySelector('p.price strong') as HTMLElement)!.innerText,
                    }))
                })
            
                return results;
            })

            return res;
        } catch (error) {
            throw new GetDataFromPageExtension('Get data from page failed');
        }
    }
}