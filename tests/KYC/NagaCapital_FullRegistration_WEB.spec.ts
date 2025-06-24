import {test} from "../../test-options"
import { SignUp } from "../../pageObjects/ShortRegistrationPage/SighUpPage";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { StartKYCPopup } from "../../pageObjects/common/startKYC_Popup/startKYCPage";
import { PersonalInformation } from "../../pageObjects/FullRegistration/NAGACapital-PersonalInformationPage";
import { expect } from "@playwright/test";
import { UdpateAccount } from "../../pageObjects/FullRegistration/NAGACapital-UpdateAccount";
import { VerificationPopup } from "../../pageObjects/VerificationCenter/verificationPopup";
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser";
import { YouAreInNagaMarkets } from "../../pageObjects/FullRegistration/components/NAGAMarkets_YouAreInpopup";
import { Captcha } from "../../pageObjects/captcha";
import { MyAccounts } from "../../pageObjects/MainPage/MyAccounts";

test.describe('WEB', async()=>{
    test("NagaCapital KYC Advance",{tag:['@kyc', '@prodSanity','@smoke', '@KYC_Capital','@web']}, 
        async({ app, AppNAGA, NSCountry }, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 80000);
        let scoring_AML = 0.45
        let scoring_General = 0.25 
        let AML
        let Scoring
        let email = await new RandomUser().getRandomUserEmail() 
        await test.step(`Create lead user with ${email} on Short registration page.`, async ()=>{
            await app.signUp.goto(AppNAGA, 'register')
            await new Captcha(app.page).removeCaptcha()
            await app.signUp.createCFDUser(email, process.env.USER_PASSWORD || '', NSCountry, '+387', '603039647')
        });
        await test.step('Open main page and switch to Compleate profile KYC. Fill KYC and go to main page.', async() =>{
            await app.youAreIn.clickExplorePlatform()
            await app.mainPage.clickOnWidgepPoint('NAGA Start')
            await app.kycStartPopup.startKYC();
            await app.personalInformation.compleateYourProfile()
        });
        await test.step('Check name of the widget banner "Naga start". Assert that Compleate profile popup is hidden', async()=>{
            await app.mainPage.openBackMenuPoint("feed");
            expect(await app.mainPage.getStatusOfWidgetStep('NAGA Start')).toContain('--finished')
            expect(await app.mainPage.getStatusOfWidgetStep('Deposit')).toContain('--active')
        })
        await test.step('Open step:  Naga progres. User clicks on Finished btn(KYC is prefield)', async()=>{
            await app.mainPage.clickOnWidgepPoint('NAGA Progress')
            await app.kycStartPopup.startKYC();
            [AML, Scoring] = await app.kycUpdatePopup.clickFinishBtn();
            expect(AML).toEqual(scoring_AML)
            expect(Scoring).toEqual(scoring_General)
        });
        await test.step('User see"s Verification popup', async()=>{
            expect(await app.verificationPopup.verificationPoupIsDisplyed()).toBeVisible()
            await app.verificationPopup.skipVerificationStep();
        })
    })
    
})
