import {test} from "../test-options"
import { SignUp } from "../pageObjects/ShortRegistrationPage/SighUpPage";
import { MainPage } from "../pageObjects/MainPage/MainPage";
import { StartKYCPopup } from "../pageObjects/common/startKYC_Popup/startKYCPage";
import { PhoneVerification } from "../pageObjects/FullRegistration/NAGACapital-PhoneVerification";
import { PersonalInformation } from "../pageObjects/FullRegistration/NAGACapital-PersonalInformationPage";

test("NAGA Capital full registration user", async({ page, NagaCapital })=>{
    await test.step('Short registration of lead user', async ()=>{
        let sighUp = new SignUp(page);
        await sighUp.goto(NagaCapital, 'register');
        await sighUp.createCFDUser("Ukraine");
    });
    await test.step('Redirect to main page and begin FR process', async ()=>{
        await new MainPage(page).proceedRegistration();
        await new StartKYCPopup(page).startKYC();
    });
    await test.step('Verification of phone number', async() =>{
        let phoneVerification = new PhoneVerification(page);
        await phoneVerification.insertTestPhoneNumber();
        await phoneVerification.insertVerificationCode();
    })
    await test.step('Fill personal information step', async() =>{
        let personalInfo = new PersonalInformation(page);
        await personalInfo.fillPersonalInformation()
    })
    
    console.log(3)

})