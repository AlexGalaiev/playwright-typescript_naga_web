import path from "path";
import * as fs from 'fs';

export class KYC_answerFunctions{

    private jsonObj: any;

    constructor(registrationJson: string) {
        const fullFilePath = path.resolve(__dirname, registrationJson);
        let fileContents = fs.readFileSync(path.resolve(process.cwd()+registrationJson), 'utf-8');
        this.jsonObj = JSON.parse(fileContents);
    }

    async getQuizText(elementToGet: string) {
        return this.jsonObj[elementToGet]["text"]
    }
    async getQuizAnswer(elementToGet: string) {
        return this.jsonObj[elementToGet]["answer"]
    }
}
    