
import { expect } from "@playwright/test";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { AddAcountForm } from "../../pageObjects/UserProfile/AddTradingAccount";
import { HeaderMenuUserProfile } from "../../pageObjects/UserProfile/HeaderUserProfile";
import {test} from "../../test-options";
import { SignIn } from "../../pageObjects/SignIn/SignInPage";
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser";
import { KYC_General } from "../../pageObjects/FullRegistration/NagaBrands_KycRegistrations";
import { MyAccounts } from "../../pageObjects/MainPage/MyAccounts";

test.describe("New Trading account", async()=>{
    
    test("@23922 Naga Capital. Create 2nd live account", {tag:['@secondAccount', '@UI', '@web']}, 
        async({page, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 90000);
        let addAccount = new AddAcountForm(page);
        let myAccounts = new MyAccounts(page)
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
            await myAccounts.openUserMenu()
            await myAccounts.openMyAccountMenuItem('Trading Accounts')
            await addAccount.clickAddAccountBtn()
            await addAccount.createMobileAccount('Live Account','Live_USD', 'USD');
            await addAccount.acceptSuccessPopupWeb()
            expect(await addAccount.checkNewLiveAccount()).toBeTruthy
        })
        await test.step('Add second demo account in My Accounts', async()=>{
            await addAccount.clickAddAccountBtn()
            await addAccount.createMobileAccount('Demo Account','Demo_USD', 'USD');
            await addAccount.acceptSuccessPopupWeb()
            expect(await addAccount.checkNewDemoAccount()).toBeTruthy
        })
    })

    test('@23600 Naga Markets. Create 2nd live account', {tag:['@secondAccount', '@UI', '@web']}, 
        async({page, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 190000);
        let addAccount = new AddAcountForm(page);
        let email = await new RandomUser().getRandomUserEmail()
        let myAccounts = new MyAccounts(page)
        await test.step(`Create lead user ${email} and fill KYC`, async()=>{
            await new KYC_General(page).NagaMarkets_KYC_Advance(
                email, 
                process.env.USER_PASSWORD || '',
                'France',
                '+387',
                '603039647',
                AppNAGA)
        })
        await test.step('Add second live account in My Accounts', async()=>{
            await myAccounts.openUserMenu()
            await myAccounts.openMyAccountMenuItem('Trading Accounts')
            await addAccount.clickAddAccountBtn()
            await addAccount.createMobileAccount('Live Account','Live_USD', 'USD');
            await addAccount.acceptSuccessPopupWeb()
            expect(await addAccount.checkNewLiveAccount()).toBeTruthy
        })
        await test.step('Add second demo account in My Accounts', async()=>{
            await addAccount.clickAddAccountBtn()
            await addAccount.createMobileAccount('Demo Account','Demo_USD', 'USD');
            await addAccount.acceptSuccessPopupWeb()
            expect(await addAccount.checkNewDemoAccount()).toBeTruthy
        })
    })

    test(`@25400 NagaMena Create 2nd live account`, {tag:['@secondAccount', '@UI', '@web']},
        async({page, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 140000);
        let addAccount = new AddAcountForm(page);
        let email = await new RandomUser().getRandomUserEmail()
        let myAccounts = new MyAccounts(page) 
        await test.step(`Create lead user with ${email}`, async()=>{
            await new KYC_General(page).NagaMena_FullRegUser(
                email,
                AppNAGA)
        })
        await test.step('Add second live account in My Accounts', async()=>{
            await myAccounts.openUserMenu()
            await myAccounts.openMyAccountMenuItem('Trading Accounts')
            await addAccount.clickAddAccountBtn()
            await addAccount.createMobileAccount('Live Account','Live_USD', 'USD');
            await addAccount.acceptSuccessPopupWeb()
            expect(await addAccount.checkNewLiveAccount()).toBeTruthy
        })
        await test.step('Add second demo account in My Accounts', async()=>{
            await addAccount.clickAddAccountBtn()
            await addAccount.createMobileAccount('Demo Account','Demo_USD', 'USD');
            await addAccount.acceptSuccessPopupWeb()
            expect(await addAccount.checkNewDemoAccount()).toBeTruthy
        })
    })

    test('@25400 NagaAfrica. Create 2nd live account', {tag:['@secondAccount', '@UI', '@web']}, 
        async({page, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 140000);
        let addAccount = new AddAcountForm(page);
        let myAccounts = new MyAccounts(page) 
        let email = await new RandomUser().getRandomUserEmail() 
        await test.step(`Create lead user with ${email}`, async()=>{
            await new KYC_General(page).NagaAfrica_Lead_web(
                email,
                process.env.USER_PASSWORD || '',
                'South Africa',
                '+387',
                '603039647',
                AppNAGA
            )
        })
        await test.step('Add second live account in My Accounts', async()=>{
            await myAccounts.openUserMenu()
            await myAccounts.openMyAccountMenuItem('Trading Accounts')
            await addAccount.clickAddAccountBtn()
            await addAccount.createMobileAccount('Live Account','Live_USD', 'USD');
            await addAccount.acceptSuccessPopupWeb()
            expect(await addAccount.checkNewLiveAccount()).toBeTruthy
        })
        await test.step('Add second demo account in My Accounts', async()=>{
            await addAccount.clickAddAccountBtn()
            await addAccount.createMobileAccount('Demo Account','Demo_USD', 'USD');
            await addAccount.acceptSuccessPopupWeb()
            expect(await addAccount.checkNewDemoAccount()).toBeTruthy
        })
    })
})

