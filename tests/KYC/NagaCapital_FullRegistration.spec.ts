import {test} from "../../test-options"
import { SignUp } from "../../pageObjects/ShortRegistrationPage/SighUpPage";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { StartKYCPopup } from "../../pageObjects/common/startKYC_Popup/startKYCPage";
import { PhoneVerification } from "../../pageObjects/FullRegistration/NAGACapital-PhoneVerification";
import { PersonalInformation } from "../../pageObjects/FullRegistration/NAGACapital-PersonalInformationPage";
import { expect } from "@playwright/test";
import { AllSetPopup } from "../../pageObjects/common/allSetPopup(KYC)/allSetPopup";
import { UdpateAccount } from "../../pageObjects/FullRegistration/NAGACapital-UpdateAccount";
import { VerificationPopup } from "../../pageObjects/VerificationCenter/verificationPopup";

test("@24917 NAGA Capital full registration user", async({ page, NagaCapital })=>{
    let sighUp = new SignUp(page);
    let mainPage = new MainPage(page);
    await test.step('Short registration of lead user', async ()=>{
        await sighUp.goto(NagaCapital, 'register');
        await sighUp.createCFDUser("Ukraine");
    });
    await test.step('Check trading accounts on main Page', async()=>{
        await mainPage.mainPageIsDownLoaded();
        await mainPage.getTradingAccountStatus() === 'DEMO'
        await mainPage.openTradingAssountsMenu();
        expect(await mainPage.getNumberOfTradingAccounts()).toEqual(1)
    })
    await test.step('Redirect to main page and begin FR process', async ()=>{
        await mainPage.proceedRegistration();
        await new StartKYCPopup(page).startKYC();
    });
    await test.step('Verification of phone number', async() =>{
        let phoneVerification = new PhoneVerification(page);
        await phoneVerification.insertTestPhoneNumber();
        await phoneVerification.insertVerificationCode();
    })
    await test.step('Fill personal information step', async() =>{
        await new PersonalInformation(page).fillPersonalInformation();
        await new AllSetPopup(page).clickDepositNow();
    })
    await test.step("Check number of accounts", async()=>{
        expect(await mainPage.getNumberOfTradingAccounts()).toEqual(2)
    })
    await test.step('Update account to next level', async()=>{
        await mainPage.updateUserLevel();
        await new StartKYCPopup(page).startKYC();
        await new UdpateAccount(page).clickFinishBtn();
    });
    await test.step('Check verification popup', async()=>{
        let verificationPopup = new VerificationPopup(page);
        expect(await verificationPopup.verificationPoupIsDisplyed()).toBeVisible()
    })
})