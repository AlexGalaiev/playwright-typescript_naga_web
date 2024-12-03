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

test("@24917 NAGA Capital. KYC Advance",{tag:['@kyc', '@prodSanity']}, async({ page, NagaCapital }, testInfo)=>{
    await testInfo.setTimeout(testInfo.timeout + 50000);
    let signUp = new SignUp(page);
    let signIn = new SignIn(page)
    let mainPage = new MainPage(page);
    let startKyc = new StartKYCPopup(page)
    let verificationPopup = new VerificationPopup(page);
    let email = await signUp.createLeadUserApi("BA")
    await test.step(`Create lead user via API. Login by ${email} to platform`, async ()=>{
        await signIn.goto(NagaCapital, 'login');
        await signIn.signInUserToPlatform(email, process.env.USER_PASSWORD || "")
    });
    await test.step('Redirect to main page and begin register process', async ()=>{
        await mainPage.mainPageIsDownLoaded()
        await mainPage.proceedRegistration();
        await startKyc.startKYC();
    });
    await test.step('Fill personal information step', async() =>{
        await new PersonalInformation(page).fillPersonalInformation();
        await new AllSetPopup(page).clickDepositNow();
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
        expect(await verificationPopup.verificationPoupIsDisplyed()).toBeVisible()
        await verificationPopup.skipVerificationStep();
        expect(await mainPage.getStatusOfHeaderStep(3)).toEqual('To do')
        expect(await mainPage.getStatusTextOfHeaderStep(3)).toEqual('Complete Progress level and verify address')
    })
})