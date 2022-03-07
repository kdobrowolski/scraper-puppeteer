import knex from "../config/database";
import { InsertDataException } from "../exceptions/insert-data.exception";

export class DatabaseService {
    knex: any;
    
    constructor () {
        this.knex = knex;
    }

    async insertToDb (items: any, source: string): Promise<void> {
        try {
            const newData = items.map((item: any) => {
                return {
                    ...item,
                    source
                }
            })
        
            await this.knex('offers').insert(newData).onConflict('link').ignore()
        } catch (error) {
            throw new InsertDataException('Insert data to db failed!');
        }
    }
}