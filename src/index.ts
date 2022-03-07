import { Scraper } from "./scraper";

require('dotenv').config({ path: `${__dirname}/../.env` });

(async () => {
    const scraper = await new Scraper();
    await scraper.boot();
    await scraper.run();
})();
