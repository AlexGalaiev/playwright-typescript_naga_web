
import { expect } from "@playwright/test";
import { AllSetPopup } from "../../pageObjects/common/allSetPopup(KYC)/allSetPopup";
import { StartKYCPopup } from "../../pageObjects/common/startKYC_Popup/startKYCPage";
import { PersonalInformation } from "../../pageObjects/FullRegistration/NAGACapital-PersonalInformationPage";
import { PhoneVerification } from "../../pageObjects/FullRegistration/NAGACapital-PhoneVerification";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { SignUp } from "../../pageObjects/ShortRegistrationPage/SighUpPage";
import { AddAcountForm } from "../../pageObjects/UserProfile/AddTradingAccount";
import { HeaderMenuUserProfile } from "../../pageObjects/UserProfile/HeaderUserProfile";
import {test} from "../../test-options";
import { SignIn } from "../../pageObjects/SignIn/SignInPage";
import { KYC_Start } from "../../pageObjects/FullRegistration/NAGAMarkets-KYCStart";
import { FullRegistration } from "../../pageObjects/FullRegistration/NagaMarkets_FullRegistration";
import { FinalStep } from "../../pageObjects/FullRegistration/NAGAMarkets_KYCFinalStep";

test.describe("NagaCapital - Trading Accounts", async()=>{
    
  test("@23922 Create 2nd live account", {tag:['@secondAccount', '@prodSanity']},async({page, NagaCapital}, testInfo)=>{
    await testInfo.setTimeout(testInfo.timeout + 70000);
    let signUp = new SignUp(page);
    let mainPage = new MainPage(page);
    let addAccount = new AddAcountForm(page);
    let headerMenu = new HeaderMenuUserProfile(page);
    let signIn = new SignIn(page)
    let startKYC = new StartKYCPopup(page)
    await test.step('Create account with finished KYC', async ()=>{
        let email = await signUp.createLeadUserApiNagaCapital('BA', page)
        await signIn.goto(NagaCapital, 'login');
        await signIn.signInUserToPlatform(email, process.env.USER_PASSWORD || "")
        await signUp.makePhoneVerifed(page)
        await mainPage.mainPageIsDownLoaded();
        await mainPage.proceedRegistration();
        await startKYC.startKYC();
        await startKYC.proceedVerification();
        await new PersonalInformation(page).fillPersonalInformation();
        await new AllSetPopup(page).clickDepositNow();
    })
    await test.step('Add second live account in My Accounts', async()=>{
        await headerMenu.openAddNewTradingAccount();
        await addAccount.create_USD_LiveAccount();
        expect(await addAccount.checkNewLiveAccount()).toBeTruthy
    })
    await test.step('Add second demo account in My Accounts', async()=>{
        await headerMenu.openAddNewTradingAccount();
        await addAccount.create_EUR_DemoAccount();
        expect(await addAccount.checkNewDemoAccount()).toBeTruthy
    })
})

    type tradingAcTypes = {
        testRailId: string,
        brand: string,
        user: string,
    }
    const testTrAccountsParams: tradingAcTypes[] = [
        {testRailId: '@23930', brand: '@NS', user: 'userWithAccounts@i.ua'},
        {testRailId: '@23602', brand: '@NM', user: 'userWithAccounts2@i.ua'}
    ]
    for(const{testRailId, brand, user} of testTrAccountsParams){
        test(`${testRailId} Edit trading account information`, {tag:['@secondAccount']}, async({page}, testInfo)=>{
        await testInfo.setTimeout(testInfo.timeout + 90000);
        let signIn = new SignIn(page);
        let mainPage = new MainPage(page);
        let addAccountForm = new AddAcountForm(page);
        await test.step(`Login to platform by ${user} to ${brand}`, async()=>{
            await signIn.goto(await signIn.chooseBrand(brand),'login');
            await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
        })
        await test.step('Change account name of exist trading account', async()=>{
            await new HeaderMenuUserProfile(page).openAddNewTradingAccount();
            await addAccountForm.editLiveAccountName('Default_Live_account')
            expect(await addAccountForm.getDefaultAccountName()).toEqual('Default_Live_account')
            await addAccountForm.editLiveAccountName('NAGA - USD');
        })
        await test.step('Check possibility to show password of trading account', async()=>{
            await addAccountForm.openShowPasswordPopup();
            expect(await addAccountForm.checkPasswordContainerIsVisibel()).toBeTruthy()
        })
    })
}

const testAccountSwitchingParams: tradingAcTypes[] = [
    {testRailId: '@25130', brand: '@NS', user: 'userWithAccounts@i.ua'},
    {testRailId: '@25187', brand: '@NM', user: 'userWithAccounts2@i.ua'}
]
for(const{testRailId, brand, user} of testAccountSwitchingParams){
    test(`${testRailId} Account switching between trading accounts`, {tag:['@secondAccount', '@prodSanity']}, async({page}, testInfo)=>{
        await testInfo.setTimeout(testInfo.timeout + 70000);
        let signIn = new SignIn(page);
        let mainPage = new MainPage(page)
        await test.step("Login to platform", async()=>{
            await signIn.goto(await signIn.chooseBrand(brand),'login');
            await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
        })
        await test.step("Switch to second trading account", async()=>{
            await mainPage.openTradingAssountsMenu();
            let notActiveAccountId = await mainPage.getNotActiveTradingAccountId()
            await mainPage.switchUserToNotActiveAccount();
            expect(await mainPage.getActiveTradingAccountId()).toEqual(notActiveAccountId)
        })
        await test.step("Switch back to main account", async()=>{
            await mainPage.openTradingAssountsMenu();
            await mainPage.switchUserToNotActiveAccount();
        })})}})

test.describe('Naga Markets - Trading accounts', async()=>{
    test('@23600 Create 2nd live account', {tag:['@secondAccount', '@prodSanity']}, async({page, NagaMarkets}, testInfo)=>{
        await testInfo.setTimeout(testInfo.timeout + 150000);
        let KYC_Advance = "Advance";
        let signIn = new SignIn(page)
        let signUp = new SignUp(page)
        let mainPage = new MainPage(page)
        let kycStart = new KYC_Start(page)
        let verification = new PhoneVerification(page);
        let quiz = new FullRegistration(page);
        let KYC_FinalStep = new FinalStep(page);
        let addAccount = new AddAcountForm(page);
        let headerMenu = new HeaderMenuUserProfile(page);
        await test.step("Create new fully registered user", async () => {
            let email = await signUp.createLeadUserApi("FR");
            await signIn.goto(NagaMarkets, "login");
            await signIn.signInUserToPlatform(email, process.env.USER_PASSWORD || "");
            await mainPage.clickUpgradeBtn();
            await kycStart.clickStartVerificationBtn();
            await verification.acceptPhoneNumber();
            await verification.MN_insertVerificationCode();
            await verification.waitPersonalDetails();
            await quiz.fill_KYC(KYC_Advance);
            expect(await KYC_FinalStep.getUsersScorring()).toEqual("Advanced");
            await KYC_FinalStep.clickFundAccount()
        })
        await test.step('Add second live account', async()=>{
            await headerMenu.openAddNewTradingAccount();
            await addAccount.create_USD_LiveAccount();
            expect(await addAccount.checkNewLiveAccount()).toBeTruthy
        })
        await test.step('Add second demo account', async()=>{
            await headerMenu.openAddNewTradingAccount();
            await addAccount.create_EUR_DemoAccount();
            expect(await addAccount.checkNewDemoAccount()).toBeTruthy
        })
})
})