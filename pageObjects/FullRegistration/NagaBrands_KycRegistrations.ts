import { Page } from "playwright";
import { SignUp } from "../ShortRegistrationPage/SighUpPage";
import { MainPage } from "../MainPage/MainPage";
import { StartKYCPopup } from "../common/startKYC_Popup/startKYCPage";
import { PersonalInformation } from "./NAGACapital-PersonalInformationPage";
import { VerificationPopup } from "../VerificationCenter/verificationPopup";
import { RandomUser } from "../common/testUserCredentials/randomUser";
import { YouAreInNagaMarkets } from "./components/NAGAMarkets_YouAreInpopup";
import { UdpateAccount } from "./NAGACapital-UpdateAccount";
import { KYC_Start } from "./NAGAMarkets-KYCStart";
import { PhoneVerification } from "./NAGACapital-PhoneVerification";
import { FullRegistration } from "./NagaMarkets_FullRegistration";
import { FinalStep } from "./NAGAMarkets_KYCFinalStep";


export class KYC_General{
    page: Page
    
    constructor(page: Page){
        this.page = page
    }

    async NagaCapital_KYC_HighScore(email: string, password: string, country: string, brand: string){
        let signUp = new SignUp(this.page);
        let mainPage = new MainPage(this.page);
        let personalInfo = new PersonalInformation(this.page)
        //open platform and create lead user
        await signUp.goto(brand, 'register')
        await signUp.createCFDUser(email, password, country)
        //fill personal information popup
        await personalInfo.fillPersonalInformation('Continue');
        //click on Real money button
        await new YouAreInNagaMarkets(this.page).clickOpenRealMoneyAccount()
        //After previous step - user sees next form. Add more information to personal info
        await personalInfo.compleateYourProfile()
        //Click on deposit button and redirect to main page
        await personalInfo.clickDepositNow()
        //Wait for Verify identity btn (header of main page) and click ion it
        await mainPage.updateUserLevel();
        //Click start kyc btn on popup
        await new StartKYCPopup(this.page).startKYC();
        //wait for preselected form and click on Finish form
        await new UdpateAccount(this.page).clickFinishBtn();
        await new VerificationPopup(this.page).skipVerificationStep()
    }

    async NagaMarkets_KYC_Advance(email: string, password: string, country:string, brand: string){
        let signUp = new SignUp(this.page);
        let kycStart = new KYC_Start(this.page);
        let quiz = new FullRegistration(this.page);
        let KYC_FinalStep = new FinalStep(this.page);
        //Create lead user 
        await signUp.goto(brand, 'register')
        await signUp.createCfdUser_All(email, password, country);
        //fill personal information and verify user
        await new PersonalInformation(this.page).fillPersonalInformation('Verify with SMS')
        await new PhoneVerification(this.page).insertVerificationCode()
        //open KYC 
        await new YouAreInNagaMarkets(this.page).openNagaKyc()
        await kycStart.clickStartVerificationBtn()
        //fill kyc 
        await quiz.fill_KYC('Advance');
        await this.page.waitForTimeout(500)
        await KYC_FinalStep.clickBtn('Deposit');
        await this.page.waitForTimeout(1500)
    }

}