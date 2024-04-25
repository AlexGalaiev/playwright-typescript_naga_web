
import { SignUp } from '../../ShortRegistrationPage/SighUpPage';

export class RandomUser {

    
    public getRandomUserEmail() {
        let momentTime = new Date();
        let randomUser = `test_user_${momentTime.getTime()}@naga.com`;
        return randomUser;
    };

}