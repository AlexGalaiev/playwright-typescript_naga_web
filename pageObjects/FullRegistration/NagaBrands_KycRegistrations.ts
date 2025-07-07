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
import { Captcha } from "../../pageObjects/captcha";
import { MenaFullRegistration } from "./NagaMena_FullRegistration";
import { MyAccounts } from "../MainPage/MyAccounts";
import { KYC_Africa } from "./NagaAfrica_FullRegistrations";

export class KYC_General{
    page: Page
    
    constructor(page: Page){
        this.page = page
    }

    async NagaCapital_KYC_HighScore(email: string, password: string, country: string, countrycCode: string, phone: string, brand: string){
        let signUp = new SignUp(this.page);
        let mainPage = new MainPage(this.page);
        let personalInfo = new PersonalInformation(this.page)
        //open platform and create lead user
        await signUp.goto(brand, 'register')
        await new Captcha(this.page).removeCaptcha()
        await signUp.createCFDUser(email, password, country, countrycCode, phone )
        //fill personal information popup
        await new YouAreInNagaMarkets(this.page).clickExplorePlatform()
        //switch to main page and click to Naga Start widget step
        await mainPage.clickOnWidgepPoint('NAGA Start')
        await new StartKYCPopup(this.page).startKYC();
        //After previous step - user sees next form. Add more information to personal info
        await personalInfo.compleateYourProfile()
        await this.page.waitForTimeout(3000)
    }

    async NagaCapital_KYC_Mobile(email: string, password: string, country: string, countrycCode: string, phone: string, brand: string){
        let signUp = new SignUp(this.page);
        let mainPage = new MainPage(this.page);
        let personalInfo = new PersonalInformation(this.page)    
        //open platform and create lead user
        await signUp.goto(brand, 'register')
        await new Captcha(this.page).removeCaptcha()
        await signUp.createCFDUser(email, process.env.USER_PASSWORD || '', country, countrycCode, phone)
        //fill personal information popup
        await new YouAreInNagaMarkets(this.page).clickExplorePlatform()
        //switch to main page and click to Naga Start widget step
        await mainPage.clickOnMobileWidget('Step 1/4: NAGA Start')
        //await mainPage.removeNeedHelpBaloon()
        await new StartKYCPopup(this.page).startKYC();
        //After previous step - user sees next form. Add more information to personal info
        await personalInfo.compleateYourProfile()
        await this.page.waitForTimeout(3000)
    }

    async NagaMarkets_KYC_Advance(email: string, password: string, country:string, countryCode: string, phoneNumber: string, brand: string){
        let signUp = new SignUp(this.page);
        let kycStart = new KYC_Start(this.page);
        let quiz = new FullRegistration(this.page);
        let KYC_FinalStep = new FinalStep(this.page);
        //Create lead user 
        await signUp.goto(brand, 'register')
        await new Captcha(this.page).removeCaptcha()
        await signUp.createCfdUser_All(email, password, country, countryCode, phoneNumber);
        //fill personal information and verify user
        await new PersonalInformation(this.page).fillPersonalInformation('Verify with SMS')
        await new PhoneVerification(this.page).insertVerificationCode()
        //open KYC 
        await new YouAreInNagaMarkets(this.page).openNagaKyc()
        await kycStart.clickStartVerificationBtn()
        //fill kyc 
        await quiz.fill_KYC('Advance');
        await this.page.locator("//button[text()='Agree']").click()
        await this.page.waitForTimeout(500)
        await KYC_FinalStep.clickBtn('Deposit');
        await this.page.waitForTimeout(1500)
    }
    
    async NagaMarkets_UserLead(email: string, password: string, country:string, countryCode: string, phoneNumber: string, brand: string){
        // create lead user via UI
        await new SignUp(this.page).goto(brand, 'register')
        await new Captcha(this.page).removeCaptcha()
        await new SignUp(this.page).createCfdUser_All(email, password, country, countryCode, phoneNumber)
        //Fill personal information tab + Insert verification code
        await new PersonalInformation(this.page).fillPersonalInformation('Verify with SMS')
        await new PhoneVerification(this.page).insertVerificationCode()
      //go to main Page
        await new YouAreInNagaMarkets(this.page).clickExplorePlatform()
    }

    async NagaCapital_UserLead(email: string, password: string, country:string, phoneCode: string, phone: string, brand: string){
        //create lead user via ui
        await new SignUp(this.page).goto(brand, 'register')
        await new Captcha(this.page).removeCaptcha()
        await new SignUp(this.page).createCFDUser(email, password, country, phoneCode, phone)
    }

