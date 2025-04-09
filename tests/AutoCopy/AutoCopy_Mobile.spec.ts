import { expect } from "@playwright/test"
import { AutoCopy } from "../../pageObjects/AutoCopy/autocopy"
import { MainPage } from "../../pageObjects/MainPage/MainPage"
import { SignIn } from "../../pageObjects/SignIn/SignInPage"
import { AllInstruments } from "../../pageObjects/Trading/InstrumentsPage"
import { MyTrades } from "../../pageObjects/Trading/MyTrades"
import { NewPosition } from "../../pageObjects/Trading/OpenNewPositionPage"
import { UserProfile } from "../../pageObjects/UserProfile/UserProfile"
import { test } from "../../test-options"

test.describe('Autocopy Mobile', async()=>{

    test('Mobile. Autocopy of opened position (Mena user) by Capital user', 
        {tag: ['@autocopy', '@mobile'], annotation: {type:'issue',description:'minus|plus btns doesnt work on new position scree'}}, 
        async({page, proxyPageUAE, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 60000)
        let signInCapital = new SignIn(page)
        let signIn2Mena = new SignIn(proxyPageUAE)
        let mainPageCapital = new MainPage(page)
        let mainPageMena = new MainPage(proxyPageUAE)
        let tradingInstrument = "Solana/USD";
        let CapitalUser = 'testTrading2'
        let MenaUser = 'testTradingMena'
        let myTradesСapital = new MyTrades(page)
        let myTradesMena = new MyTrades(proxyPageUAE)
        let autoCopyCapital = new AutoCopy(page)
        let instrumentsMena = new AllInstruments(proxyPageUAE)
        let newPositionMena = new NewPosition(proxyPageUAE)
        await signInCapital.goto(AppNAGA, 'login')
        await test.step(`Login by Capital user ${CapitalUser}`, async()=>{
            await signInCapital.switchPage(page)
            await signInCapital.signInUserToPlatform(CapitalUser, process.env.USER_PASSWORD || "")
        })
        await test.step(`Check Copy Trading tab and close trade connections if they exist`, async()=>{
            await mainPageCapital.openMobileMenu('Menu')
            await mainPageCapital.openMobileBackMenuPoint('copy-trading')
            await autoCopyCapital.chooseAutocopyTab('Active')
            await autoCopyCapital.closeMobileAutoCopiesIfExist()
        })
        await test.step(`Autocopy ${MenaUser} user via search`, async()=>{
            await mainPageCapital.searchMobileUser(MenaUser)
            await new UserProfile(page).StartAutoCopy()
            await autoCopyCapital.StartAutoCopyPopup('2')
        })
        await test.step('Close opened positions for Capital user if they exist',async()=>{
            await mainPageCapital.openMobileMenuPoint("my-trades")
            await myTradesСapital.closeMobilePositionsIfExist()
        })
        await test.step(`Switch to Naga mena user-${MenaUser}`,async()=>{
            await signIn2Mena.switchPage(proxyPageUAE)
            await signIn2Mena.goto(AppNAGA, 'login')
            await signIn2Mena.signInUserToPlatform(MenaUser, process.env.USER_PASSWORD || "")
        })
        await test.step('Check previously opened positions and close if they exist', async()=>{
            await mainPageMena.openMobileMenuPoint('my-trades')
            await myTradesMena.closeMobilePositionsIfExist()
        })
        await test.step(`Open position of ${tradingInstrument}`, async()=>{
            await mainPageMena.openHeaderMenuPoint("markets");
            await instrumentsMena.openMobilePosition(tradingInstrument, 'SELL')
            //await newPositionMena.installMobileLotsSize(20, 2)
            await newPositionMena.submitPosition()
        })
        await test.step('Check source of trade for Mena user', async()=>{
            await mainPageMena.openMobileMenuPoint('my-trades')
            expect(await myTradesMena.getMobileSourceOftrade()).toEqual('OWN TRADE')
        })
        await test.step('Switch to Capital and check My trades -> source of trade', async()=>{
            await signInCapital.switchPage(page)
            await myTradesСapital.refreshPage()
            expect(await myTradesСapital.getMobileSourceOfOpenedPosition(tradingInstrument)).toEqual('COPIED')
        })
        await test.step('Switch to Mena and close opened position', async()=>{
            await signIn2Mena.switchPage(proxyPageUAE)
            await myTradesMena.closeMobilePositionsIfExist()
        })
        await test.step(`Switch to Capital, and check that position is closed`, async()=>{
            await signInCapital.switchPage(page)
            expect(await myTradesСapital.emptyPageTextIsVisible()).toBeTruthy()
        })
        await test.step('Remove autocopy conection on NagaCapital', async()=>{
            await mainPageCapital.openMobileMenu('Menu')
            await mainPageCapital.openMobileBackMenuPoint('copy-trading')
            await autoCopyCapital.chooseAutocopyTab('Active')
            await autoCopyCapital.closeMobileAutoCopiesIfExist()
        })
    })

    test('Mobile, Save AUTOCOPIED Mena closed positions for Capital user', 
        {tag: ['@autocopy', '@mobile']}, async({page, proxyPageUAE, AppNAGA}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 60000)
            let signInCapital = new SignIn(page)
            let signIn2Mena = new SignIn(proxyPageUAE)
            let mainPageCapital = new MainPage(page)
            let mainPageMena = new MainPage(proxyPageUAE)
            let tradingInstrument = "Solana/USD";
            let CapitalUser = 'testTrading2'
            let MenaUser = 'testTradingMena'
            let myTradesСapital = new MyTrades(page)
            let myTradesMena = new MyTrades(proxyPageUAE)
            let autoCopyCapital = new AutoCopy(page)
            let instrumentsMena = new AllInstruments(proxyPageUAE)
            let newPositionMena = new NewPosition(proxyPageUAE)
            await test.step(`Login by Capital user ${CapitalUser}`, async()=>{
                await signInCapital.goto(AppNAGA, 'login')
                await signInCapital.switchPage(page)
                await signInCapital.signInUserToPlatform(CapitalUser, process.env.USER_PASSWORD || "")
            })
            await test.step(`Check Copy Trading tab and close trade connections if they exist`, async()=>{
                await mainPageCapital.openMobileMenu('Menu')
                await mainPageCapital.openMobileBackMenuPoint('copy-trading')
                await autoCopyCapital.chooseAutocopyTab('Active')
                await autoCopyCapital.closeMobileAutoCopiesIfExist()
            })
            await test.step(`Autocopy ${MenaUser} user via search`, async()=>{
                await mainPageCapital.searchMobileUser(MenaUser)
                await new UserProfile(page).StartAutoCopy()
                await autoCopyCapital.StartAutoCopyPopup('2')
            })
            await test.step('Close opened positions for Capital user if they exist',async()=>{
                await mainPageCapital.openMobileMenuPoint("my-trades")
                await myTradesСapital.closeMobilePositionsIfExist()
            })
            await test.step(`Switch to Naga mena user-${MenaUser}`,async()=>{
                await signIn2Mena.switchPage(proxyPageUAE)
                await signIn2Mena.goto(AppNAGA, 'login')
                await signIn2Mena.signInUserToPlatform(MenaUser, process.env.USER_PASSWORD || "")
            })
            await test.step('Check previously opened positions and close if they exist', async()=>{
                await mainPageMena.openMobileMenuPoint('my-trades')
                await myTradesMena.closeMobilePositionsIfExist()
            })
            await test.step(`Open position of ${tradingInstrument}`, async()=>{
                await mainPageMena.openHeaderMenuPoint("markets");
                await instrumentsMena.openMobilePosition(tradingInstrument, 'SELL')
                //await newPositionMena.installMobileLotsSize(20, 2)
                await newPositionMena.submitPosition()
            })
            await test.step('Save date of opened position (Mena user). And Close positon', async()=>{
                await mainPageMena.openMobileMenuPoint("my-trades")
                await myTradesMena.closeMobilePositionsIfExist()
            })
            await test.step(`Switch to ${CapitalUser} and check close postions`, async()=>{
                await signInCapital.switchPage(page)
                await mainPageCapital.openMobileMenuPoint("my-trades")
                await myTradesСapital.openMobileClosedPositionsTab()
                expect(await myTradesСapital.getMobileSourceOfOpenedPosition(tradingInstrument)).toEqual('AUTOCOPIED') 
            })
            await test.step('Switch to Mena and close opened position', async()=>{
                await signIn2Mena.switchPage(proxyPageUAE)
                await myTradesMena.closeMobilePositionsIfExist()
            })
            await test.step(`Switch to Capital, and check that position is closed`, async()=>{
                await signInCapital.switchPage(page)
                await myTradesСapital.refreshPage()
                //expect(await myTradesСapital.emptyPageTextIsVisible()).toBeTruthy()
            })
            await test.step('Remove autocopy conection on NagaCapital', async()=>{
                await mainPageCapital.openMobileMenu('Menu')
                await mainPageCapital.openMobileBackMenuPoint('copy-trading')
                await autoCopyCapital.chooseAutocopyTab('Active')
                await autoCopyCapital.closeMobileAutoCopiesIfExist()
            })
        })
})
