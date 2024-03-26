import * as fs from 'fs';
import * as path from 'path';

export class getLocalization{
    private jsonObj: any;

    constructor(registrationJson: string) {
        const fullFilePath = path.resolve(__dirname, registrationJson);
        let fileContents = fs.readFileSync(path.resolve(process.cwd()+registrationJson), 'utf-8');
        this.jsonObj = JSON.parse(fileContents);
    };

    async getLocalizationText(elementToGet: string) {
        return this.jsonObj[elementToGet]["answer"]
    };
}