import { expect } from "@playwright/test";
import { Captcha } from "../../pageObjects/captcha";
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser";
import { test } from "../../test-options";

test("Mobile. KYC Advance",
    {tag:['@KYC_Capital', '@mobile']}, 
    async({ app, AppNAGA, NSCountry }, testInfo)=>{
    testInfo.setTimeout(testInfo.timeout + 80000);
    let email = await new RandomUser().getRandomUserEmail() 
    await test.step(`Create lead user with ${email} on Short registration page.`, async ()=>{
        await app.signUp.goto(AppNAGA, 'register')
        await new Captcha(app.page).removeCaptcha()
        await app.signUp.createCFDUser(email, process.env.USER_PASSWORD || '', NSCountry,'+387', '603039647')
    });
    await test.step('Open main page and switch to Compleate profile KYC. Fill KYC and go to main page.', async() =>{
        await app.youAreIn.clickExplorePlatform()
        await app.mainPage.clickOnMobileWidget('Step 1/4: NAGA Start')
        await app.kycStartPopup.startKYC();
        await app.personalInformation.compleateYourProfile()
    });
    await test.step('Check name of the widget banner "Naga start". Assert that Compleate profile popup is hidden', async()=>{
        await app.mainPage.openMobileBackMenuPoint('Profile Status')
        await app.mainPage.clickOnWidgepPoint('NAGA Progress')
    })
    await test.step('Open step:  Naga progres. User clicks on Finished btn(KYC is prefield)', async()=>{
        await app.kycStartPopup.startKYC();
        await app.kycUpdatePopup.clickFinishBtn();
    });
    await test.step('User see"s Verification popup', async()=>{
        expect(await app.verificationPopup.verificationPoupIsDisplyed()).toBeVisible()
        expect(await app.mainPage.getUrl()).toContain('verification')
    })
})