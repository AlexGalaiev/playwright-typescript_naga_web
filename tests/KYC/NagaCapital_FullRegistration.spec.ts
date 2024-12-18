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

test("@24917 NAGA Capital. KYC Advance",{tag:['@kyc', '@prodSanity','@smoke']}, async({ page, NagaCapital }, testInfo)=>{
    testInfo.setTimeout(testInfo.timeout + 60000);
    let signUp = new SignUp(page);
    let mainPage = new MainPage(page);
    let personalInfo = new PersonalInformation(page)
    let verificationPopup = new VerificationPopup(page);
    let email = await new RandomUser().getRandomUserEmail() 
    await test.step(`Create lead user with ${email}`, async ()=>{
        await signUp.goto(NagaCapital, 'register')
        await signUp.createCFDUser(email, process.env.USER_PASSWORD || '','Bosnia and Herzegovina')
    });
    await test.step('Fill personal information step', async() =>{
        await personalInfo.fillPersonalInformation('Continue');
        await new YouAreInNagaMarkets(page).clickOpenRealMoneyAccount()
        await personalInfo.compleateYourProfile()
        await personalInfo.clickDepositNow()
    });
    await test.step('Check status on second step on header banner', async()=>{
        expect(await mainPage.getStatusOfHeaderStep(2)).toEqual('To do')
        expect(await mainPage.getStatusTextOfHeaderStep(2)).toEqual('Verify identity')
    })
    await test.step('Update account to next level', async()=>{
        await mainPage.updateUserLevel();
        await new StartKYCPopup(page).startKYC();
        await new UdpateAccount(page).clickFinishBtn();
    });
    await test.step('Check verification step (header step)', async()=>{
       // expect(await verificationPopup.verificationPoupIsDisplyed()).toBeVisible()
        await verificationPopup.skipVerificationStep();
        expect(await mainPage.getStatusOfHeaderStep(3)).toEqual('To do')
        expect(await mainPage.getStatusTextOfHeaderStep(3)).toEqual('Complete Progress level and verify address')
    })
})