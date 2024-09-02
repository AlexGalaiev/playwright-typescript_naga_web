import {test} from "../../test-options"
import { SighUp } from "../../pageObjects/ShortRegistrationPage/SighUpPage";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { StartKYCPopup } from "../../pageObjects/common/startKYC_Popup/startKYCPage";
import { PhoneVerification } from "../../pageObjects/FullRegistration/NAGACapital-PhoneVerification";
import { PersonalInformation } from "../../pageObjects/FullRegistration/NAGACapital-PersonalInformationPage";
import { expect } from "@playwright/test";
import { AllSetPopup } from "../../pageObjects/common/allSetPopup(KYC)/allSetPopup";
import { UdpateAccount } from "../../pageObjects/FullRegistration/NAGACapital-UpdateAccount";
import { VerificationPopup } from "../../pageObjects/VerificationCenter/verificationPopup";
import { SighIn } from "../../pageObjects/SighIn/SignInPage";

test("@24917 NAGA Capital full registration user", async({ page, NagaCapital, NSCountry })=>{
    let sighUp = new SighUp(page);
    let sighIn = new SighIn(page)
    let mainPage = new MainPage(page);
    let startKyc = new StartKYCPopup(page)
    let phoneVerification = new PhoneVerification(page);
    let verificationPopup = new VerificationPopup(page);
    await test.step('Short registration of lead user', async ()=>{
        let email = await sighUp.createLeadUserApiNagaCapital('BA', page)
        await sighIn.goto(NagaCapital, 'login');
        await sighIn.sigInUserToPlatform(email, process.env.USER_PASSWORD || "")
    });
    await test.step('Check trading accounts', async()=>{
        await sighUp.makePhoneVerifed(page)
        await mainPage.mainPageIsDownLoaded();
        expect(await mainPage.getActiveTradingAccountType()).toEqual('DEMO')
        await mainPage.openTradingAssountsMenu();
        expect(await mainPage.getNumberOfTradingAccounts()).toEqual(1)
    })
    await test.step('Check header step view', async()=>{
        expect(await mainPage.getStatusOfHeaderStep(1)).toEqual('To do');
        expect(await mainPage.getStatusTextOfHeaderStep(1)).toEqual('Complete now')
    })
    await test.step('Redirect to main page and begin FR process', async ()=>{
        await mainPage.proceedRegistration();
        await startKyc.startKYC();
        await startKyc.proceedVerification();
    });
    await test.step('Fill personal information step', async() =>{
        await new PersonalInformation(page).fillPersonalInformation();
        await new AllSetPopup(page).clickDepositNow();
    });
    await test.step("Check number of accounts", async()=>{
        expect(await mainPage.getNumberOfTradingAccounts()).toEqual(2)
    });
    await test.step('Check status on second step', async()=>{
        expect(await mainPage.getStatusOfHeaderStep(2)).toEqual('To do')
        expect(await mainPage.getStatusTextOfHeaderStep(2)).toEqual('Verify identity')
    })
    await test.step('Update account to next level', async()=>{
        await mainPage.updateUserLevel();
        await new StartKYCPopup(page).startKYC();
        await new UdpateAccount(page).clickFinishBtn();
    });
    await test.step('Check verification popup', async()=>{
        expect(await verificationPopup.verificationPoupIsDisplyed()).toBeVisible()
        await verificationPopup.skipVerificationStep();
        expect(await mainPage.getStatusOfHeaderStep(3)).toEqual('To do')
        expect(await mainPage.getStatusTextOfHeaderStep(3)).toEqual('Complete Progress level and verify address')
    })
})