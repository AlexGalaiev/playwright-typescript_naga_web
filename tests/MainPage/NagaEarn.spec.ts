import { expect } from "@playwright/test";
import { test } from "../../test-options";

test.describe('Naga EARN, WEB', async()=>{

    test('Open Naga EARN via live EUR account. WEB', {tag:['@trading', '@web']}, async({app, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 10000)
        let user = 'nagaEarnTest@naga.com'
        let accountId;
        await test.step(`Login to platform by ${user}, @Markets brand`, async()=>{
            await app.signIn.goto(AppNAGA, 'login')
            await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
        })
        await test.step('Check trading account. Switch to EUR if needed. Open Naga Earn', async()=>{
            await app.mainPage.switchToAcIfNeeded('MainAccount')
            accountId = await app.mainPage.getLoginedAccountId()
            await app.mainPage.openBackMenuSubcategory('Earnings and Referrals', 'NAGA Earn')
        })
        await test.step('Open Naga EARN. Check AccountId, AccountStatus', async()=>{
            await app.nagaEarn.disableNagaEarnIfExist()
            expect(await app.nagaEarn.getEarnHeaderTittle()).toEqual('Earn daily interest on the instantly available cash balance in your trading account.')
            await app.nagaEarn.enableEarn()
            expect(await app.nagaEarn.getAccountId()).toEqual(accountId)
            expect(await app.nagaEarn.getAccountStatus()).toEqual('Active')
        })
        await test.step('Disable Naga Earn', async()=>{
            await app.nagaEarn.disableNagaEarn()
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
        test(`Open Naga Earn from ${accountName} account`, {tag:['@trading', '@web']}, async({app, AppNAGA}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 10000)
            let user = 'nagaEarnTest@naga.com'
            await test.step(`Login to platform by ${user}, @Markets brand`, async()=>{
                await app.signIn.goto(AppNAGA, 'login')
                await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
            })
            await test.step(`Switch to ${accountName} and open Naga Earn`,async()=>{
                await app.mainPage.switchToAcIfNeeded(accountName)
                await app.mainPage.waitForAccountTobeDisplayed(accountName)
                await app.mainPage.openBackMenuSubcategory('Earnings and Referrals', 'NAGA Earn')
            })
            await test.step('Try to enable Naga Earn. Check allert popup. switch to My accounts',async()=>{
                await app.nagaEarn.enableEarn()
                expect(await app.nagaEarn.getPopupMsg()).toEqual('NAGA Earn is currently only available for EUR Live trading accounts.To earn interest on your instantly available cash balance, create a EUR Live account or switch to an existing one.')
                await app.nagaEarn.switchToMyaccount()
                expect(await app.mainPage.getUrl()).toContain('trading-accounts')
            })
            await test.step('Switch back to EUR Live account', async()=>{
                await app.mainPage.switchToAcIfNeeded('MainAccount')
            })
        })}
})

test.describe('Naga Earn.Mobile', async()=>{
    test('Mobile. Open Naga EARN via live EUR account. WEB', {tag:['@trading', '@mobile']}, async({app, AppNAGA})=>{
        let user = 'nagaEarnTest@naga.com'
        let accountId;
        await test.step(`Login to platform by ${user}, @Markets brand`, async()=>{
            await app.signIn.goto(AppNAGA, 'login')
            await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
        })
        await test.step('Check trading account. Switch to EUR if needed. Open Naga Earn', async()=>{
            await app.mainPage.openMobileBalanceMenu()
            await app.mainPage.chooseMobileTradingAccount('MainAccount')
            accountId = await app.mainPage.getLoginedAccountId()
            await app.mainPage.openMobileBackMenuPoint('NAGA Earn')
        })
        await test.step('Open Naga EARN. Check AccountId, AccountStatus', async()=>{
            expect(await app.nagaEarn.getEarnHeaderTittle()).toEqual('Earn daily interest on the instantly available cash balance in your trading account.')
            await app.nagaEarn.enableEarn()
            expect(await app.nagaEarn.getAccountId()).toEqual(accountId)
            expect(await app.nagaEarn.getAccountStatus()).toEqual('Active')
        })
        await test.step('Disable Naga Earn', async()=>{
            await app.nagaEarn.disableNagaEarn()
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
        test(`Open Naga Earn from ${accountName} account`, {tag:['@trading', '@mobile']}, async({app, AppNAGA})=>{
            let user = 'nagaEarnTest@naga.com'
            await test.step(`Login to platform by ${user}, @Markets brand`, async()=>{
                await app.signIn.goto(AppNAGA, 'login')
                await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
            })
            await test.step(`Switch to ${accountName} and open Naga Earn`,async()=>{
                await app.mainPage.openMobileBalanceMenu()
                await app.mainPage.chooseMobileTradingAccount(accountName)
                await app.mainPage.openMobileBackMenuPoint('NAGA Earn')
            })
            await test.step('Try to enable Naga Earn. Check allert popup. switch to My accounts',async()=>{
                await app.nagaEarn.enableEarn()
                expect(await app.nagaEarn.getPopupMsg()).toEqual('NAGA Earn is currently only available for EUR Live trading accounts.To earn interest on your instantly available cash balance, create a EUR Live account or switch to an existing one.')
                await app.nagaEarn.switchToMyaccount()
                expect(await app.mainPage.getUrl()).toContain('trading-accounts')
            })
            await test.step('Switch back to EUR Live account', async()=>{
                await app.mainPage.openMobileBalanceMenu()
                await app.mainPage.chooseMobileTradingAccount('MainAccount')
            })
        })}
})