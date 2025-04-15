
import { SignUp } from '../../ShortRegistrationPage/SighUpPage';

export class RandomUser {

    public getRandomUserEmail() {
        let momentTime = new Date();
        let randomUser = `testUser_${momentTime.getTime()}@naga.com`;
        return randomUser;
    };
    public randomUserName(){
        const randomNumber = Math.floor(Math.random() * (9999999 - 10 + 1)) + 10;
        let userName = `us${randomNumber}`
        return userName;
    }

}