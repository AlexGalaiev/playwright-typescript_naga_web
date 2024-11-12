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
    async getTranslation(elementToGet: string){
        let elements = elementToGet.split(".")
        return await this.jsonObj[elements[0]][elements[1]]
    };
    async getDocumentInfo(elementToGet: string){
        let elements = elementToGet.split(".")
        return await this.jsonObj[elements[0]][elements[1]][elements[2]]
    }
    async getLandingPage(regulation:string, type:string, elementToGet: string, params:string){
        return await this.jsonObj[regulation][type][elementToGet][params]
    }
}