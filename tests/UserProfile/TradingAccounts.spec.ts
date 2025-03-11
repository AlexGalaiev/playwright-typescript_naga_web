
import { expect } from "@playwright/test";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { AddAcountForm } from "../../pageObjects/UserProfile/AddTradingAccount";
import { HeaderMenuUserProfile } from "../../pageObjects/UserProfile/HeaderUserProfile";
import {test} from "../../test-options";
import { SignIn } from "../../pageObjects/SignIn/SignInPage";
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser";
import { KYC_General } from "../../pageObjects/FullRegistration/NagaBrands_KycRegistrations";

test.describe("New Trading account", async()=>{
    
  test("@23922 Naga Capital. Create 2nd live account", {tag:['@secondAccount']}, 
    async({page, AppNAGA}, testInfo)=>{
    testInfo.setTimeout(testInfo.timeout + 70000);
    let addAccount = new AddAcountForm(page);
    let headerMenu = new HeaderMenuUserProfile(page);
    let email = await new RandomUser().getRandomUserEmail()
    let KYC_Registration = new KYC_General(page)

    await test.step(`Create lead user ${email} and finish KYC`, async()=>{
        await KYC_Registration.NagaCapital_KYC_HighScore(
            email, 
            process.env.USER_PASSWORD || '', 
            'Bosnia and Herzegovina',
            '+387',
            '603039647',
            AppNAGA)
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
        {testRailId: '@23930', brand: '@Capital', user: 'userWithAccounts@i.ua'},
        {testRailId: '@23602', brand: '@Markets', user: 'userWithAccounts2@i.ua'},
    ]
    for(const{testRailId, brand, user} of testTrAccountsParams){
        test(`${testRailId} ${brand} Edit trading account information `, {tag:['@secondAccount','@web']}, async({page, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 90000);
        let signIn = new SignIn(page);
        let addAccountForm = new AddAcountForm(page);
        await test.step(`Login to platform by ${user} to ${brand}`, async()=>{
            await signIn.goto(AppNAGA,'login');
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
    {testRailId: '@25130', brand: '@Capital', user: 'userWithAccounts@i.ua'},
    {testRailId: '@25187', brand: '@Markets', user: 'userWithAccounts2@i.ua'}
]
for(const{testRailId, brand, user} of testAccountSwitchingParams){
    test(`${testRailId} ${brand} Switching between trading accounts`, {tag:['@secondAccount','@web']}, async({page, AppNAGA}, testInfo)=>{
        await testInfo.setTimeout(testInfo.timeout + 70000);
        let signIn = new SignIn(page);
        let mainPage = new MainPage(page)
        await test.step(`Login to platform by ${user} user`, async()=>{
            await signIn.goto(AppNAGA,'login');
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

    test('@23600 Naga Markets. Create 2nd live account', {tag:['@secondAccount','@web']}, 
        async({page, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 170000);
        let addAccount = new AddAcountForm(page);
        let headerMenu = new HeaderMenuUserProfile(page);
        let email = await new RandomUser().getRandomUserEmail()
        await test.step(`Create lead user ${email} and fill KYC`, async()=>{
            await new KYC_General(page).NagaMarkets_KYC_Advance(
                email, 
                process.env.USER_PASSWORD || '',
                'France',
                '+387',
                '603039647',
                AppNAGA)
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
        })})

   
    test(`@25400 NagaMena Create 2nd live account`, {tag:['@secondAccount','@web']},
        async({page, AppNAGA}, testInfo)=>{
    testInfo.setTimeout(testInfo.timeout + 120000);
    let addAccount = new AddAcountForm(page);
    let headerMenu = new HeaderMenuUserProfile(page);
    let email = await new RandomUser().getRandomUserEmail() 
    await test.step(`Create lead user with ${email}`, async()=>{
        await new KYC_General(page).NagaMena_FullRegUser(
            email,
            AppNAGA)
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