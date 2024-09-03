import { expect } from "playwright/test";
import { PhoneVerification } from "../../pageObjects/FullRegistration/NAGACapital-PhoneVerification";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { SighUp } from "../../pageObjects/ShortRegistrationPage/SighUpPage";
import { VerificationPopup } from "../../pageObjects/VerificationCenter/verificationPopup";
import { test } from "..//..//test-options";
import { StartKYCPopup } from "../../pageObjects/common/startKYC_Popup/startKYCPage";
import { PersonalInformation } from "../../pageObjects/FullRegistration/NAGACapital-PersonalInformationPage";
import { AllSetPopup } from "../../pageObjects/common/allSetPopup(KYC)/allSetPopup";
import { MyAccounts } from "../../pageObjects/MainPage/MyAccounts";
import { getLocalization } from "../../pageObjects/localization/getText";
import { UdpateAccount } from "../../pageObjects/FullRegistration/NAGACapital-UpdateAccount";
import { SighIn } from "../../pageObjects/SighIn/SignInPage";

test.describe("Naga Capital. Verification", async() => {
  
  test.beforeEach("Create lead", async ({ page, NagaCapital }) => {
    let sighUp = new SighUp(page);
    let sighIn = new SighIn(page)
    let mainPage = new MainPage(page);
    let startKYC = new StartKYCPopup(page)
    await test.step('Create fully registered user', async()=>{
      let email = await sighUp.createLeadUserApiNagaCapital('BA', page)
        await sighIn.goto(NagaCapital, 'login');
        await sighIn.sigInUserToPlatform(email, process.env.USER_PASSWORD || "")
        await sighUp.makePhoneVerifed(page)
        await mainPage.proceedRegistration();
        await startKYC.startKYC();
        await startKYC.proceedVerification();
        await new PersonalInformation(page).fillPersonalInformation();
        await new AllSetPopup(page).clickDepositNow();
    })
  });

  test('@23599 Check my documents page', async({page})=>{
    let myAccounts = new MyAccounts(page);
    let mainPage = new MainPage(page)
    let verificationPopup = new VerificationPopup(page);
    let localization = await new getLocalization('/pageObjects/localization/NagaCapital_Verification.json')
    await test.step('Check header steps and my accounts menu point', async()=>{
        expect(await mainPage.getStatusOfHeaderStep(2)).toEqual('To do');
        expect(await mainPage.getStatusTextOfHeaderStep(2)).toEqual('Verify identity');
        await myAccounts.openUserMenu()
        await myAccounts.openMyAccountsMenuItem('My Documents')
        expect(await verificationPopup.getNoDataRequestedDocuments()).toEqual(await localization.getLocalizationText('MyDocuments_RequestedDocuments_NoData'))
        expect(await verificationPopup.getNoDataDocumentsHistory()).toEqual(await localization.getLocalizationText('MyDocuments_DocumentUploadHistory_NoData'));
    })
    await test.step('Compleate registration', async()=>{
        await mainPage.updateUserLevel();
        await new StartKYCPopup(page).startKYC();
        await new UdpateAccount(page).clickFinishBtn();
        expect(await verificationPopup.verificationPoupIsDisplyed()).toBeVisible()
        await verificationPopup.skipVerificationStep();
    })
    await test.step('Check header steps, My Documents', async()=>{
        expect(await mainPage.getStatusOfHeaderStep(2)).toEqual('In Progress')
        expect(await mainPage.getStatusTextOfHeaderStep(2)).toEqual('Verify identity')
        await myAccounts.openUserMenu()
        await myAccounts.openMyAccountsMenuItem('My Documents')
        expect(await verificationPopup.getStatusOdDocuments()).toEqual('Requested')
    })
  })
});
