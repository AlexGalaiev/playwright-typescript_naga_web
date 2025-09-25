import * as fs from 'fs';
import * as path from 'path';
import { User } from './user';


export class Users{
    userObj: any
    
    constructor(userObj:string){
        const fullFilePath = path.resolve(__dirname, userObj)
        let fileContents = fs.readFileSync(path.resolve(process.cwd()+userObj), 'utf-8')
        this.userObj = JSON.parse(fileContents)
    }

   async getUserDataByRole(role:string){
        return await this.userObj[role]
   }
}