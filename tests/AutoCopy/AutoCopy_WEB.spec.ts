import { expect } from '@playwright/test'
import{test} from '../../test-options'

test.describe('Autocopy', async()=>{
    test('Autocopy of opened position (Mena user) by Capital user', 
        {tag: ['@autocopy', '@web', '@trading']}, async({app, appUAE, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 80000)
        let tradingInstrument = "Solana/USD";
        let CapitalUser = 'testTrading2' // markets user
        let MenaUser = 'testTradingMena'
        await app.signIn.goto(AppNAGA, 'login')
        await test.step(`Login by Capital user ${CapitalUser}`, async()=>{
            await app.signIn.switchPage()
            await app.signIn.signInUserToPlatform(CapitalUser, process.env.USER_PASSWORD || "")
        })
        await test.step(`Close Autocopy tradings, if they exist`, async()=>{
            await app.mainPage.openBackMenuSubcategory('Copy Trading', 'Copy Trading')
            await app.autoCopy.chooseAutocopyTab('Active')
            await app.autoCopy.closeAutoCopiesIfexist()
        })
        await test.step(`Search for Mena user - ${MenaUser} and start Copy trading`, async()=>{
            await app.mainPage.search(MenaUser)
            await app.mainPage.getFoundResults(MenaUser)
            await app.userProfile.StartAutoCopy()
            await app.autoCopy.StartAutoCopyPopup('2')
            expect(await app.userProfile.AutocopyingBtn()).toBeTruthy()
        })
        await test.step('Check Cpaital My trades and close positions if they exist', async()=>{
            await app.mainPage.openBackMenuPoint('my-trades')
            await app.myTrades.closePositionsIfExist()
        })
        await test.step(`Switch to Naga mena user-${MenaUser}`,async()=>{
            await appUAE.signIn.switchPage()
            await appUAE.signIn.goto(AppNAGA, 'login')
            await appUAE.signIn.signInUserToPlatform(MenaUser, process.env.USER_PASSWORD || "")
        })
        await test.step('Check previously opened positions and close if they exist', async()=>{
            await appUAE.mainPage.openBackMenuPoint('my-trades')
            await appUAE.myTrades.closePositionsIfExist()
        })
        await test.step(`Open My trades and open 1 position for ${tradingInstrument}`, async()=>{
            await appUAE.mainPage.openBackMenuPoint('trade')
            await appUAE.instruments.openPositionOfInstrument(tradingInstrument, 'Sell')
            await appUAE.newPosition.installLotsManually('0.01')
            await appUAE.newPosition.submitPosition()
        })
        await test.step('Go to Mena My-trades and check source of opened position. Must be -OWN TRADE', async()=>{
            await appUAE.mainPage.openBackMenuPoint('my-trades')
            expect(await appUAE.myTrades.getSourceOfOpenedPosition(tradingInstrument)).toEqual('OWN TRADE')
        })
        await test.step(`Switch to Capital. Check source op opened position. Must be - copied`, async()=>{
            await app.signIn.switchPage()
            await app.myTrades.refreshPage()
            expect(await app.myTrades.getSourceOfOpenedPosition(tradingInstrument)).toEqual('COPIED')
        })
        await test.step('Switch to Mena and close opened position', async()=>{
            await appUAE.signIn.switchPage()
            await app.myTrades.closePositionsIfExist()
        })
        await test.step(`Switch to Capital, and check that position is closed`, async()=>{
            await app.signIn.switchPage()
            expect(await app.myTrades.emptyPageTextIsVisible()).toBeTruthy()
        })
        await test.step('Remove autocopy conection on NagaCapital', async()=>{
            await app.mainPage.openBackMenuSubcategory('Copy Trading', 'Copy Trading')
            await app.autoCopy.chooseAutocopyTab('Active')
            await app.autoCopy.closeAutoCopiesIfexist()
        })
    })

    test(`Save AUTOCOPIED Mena closed positions for Capital user`, {tag: ['@autocopy', '@web','@trading']}, 
        async({app, appUAE, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 80000)
        let tradingInstrument = "Solana/USD";
        let CapitalUser = 'testTrading2'
        let MenaUser = 'testTradingMena'
        await app.signIn.goto(AppNAGA, 'login')
        await test.step(`Login by Capital user ${CapitalUser}`, async()=>{
            await app.signIn.switchPage()
            await app.signIn.signInUserToPlatform(CapitalUser, process.env.USER_PASSWORD || "")
        })
        await test.step('Check Cpaital My trades and close positions if they exist', async()=>{
            await app.mainPage.openBackMenuPoint('my-trades')
            await app.myTrades.closePositionsIfExist()
        })
        await test.step(`Check autocopied users. AutoCopy user - ${MenaUser}`, async()=>{
            await app.mainPage.openBackMenuSubcategory('Copy Trading', 'Copy Trading')
            await app.autoCopy.chooseAutocopyTab('Active')
            await app.autoCopy.closeAutoCopiesIfexist()
            await app.autoCopy.chooseAutocopyTab('Inactive')
            await app.autoCopy.chooseUserForCopyTrading(MenaUser)
            await app.autoCopy.EnableAutoCopyUser()
        })
        await test.step(`Switch to Naga mena user-${MenaUser}`,async()=>{
            await appUAE.signIn.switchPage()
            await appUAE.signIn.goto(AppNAGA, 'login')
            await appUAE.signIn.signInUserToPlatform(MenaUser, process.env.USER_PASSWORD || "")
        })
        await test.step('Check Mena My trades and close positions if they exist', async()=>{
            await appUAE.mainPage.openBackMenuPoint('my-trades')
            await appUAE.myTrades.closePositionsIfExist()
        })
        await test.step(`Open My trades and open 1 position for ${tradingInstrument}`, async()=>{
            await appUAE.mainPage.openBackMenuPoint('trade')
            await appUAE.instruments.openPositionOfInstrument(tradingInstrument, 'Sell')
            await appUAE.newPosition.installLotsSize(90, 2)
            await appUAE.newPosition.submitPosition()
        })
        await test.step('Close opened position (Mena user)', async()=>{
            await appUAE.mainPage.openBackMenuPoint('my-trades')
            await appUAE.myTrades.closePositionsIfExist()
        })
        await test.step(`Switch to ${CapitalUser} and check close postions`, async()=>{
            await app.signIn.switchPage()
            await app.mainPage.openBackMenuPoint('my-trades')
            await app.myTrades.openCloseTradesTab()
            expect(await app.myTrades.getSourceOfOpenedPosition(tradingInstrument)).toEqual('AUTOCOPIED')
        })
        await test.step('Remove autocopy conection on NagaCapital', async()=>{
            await app.mainPage.openBackMenuSubcategory('Copy Trading', 'Copy Trading')
            await app.autoCopy.chooseAutocopyTab('Active')
            await app.autoCopy.closeAutoCopiesIfexist()
        })
    })  
})