    async NagaMena_UserLead(email: string, brand: string){
        //create lead user via short registration
        await new SignUp(this.page).goto(brand, "register");
        await new Captcha(this.page).removeCaptcha()
        await new SignUp(this.page).createCfdUser_All(email, process.env.USER_PASSWORD || "", 'United Arab Emirates','+387', '603039647');
        //fill personal information
        await new PersonalInformation(this.page).fillPersonalInformation('Verify with SMS')
        //phone verification
        await new PhoneVerification(this.page).insertVerificationCode()
        await new YouAreInNagaMarkets(this.page).clickExplorePlatform()
    }

    async NagaMena_FullRegUser(email: string, brand: string){
        //create lead user via short registration
        await new SignUp(this.page).goto(brand, "register");
        await new Captcha(this.page).removeCaptcha()
        await new SignUp(this.page).createCfdUser_All(email, process.env.USER_PASSWORD || "", 'United Arab Emirates','+387', '603039647');
        //fill personal information
        await new PersonalInformation(this.page).fillPersonalInformation('Verify with SMS')
        //phone verification
        await new PhoneVerification(this.page).insertVerificationCode()
        await new YouAreInNagaMarkets(this.page).clickExplorePlatform()
        await new MainPage(this.page).clickOnWidgepPoint('Upgrade to Live')
        await new KYC_Start(this.page).clickStartVerificationBtn()
        await new MenaFullRegistration(this.page).fillKYC('Advance')
        await this.page.locator("//button[text()='Agree']").click()
        await new FinalStep(this.page).clickBtn('Deposit');
    }

    async NagaMena_KYC_Mobile(email: string, password: string, country:string, phoneCode: string, phone: string, brand: string){
        let signUp = new SignUp(this.page);
        let kycStart = new KYC_Start(this.page);
        email = new RandomUser().getRandomUserEmail()
        let mainPage = new MainPage(this.page)
        //create lead user via short registration
        await signUp.goto(brand, "register");
        await new Captcha(this.page).removeCaptcha()
        await signUp.createCfdUser_All(email, password,country,phoneCode,phone)
        //fill personal information
        await new PersonalInformation(this.page).fillPersonalInformation('Verify with SMS')
        //phone verification
        await new PhoneVerification(this.page).insertVerificationCode()
        await new YouAreInNagaMarkets(this.page).clickExplorePlatform()
        await mainPage.clickOnMobileWidget('Step 1/3: Upgrade to Live')
        await kycStart.clickStartVerificationBtn()
        await new MenaFullRegistration(this.page).fillKYC('Advance')
        await new FinalStep(this.page).clickBtn('Deposit');
    }

    async NagaAfrica_UserLead(email: string, brand: string){
        //create user on short registration page
        await new SignUp(this.page).goto(brand, "register");
        await new Captcha(this.page).removeCaptcha()
        await new SignUp(this.page).createCfdUser_All(email, process.env.USER_PASSWORD || "", 'South Africa','+387', '603039647');
        //Click Explore the platform btn
        await new YouAreInNagaMarkets(this.page).clickExplorePlatform()
    }
    async NagaAfrica_KYC_Mobile(email: string, password: string, country:string, phoneCode: string, phone: string, brand: string){
        let signUp = new SignUp(this.page)
        email = await new RandomUser().getRandomUserEmail()
        let KYC = new KYC_Africa(this.page)
        //create lead user
        await signUp.goto(brand, 'register')
        await new Captcha(this.page).removeCaptcha()
        await signUp.createCfdUser_All(email, password, country, phoneCode, phone)
        await new YouAreInNagaMarkets(this.page).clickOpenRealMoneyAccount()
        //fill start information
        await KYC.fillStartInformation()
        await this.page.waitForTimeout(4000)
    }
    async NagaAfrica_Lead_web(email: string, password: string, country:string, phoneCode: string, phone: string, brand: string){
        let signUp = new SignUp(this.page)
        let KYC = new KYC_Africa(this.page)
        let mainPage = new MainPage(this.page)
        await signUp.goto(brand, 'register')
        await new Captcha(this.page).removeCaptcha()
        await signUp.createCfdUser_All(email, password, country, phoneCode, phone)
        await new YouAreInNagaMarkets(this.page).clickOpenRealMoneyAccount()
        await KYC.fillStartInformation()
        await this.page.waitForTimeout(4000)
    }
}