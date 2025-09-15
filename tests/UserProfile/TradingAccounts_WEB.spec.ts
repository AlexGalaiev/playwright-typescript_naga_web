
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
            await app.mainPage.closeModal()
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
            await app.mainPage.closeManageFundsPopup()
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
        brand: string,
        user: string,
    }
    const testTrAccountsParams: tradingAcTypes[] = [
        {brand: '@Capital', user: 'leadUserCapital@naga.com'},
        {brand: '@Markets', user: 'leadUserMarkets@naga.com'},
        {brand: '@Mena', user: 'leadUserMena@naga.com'},
        {brand: '@Africa', user: 'leadUserAfrica@naga.com'},
    ]
    for(const{brand, user} of testTrAccountsParams){
        test(`${brand} Edit trading account information `, 
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
    {brand: '@Capital', user: 'userWithAccounts@i.ua'},
    {brand: '@Markets', user: 'userWithAccounts2@i.ua'},
    {brand: '@Mena', user: 'userWithAccounts3@i.ua'},
    {brand: '@Africa', user: 'userWithAccounts4@i.ua'}
]
for(const{brand, user} of testAccountSwitchingParams){
    test(`${brand} Switching between trading accounts`, 
        {tag:['@secondAccount', '@web', '@smoke','@lightTests']}, async({app, AppNAGA}, testInfo)=>{
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
        await test.step("Switch to DEMO", async()=>{
            await app.myAccounts.openUserMenu()
            await app.myAccounts.openMyAccountMenuItem('Trading Accounts')
            await app.addAccount.switchToAccount('DEMO')
            expect(await app.mainPage.getloginnedUserAccount()).toEqual('DEMO')
        })
        await test.step("Switch back to main account", async()=>{
            await app.myAccounts.openUserMenu()
            await app.myAccounts.openMyAccountMenuItem('Trading Accounts')
            await app.addAccount.switchToAccount('mainAccount')
            expect(await app.mainPage.getloginnedUserAccount()).toEqual('mainAccount')
        })})}
})
