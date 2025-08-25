import {test} from "../../test-options"
import { expect } from "@playwright/test";
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser";
import { Captcha } from "../../pageObjects/captcha";

test.describe('WEB', async()=>{
    test("NagaCapital KYC Advance",{tag:['@kyc', '@prodSanity', '@KYC_Capital','@web']}, 
        async({ app, AppNAGA, NSCountry }, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 80000);
        let scoring_AML = 0.99
        //let scoring_General = 0.25 
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
            // await app.personalInformation.verifyYouPhoneNumber()
            // await app.phoneVerification.NS_insertVerificationCode()
            await app.personalInformation.compleateYourProfile()
            await app.personalInformation.fillLocationInformation()
            await app.personalInformation.fillPersonalDetailsInformation()
        });
        await test.step('Check name of the widget banner "Naga start". Assert that Compleate profile popup is hidden', async()=>{
            expect(await app.deposit.checkManageFundsPopupIsVisible()).toBeTruthy()
            await app.deposit.closeManageFundsPopup()
            await app.mainPage.openBackMenuPoint("feed");
            expect(await app.mainPage.getStatusOfWidgetStep('NAGA Start')).toContain('--finished')
            expect(await app.mainPage.getStatusOfWidgetStep('Deposit')).toContain('--active')
        })
        await test.step('Open step:  Naga progres. User clicks on Finished btn(KYC is prefield)', async()=>{
            await app.mainPage.clickOnWidgepPoint('NAGA Progress');
            //await app.kycStartPopup.startKYC()
            [AML, Scoring] = await app.kycUpdatePopup.clickFinishBtn();
            expect(AML).toEqual(scoring_AML)
           // expect(Scoring).toEqual(scoring_General)
        });
        await test.step('User see"s Verification popup', async()=>{
            expect(await app.verificationPopup.verificationPoupIsDisplyed()).toBeVisible()
            await app.verificationPopup.skipVerificationStep();
        })
    })
    
})
