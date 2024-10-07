
import { SignUp } from '../../ShortRegistrationPage/SighUpPage';

export class RandomUser {

    
    public getRandomUserEmail() {
        let momentTime = new Date();
        let randomUser = `test_user_${momentTime.getTime()}@naga.com`;
        return randomUser;
    };
    public randomUserName(){
        const randomNumber = Math.floor(Math.random() * (99999 - 10 + 1)) + 10;
        let userName = `user_${randomNumber}`
        return userName;
    }

}