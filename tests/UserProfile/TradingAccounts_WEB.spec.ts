
import { expect } from "@playwright/test";
import {test} from "../../test-options";
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser";

test.describe("New Trading account", async()=>{
    
    test("Naga Capital. Create 2nd live account", {tag:['@secondAccount', '@web']}, 
        async({app, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 110000)
        let email = await new RandomUser().getRandomUserEmail()
        await test.step(`Create lead user ${email} and finish KYC`, async()=>{
            await app.KYC_Registration.NagaCapital_KYC_HighScore(
                email, 
                process.env.USER_PASSWORD || '', 
                'Bosnia and Herzegovina',
                '+387',
                '603039647',
                AppNAGA)
        })
        await test.step('Add second live account in My Accounts', async()=>{
            await app.mainPage.waitForLiveAccount()
            await app.myAccounts.openUserMenu()
            await app.myAccounts.openMyAccountMenuItem('Trading Accounts')
            await app.addAccount.clickAddAccountBtn()
            await app.addAccount.createMobileAccount('Live Account','Live_USD', 'USD');
            await app.addAccount.acceptSuccessPopupWeb()
            expect(await app.addAccount.checkNewLiveAccount()).toBeTruthy
        })
        await test.step('Add second demo account in My Accounts', async()=>{
            await app.addAccount.clickAddAccountBtn()
            await app.addAccount.createMobileAccount('Demo Account','Demo_USD', 'USD');
            await app.addAccount.acceptSuccessPopupWeb()
            expect(await app.addAccount.checkNewDemoAccount()).toBeTruthy
        })
    })

    test('Naga Markets. Create 2nd live account', {tag:['@secondAccount', '@web']}, 
        async({app, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 200000)
        let email = await new RandomUser().getRandomUserEmail()
        await test.step(`Create lead user ${email} and fill KYC`, async()=>{
            await app.KYC_Registration.NagaMarkets_KYC_Advance(
                email, 
                process.env.USER_PASSWORD || '',
                'France',
                '+387',
                '603039647',
                AppNAGA)
        })
        await test.step('Add second live account in My Accounts', async()=>{
            await app.mainPage.waitForLiveAccount()
            await app.myAccounts.openUserMenu()
            await app.myAccounts.openMyAccountMenuItem('Trading Accounts')
            await app.addAccount.clickAddAccountBtn()
            await app.addAccount.createMobileAccount('Live Account','Live_USD', 'USD');
            await app.addAccount.acceptSuccessPopupWeb()
            expect(await app.addAccount.checkNewLiveAccount()).toBeTruthy
        })
        await test.step('Add second demo account in My Accounts', async()=>{
            await app.addAccount.clickAddAccountBtn()
            await app.addAccount.createMobileAccount('Demo Account','Demo_USD', 'USD');
            await app.addAccount.acceptSuccessPopupWeb()
            expect(await app.addAccount.checkNewDemoAccount()).toBeTruthy
        })
    })

    test(`NagaMena Create 2nd live account`, {tag:['@secondAccount', '@web']},
        async({app, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 160000)
        let email = await new RandomUser().getRandomUserEmail()
        await test.step(`Create lead user with ${email}`, async()=>{
            await app.KYC_Registration.NagaMena_FullRegUser(
                email,
                AppNAGA)
        })
        await test.step('Add second live account in My Accounts', async()=>{
            await app.mainPage.waitForLiveAccount()
            await app.myAccounts.openUserMenu()
            await app.myAccounts.openMyAccountMenuItem('Trading Accounts')
            await app.addAccount.clickAddAccountBtn()
            await app.addAccount.createMobileAccount('Live Account','Live_USD', 'USD');
            await app.addAccount.acceptSuccessPopupWeb()
            expect(await app.addAccount.checkNewLiveAccount()).toBeTruthy
        })
        await test.step('Add second demo account in My Accounts', async()=>{
            await app.addAccount.clickAddAccountBtn()
            await app.addAccount.createMobileAccount('Demo Account','Demo_USD', 'USD');
            await app.addAccount.acceptSuccessPopupWeb()
            expect(await app.addAccount.checkNewDemoAccount()).toBeTruthy
        })
    })

    test('NagaAfrica. Create 2nd live account', {tag:['@secondAccount', '@web']}, 
        async({app, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 160000)
        let email = await new RandomUser().getRandomUserEmail() 
        await test.step(`Create lead user with ${email}`, async()=>{
            await app.KYC_Registration.NagaAfrica_Lead_web(
                email,
                process.env.USER_PASSWORD || '',
                'South Africa',
                '+387',
                '603039647',
                AppNAGA
            )
        })
        await test.step('Add second live account in My Accounts', async()=>{
            await app.mainPage.waitForLiveAccount()
            await app.myAccounts.openUserMenu()
            await app.myAccounts.openMyAccountMenuItem('Trading Accounts')
            await app.addAccount.clickAddAccountBtn()
            await app.addAccount.createMobileAccount('Live Account','Live_USD', 'USD');
            await app.addAccount.acceptSuccessPopupWeb()
            expect(await app.addAccount.checkNewLiveAccount()).toBeTruthy
        })
        await test.step('Add second demo account in My Accounts', async()=>{
            await app.addAccount.clickAddAccountBtn()
            await app.addAccount.createMobileAccount('Demo Account','Demo_USD', 'USD');
            await app.addAccount.acceptSuccessPopupWeb()
            expect(await app.addAccount.checkNewDemoAccount()).toBeTruthy
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
            {tag:['@secondAccount', '@web']}, async({app, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 90000)
        await test.step(`Login to platform by ${user} to ${brand}`, async()=>{
            await app.signIn.goto(AppNAGA,'login');
            await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
        })
        await test.step('Change account name of exist trading account', async()=>{
            await app.myAccounts.openUserMenu()
            await app.myAccounts.openMyAccountMenuItem('Trading Accounts')
            await app.addAccount.editLiveAccountName('Default_Live_account')
            expect(await app.addAccount.getDefaultAccountName()).toEqual('Default_Live_account')
            await app.addAccount.editLiveAccountName('NAGA - USD');
        })
        await test.step('Check possibility to show password of trading account', async()=>{
            await app.addAccount.openShowPasswordPopup();
            expect(await app.addAccount.checkPasswordContainerIsVisibel()).toBeTruthy()
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
        {tag:['@secondAccount', '@web']}, async({app, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 70000)
        await test.step(`Login to platform by ${user} user`, async()=>{
            await app.signIn.goto(AppNAGA,'login');
            await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
        })
        await test.step("Switch to secondAccount", async()=>{
            await app.myAccounts.openUserMenu()
            await app.myAccounts.openMyAccountMenuItem('Trading Accounts')
            await app.addAccount.switchToAccount('secondAccount')
            expect(await app.mainPage.getloginnedUserAccount()).toEqual('secondAccount')
        })
        await test.step("Switch back to main account", async()=>{
            await app.myAccounts.openUserMenu()
            await app.myAccounts.openMyAccountMenuItem('Trading Accounts')
            await app.addAccount.switchToAccount('mainAccount')
            expect(await app.mainPage.getloginnedUserAccount()).toEqual('mainAccount')
        })})}
})
