import { expect } from "@playwright/test"
import { test } from "../../test-options"

test.describe('Autocopy Mobile', async()=>{

    test('Mobile. Autocopy of opened position (Mena user) by Capital user', 
        {tag: ['@autocopy', '@mobile']}, async({app, appUAE, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 60000)
        let tradingInstrument = "Solana/USD";
        let CapitalUser = 'testTrading2'
        let MenaUser = 'testTradingMena'
        await app.signIn.goto(AppNAGA, 'login')
        await test.step(`Login by Capital user ${CapitalUser}`, async()=>{
            await app.signIn.switchPage()
            await app.signIn.signInUserToPlatform(CapitalUser, process.env.USER_PASSWORD || "")
        })
        await test.step(`Check Copy Trading tab and close trade connections if they exist`, async()=>{
            await app.mainPage.openMobileBackMenuPoint('Copy Trading')
            await app.autoCopy.chooseAutocopyTab('Active')
            await app.autoCopy.closeMobileAutoCopiesIfExist()
        })
        await test.step(`Autocopy ${MenaUser} user via search`, async()=>{
            await app.mainPage.searchMobileUser(MenaUser)
            await app.userProfile.StartAutoCopy()
            await app.autoCopy.StartAutoCopyPopup('2')
        })
        await test.step('Close opened positions for Capital user if they exist',async()=>{
            await app.mainPage.openMobileMenu('My Trades')
            await app.myTrades.closeMobilePositionsIfExist()
        })
        await test.step(`Switch to Naga mena user-${MenaUser}`,async()=>{
            await appUAE.signIn.switchPage()
            await appUAE.signIn.goto(AppNAGA, 'login')
            await appUAE.signIn.signInUserToPlatform(MenaUser, process.env.USER_PASSWORD || "")
        })
        await test.step('Check previously opened positions and close if they exist', async()=>{
            await appUAE.mainPage.openMobileMenu('My Trades')
            await appUAE.myTrades.closeMobilePositionsIfExist()
        })
        await test.step(`Open position of ${tradingInstrument}`, async()=>{
            await appUAE.mainPage.openMobileMenu('Trade')
            await appUAE.instruments.openMobilePosition(tradingInstrument, 'SELL')
            await appUAE.newPosition.installMobileLotsSize(55, 2)
            await appUAE.newPosition.submitPosition()
        })
        await test.step('Check source of trade for Mena user', async()=>{
            await appUAE.mainPage.openMobileMenu('My Trades')
            expect(await appUAE.myTrades.getMobileSourceOftrade()).toEqual('OWN TRADE')
        })
        await test.step('Switch to Capital and check My trades -> source of trade', async()=>{
            await app.signIn.switchPage()
            await app.myTrades.refreshPage()
            expect(await app.myTrades.getMobileSourceOfOpenedPosition(tradingInstrument)).toEqual('COPIED')
        })
        await test.step('Switch to Mena and close opened position', async()=>{
            await appUAE.signIn.switchPage()
            await appUAE.myTrades.closeMobilePositionsIfExist()
        })
        await test.step(`Switch to Capital, and check that position is closed`, async()=>{
            await app.signIn.switchPage()
            expect(await app.myTrades.emptyPageTextIsVisible()).toBeTruthy()
        })
        await test.step('Remove autocopy conection on NagaCapital', async()=>{
            await app.mainPage.openMobileBackMenuPoint('Copy Trading')
            await app.autoCopy.chooseAutocopyTab('Active')
            await app.autoCopy.closeMobileAutoCopiesIfExist()
        })
    })

    test('Mobile, Save AUTOCOPIED Mena closed positions for Capital user', 
        {tag: ['@autocopy', '@mobile'], annotation:{description:'https://keywaygroup.atlassian.net/browse/RG-9330', type:'ticket'}}, 
        async({app, appUAE, AppNAGA}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 60000)
            let tradingInstrument = "Solana/USD";
            let CapitalUser = 'testTrading2'
            let MenaUser = 'testTradingMena'
            await test.step(`Login by Capital user ${CapitalUser}`, async()=>{
                await app.signIn.goto(AppNAGA, 'login')
                await app.signIn.switchPage()
                await app.signIn.signInUserToPlatform(CapitalUser, process.env.USER_PASSWORD || "")
            })
            await test.step(`Check Copy Trading tab and close trade connections if they exist`, async()=>{
                await app.mainPage.openMobileBackMenuPoint('Copy Trading')
                await app.autoCopy.chooseAutocopyTab('Active')
                await app.autoCopy.closeMobileAutoCopiesIfExist()
            })
            await test.step(`Autocopy ${MenaUser} user via search`, async()=>{
                await app.mainPage.searchMobileUser(MenaUser)
                await app.userProfile.StartAutoCopy()
                await app.autoCopy.StartAutoCopyPopup('2')
            })
            await test.step('Close opened positions for Capital user if they exist',async()=>{
                await app.mainPage.openMobileMenu('My Trades')
                await app.myTrades.closeMobilePositionsIfExist()
            })
            await test.step(`Switch to Naga mena user-${MenaUser}`,async()=>{
                await appUAE.signIn.switchPage()
                await appUAE.signIn.goto(AppNAGA, 'login')
                await appUAE.signIn.signInUserToPlatform(MenaUser, process.env.USER_PASSWORD || "")
            })
            await test.step('Check previously opened positions and close if they exist', async()=>{
                await appUAE.mainPage.openMobileMenu('My Trades')
                await appUAE.myTrades.closeMobilePositionsIfExist()
            })
            await test.step(`Open position of ${tradingInstrument}`, async()=>{
                await appUAE.mainPage.openMobileMenu("Trade");
                await appUAE.instruments.openMobilePosition(tradingInstrument, 'SELL')
                await appUAE.newPosition.installMobileLotsSize(65, 2)
                await appUAE.newPosition.submitPosition()
            })
            await test.step('Save date of opened position (Mena user). And Close positon', async()=>{
                await appUAE.mainPage.openMobileMenu('My Trades')
                await appUAE.myTrades.closeMobilePositionsIfExist()
            })
            await test.step(`Switch to ${CapitalUser} and check close postions`, async()=>{
                await app.signIn.switchPage()
                await app.mainPage.openMobileMenu('My Trades')
                await app.myTrades.openMobileClosedPositionsTab()
                expect(await app.myTrades.getMobileSourceOfOpenedPosition(tradingInstrument)).toEqual('AUTOCOPIED') 
            })
            await test.step('Switch to Mena and close opened position', async()=>{
                await appUAE.signIn.switchPage()
                await appUAE.myTrades.closeMobilePositionsIfExist()
            })
            await test.step(`Switch to Capital, and check that position is closed`, async()=>{
                await app.signIn.switchPage()
                await app.myTrades.refreshPage()
            })
            await test.step('Remove autocopy conection on NagaCapital', async()=>{
                await app.mainPage.openMobileBackMenuPoint('Copy Trading')
                await app.autoCopy.chooseAutocopyTab('Active')
                await app.autoCopy.closeMobileAutoCopiesIfExist()
            })
        })
})
