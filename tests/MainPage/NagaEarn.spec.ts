import { expect } from "@playwright/test";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { NagaEarn } from "../../pageObjects/MainPage/NagaEarn";
import { SignIn } from "../../pageObjects/SignIn/SignInPage";
import { test } from "../../test-options";

test.describe('Naga EARN, WEB', async()=>{

    test('Open Naga EARN via live EUR account. WEB', {tag:['@UI', '@web']}, async({page, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 10000)
        let signIn = new SignIn(page)
        let mainPage = new MainPage(page)
        let nagaEarn = new NagaEarn(page)
        let user = 'nagaEarnTest@naga.com'
        let accountId;
        await test.step(`Login to platform by ${user}, @Markets brand`, async()=>{
            await signIn.goto(AppNAGA, 'login')
            await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
        })
        await test.step('Check trading account. Switch to EUR if needed. Open Naga Earn', async()=>{
            await mainPage.switchToAcIfNeeded('MainAccount')
            accountId = await mainPage.getLoginedAccountId()
            await mainPage.openBackMenuSubcategory('Earnings and Referrals', 'NAGA Earn')
        })
        await test.step('Open Naga EARN. Check AccountId, AccountStatus', async()=>{
            await nagaEarn.disableNagaEarnIfExist()
            expect(await nagaEarn.getEarnHeaderTittle()).toEqual('Earn daily interest on the instantly available cash balance in your trading account.')
            await nagaEarn.enableEarn()
            expect(await nagaEarn.getAccountId()).toEqual(accountId)
            expect(await nagaEarn.getAccountStatus()).toEqual('Active')
        })
        await test.step('Disable Naga Earn', async()=>{
            await nagaEarn.disableNagaEarn()
        })
    })

    type NagaEarnTypes = {
        accountName: string
    }
    const NagaEarnParams: NagaEarnTypes[] = [
        {accountName:'demoAccount'},
        {accountName:'usdAccount'}
    ]
    for(const{accountName} of NagaEarnParams){
        test(`Open Naga Earn from ${accountName} account`, {tag:['@UI', '@web']}, async({page, AppNAGA}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 10000)
            let signIn = new SignIn(page)
            let mainPage = new MainPage(page)
            let nagaEarn = new NagaEarn(page)
            let user = 'nagaEarnTest@naga.com'
            await test.step(`Login to platform by ${user}, @Markets brand`, async()=>{
                await signIn.goto(AppNAGA, 'login')
                await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
            })
            await test.step(`Switch to ${accountName} and open Naga Earn`,async()=>{
                await mainPage.switchToAcIfNeeded(accountName)
                await mainPage.openBackMenuSubcategory('Earnings and Referrals', 'NAGA Earn')
            })
            await test.step('Try to enable Naga Earn. Check allert popup. switch to My accounts',async()=>{
                await nagaEarn.enableEarn()
                expect(await nagaEarn.getPopupMsg()).toEqual('NAGA Earn is currently only available for EUR Live trading accounts.To earn interest on your instantly available cash balance, create a EUR Live account or switch to an existing one.')
                await nagaEarn.switchToMyaccount()
                expect(await mainPage.getUrl()).toContain('trading-accounts')
            })
            await test.step('Switch back to EUR Live account', async()=>{
                await mainPage.switchToAcIfNeeded('MainAccount')
            })
        })}
})

test.describe('Naga Earn.Mobile', async()=>{
    test('Mobile. Open Naga EARN via live EUR account. WEB', {tag:['@UI', '@mobile']}, async({page, AppNAGA})=>{
        let signIn = new SignIn(page)
        let mainPage = new MainPage(page)
        let nagaEarn = new NagaEarn(page)
        let user = 'nagaEarnTest@naga.com'
        let accountId;
        await test.step(`Login to platform by ${user}, @Markets brand`, async()=>{
            await signIn.goto(AppNAGA, 'login')
            await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
        })
        await test.step('Check trading account. Switch to EUR if needed. Open Naga Earn', async()=>{
            await mainPage.openMobileBalanceMenu()
            await mainPage.chooseMobileTradingAccount('MainAccount')
            accountId = await mainPage.getLoginedAccountId()
            await mainPage.openMobileBackMenuPoint('NAGA Earn')
        })
        await test.step('Open Naga EARN. Check AccountId, AccountStatus', async()=>{
            expect(await nagaEarn.getEarnHeaderTittle()).toEqual('Earn daily interest on the instantly available cash balance in your trading account.')
            await nagaEarn.enableEarn()
            expect(await nagaEarn.getAccountId()).toEqual(accountId)
            expect(await nagaEarn.getAccountStatus()).toEqual('Active')
        })
        await test.step('Disable Naga Earn', async()=>{
            await nagaEarn.disableNagaEarn()
        })
    })

    type NagaEarnTypes = {
        accountName: string
    }
    const NagaEarnParams: NagaEarnTypes[] = [
        {accountName:'demoAccount'},
        {accountName:'usdAccount'}
    ]
    for(const{accountName} of NagaEarnParams){
        test(`Open Naga Earn from ${accountName} account`, {tag:['@UI', '@mobile']}, async({page, AppNAGA})=>{
            let signIn = new SignIn(page)
            let mainPage = new MainPage(page)
            let nagaEarn = new NagaEarn(page)
            let user = 'nagaEarnTest@naga.com'
            await test.step(`Login to platform by ${user}, @Markets brand`, async()=>{
                await signIn.goto(AppNAGA, 'login')
                await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
            })
            await test.step(`Switch to ${accountName} and open Naga Earn`,async()=>{
                await mainPage.openMobileBalanceMenu()
                await mainPage.chooseMobileTradingAccount(accountName)
                await mainPage.openMobileBackMenuPoint('NAGA Earn')
            })
            await test.step('Try to enable Naga Earn. Check allert popup. switch to My accounts',async()=>{
                await nagaEarn.enableEarn()
                expect(await nagaEarn.getPopupMsg()).toEqual('NAGA Earn is currently only available for EUR Live trading accounts.To earn interest on your instantly available cash balance, create a EUR Live account or switch to an existing one.')
                await nagaEarn.switchToMyaccount()
                expect(await mainPage.getUrl()).toContain('trading-accounts')
            })
            await test.step('Switch back to EUR Live account', async()=>{
                await mainPage.openMobileBalanceMenu()
                await mainPage.chooseMobileTradingAccount('MainAccount')
            })
        })}
})