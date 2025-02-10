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

test("@24917 NAGA Capital. KYC Advance",{tag:['@kyc', '@prodSanity','@smoke', '@KYC_Capital']}, 
    async({ page, NagaCapital, NSCountry }, testInfo)=>{
    testInfo.setTimeout(testInfo.timeout + 80000);
    let signUp = new SignUp(page);
    let mainPage = new MainPage(page);
    let personalInfo = new PersonalInformation(page)
    let verificationPopup = new VerificationPopup(page);
    let email = await new RandomUser().getRandomUserEmail() 
    await test.step(`Create lead user with ${email} on Short registration page.`, async ()=>{
        await signUp.goto(NagaCapital, 'register')
        await new Captcha(page).removeCaptcha()
        await signUp.createCFDUser(email, process.env.USER_PASSWORD || '', NSCountry)
    });
    await test.step('Open main page and switch to Compleate profile KYC. Fill KYC and go to main page.', async() =>{
        await new YouAreInNagaMarkets(page).clickExplorePlatform()
        await mainPage.clickOnWidgepPoint('NAGA Start')
        await new StartKYCPopup(page).startKYC();
        await personalInfo.compleateYourProfile()
    });
    await test.step('Check name of the widget banner "Naga start". Assert that Compleate profile popup is hidden', async()=>{
        await mainPage.openHeaderMenuPoint("feed");
        expect(await mainPage.getStatusOfWidgetStep('NAGA Start')).toContain('--finished')
        expect(await mainPage.getStatusOfWidgetStep('Deposit')).toContain('--active')
    })
    await test.step('Open step:  Naga progres. User clicks on Finished btn(KYC is prefield)', async()=>{
        await mainPage.clickOnWidgepPoint('NAGA Progress')
        await new StartKYCPopup(page).startKYC();
        await new UdpateAccount(page).clickFinishBtn();
    });
    await test.step('User see"s Verification popup', async()=>{
        expect(await verificationPopup.verificationPoupIsDisplyed()).toBeVisible()
        await verificationPopup.skipVerificationStep();
    })
})