test.describe('Actions with second account', async()=>{
    type tradingAcTypes = {
        testRailId: string,
        brand: string,
        user: string,
    }
    const testTrAccountsParams: tradingAcTypes[] = [
        {testRailId: '@23930', brand: '@Capital', user: 'leadUserCapital@naga.com'},
        {testRailId: '@23602', brand: '@Markets', user: 'leadUserMarkets@naga.com'},
        {testRailId: '@23602', brand: '@Mena', user: 'leadUserMena@naga.com'},
        {testRailId: '@23602', brand: '@Africa', user: 'leadUserAfrica@naga.com'},
    ]
    for(const{testRailId, brand, user} of testTrAccountsParams){
        test(`${testRailId} ${brand} Edit trading account information `, 
            {tag:['@secondAccount','@UI', '@web']}, async({page, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 90000);
        let signIn = new SignIn(page);
        let addAccountForm = new AddAcountForm(page)
        let myAccounts = new MyAccounts(page) 
        await test.step(`Login to platform by ${user} to ${brand}`, async()=>{
            await signIn.goto(AppNAGA,'login');
            await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
        })
        await test.step('Change account name of exist trading account', async()=>{
            await myAccounts.openUserMenu()
            await myAccounts.openMyAccountMenuItem('Trading Accounts')
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
    {testRailId: '@25187', brand: '@Markets', user: 'userWithAccounts2@i.ua'},
    {testRailId: '@25187', brand: '@Mena', user: 'userWithAccounts3@i.ua'},
    {testRailId: '@25187', brand: '@Africa', user: 'userWithAccounts4@i.ua'}
]
for(const{testRailId, brand, user} of testAccountSwitchingParams){
    test(`${testRailId} ${brand} Switching between trading accounts`, 
        {tag:['@secondAccount', '@UI', '@web']}, async({page, AppNAGA}, testInfo)=>{
        await testInfo.setTimeout(testInfo.timeout + 70000);
        let signIn = new SignIn(page);
        let addAccount = new AddAcountForm(page)
        let mainPage = new MainPage(page)
        let myAccounts = new MyAccounts(page) 
        await test.step(`Login to platform by ${user} user`, async()=>{
            await signIn.goto(AppNAGA,'login');
            await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
        })
        await test.step("Switch to secondAccount", async()=>{
            await myAccounts.openUserMenu()
            await myAccounts.openMyAccountMenuItem('Trading Accounts')
            await addAccount.switchToAccount('secondAccount')
            expect(await mainPage.getloginnedUserAccount()).toEqual('secondAccount')
        })
        await test.step("Switch back to main account", async()=>{
            await myAccounts.openUserMenu()
            await myAccounts.openMyAccountMenuItem('Trading Accounts')
            await addAccount.switchToAccount('mainAccount')
            expect(await mainPage.getloginnedUserAccount()).toEqual('mainAccount')
        })})}
})
