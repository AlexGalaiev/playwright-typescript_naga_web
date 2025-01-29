import {test} from "../../test-options"
import { SignUp } from "../../pageObjects/ShortRegistrationPage/SighUpPage";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { StartKYCPopup } from "../../pageObjects/common/startKYC_Popup/startKYCPage";
import { PersonalInformation } from "../../pageObjects/FullRegistration/NAGACapital-PersonalInformationPage";
import { expect } from "@playwright/test";
import { AllSetPopup } from "../../pageObjects/common/allSetPopup(KYC)/allSetPopup";
import { UdpateAccount } from "../../pageObjects/FullRegistration/NAGACapital-UpdateAccount";
import { VerificationPopup } from "../../pageObjects/VerificationCenter/verificationPopup";
import { SignIn } from "../../pageObjects/SignIn/SignInPage";
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser";
import { PhoneVerification } from "../../pageObjects/FullRegistration/NAGACapital-PhoneVerification";
import { YouAreInNagaMarkets } from "../../pageObjects/FullRegistration/components/NAGAMarkets_YouAreInpopup";
import { Captcha } from "../../pageObjects/captcha";

test("@24917 NAGA Capital. KYC Advance",{tag:['@kyc', '@prodSanity','@smoke', '@debug']}, 
    async({ page, NagaCapital, NSCountry }, testInfo)=>{
    testInfo.setTimeout(testInfo.timeout + 60000);
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
    await test.step('User see"s Verification popup and check statuses of widget banner', async()=>{
        expect(await verificationPopup.verificationPoupIsDisplyed()).toBeVisible()
        await verificationPopup.skipVerificationStep();
        expect(await mainPage.getStatusOfWidgetStep('NAGA Progress')).toContain('--next')
        expect(await mainPage.getStatusOfWidgetStep('NAGA Ultimate')).toContain('--next')
    })
})