import {test as base, BrowserContext, chromium as baseChromium, TestInfo} from "@playwright/test";
import { SignUp } from "./pageObjects/ShortRegistrationPage/SighUpPage";
import { MainPage } from "./pageObjects/MainPage/MainPage";
import { AddAcountForm } from "./pageObjects/UserProfile/AddTradingAccount";
import { PhoneVerification } from "./pageObjects/FullRegistration/NAGACapital-PhoneVerification";
import { PersonalInformation } from "./pageObjects/FullRegistration/NAGACapital-PersonalInformationPage";
import { AllSetPopup } from "./pageObjects/common/allSetPopup(KYC)/allSetPopup";
import { StartKYCPopup } from "./pageObjects/common/startKYC_Popup/startKYCPage";
import {Page} from "@playwright/test"

export type Preconditions = {
    sighUp: SignUp;
    mainPage: MainPage;
    user: any;
    page: Page
}

export const userNagaCapital = base.extend<Preconditions>({
    user: async({page, NagaCapital}, use)=>{
        let sighUp = new SignUp(page);
        let mainPage = new MainPage(page);
        let addAccount = new AddAcountForm(page);
        await sighUp.goto(NagaCapital, 'register');
        await sighUp.createCFDUser("Ukraine");
        await mainPage.mainPageIsDownLoaded();
        await mainPage.proceedRegistration();
        await new StartKYCPopup(page).startKYC();
        let phoneVerification = new PhoneVerification(page);
        await phoneVerification.insertTestPhoneNumber();
        await phoneVerification.insertVerificationCode();
        await new PersonalInformation(page).fillPersonalInformation();
        await new AllSetPopup(page).clickDepositNow();
    }})