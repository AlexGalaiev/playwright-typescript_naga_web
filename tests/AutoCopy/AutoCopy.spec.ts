import { expect } from '@playwright/test'
import { AutoCopy } from '../../pageObjects/AutoCopy/autocopy'
import { MainPage } from '../../pageObjects/MainPage/MainPage'
import { SignIn } from '../../pageObjects/SignIn/SignInPage'
import { MyTrades } from '../../pageObjects/Trading/MyTrades'
import { UserProfile } from '../../pageObjects/UserProfile/UserProfile'
import{test} from '..//..//test-options'
import { AllInstruments } from '../../pageObjects/Trading/InstrumentsPage'
import { NewPosition } from '../../pageObjects/Trading/OpenNewPositionPage'
import { TradeDetails } from '../../pageObjects/Trading/TradeDetails'

test.describe('Autocopy', async()=>{
    test('Autocopy of opened position  Mena user by Capital user', {tag: ['@autocopy', '@web']}, async({page, proxyPageUAE, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 60000)
        let signInCapital = new SignIn(page)
        let signIn2Mena = new SignIn(proxyPageUAE)
        let mainPageCapital = new MainPage(page)
        let mainPageMena = new MainPage(proxyPageUAE)
        let tradingInstrument = "Solana/USD";
        let CapitalUser = 'testTrading2'
        let MenaUser = 'testTradingMena'
        let autoCopyCapital = new AutoCopy(page)
        let userProfileCapital = new UserProfile(page)
        await signInCapital.goto(AppNAGA, 'login')
        await test.step(`Login by Capital user ${CapitalUser}`, async()=>{
            await signInCapital.switchPage(page)
            await signInCapital.signInUserToPlatform(CapitalUser, process.env.USER_PASSWORD || "")
        })
        await test.step(`Close Autocopy tradings, if they exist`, async()=>{
            await mainPageCapital.openBackMenuPoint('Copy Trading')
            await autoCopyCapital.chooseAutocopyTab('Active')
            await autoCopyCapital.closeAutoCopiesIfexist()
        })
        await test.step(`Search for Mena user - ${MenaUser} and start Copy trading`, async()=>{
            await mainPageCapital.search(MenaUser)
            await mainPageCapital.getFoundResults(MenaUser)
            await userProfileCapital.StartAutoCopy()
            await new AutoCopy(page).StartAutoCopyPopup('2')
            expect(await userProfileCapital.AutocopyingBtn()).toBeTruthy()
        })
        await test.step('Check Cpaital My trades and close positions if they exist', async()=>{
            await mainPageCapital.openHeaderMenuPoint('my-trades')
            await new MyTrades(page).closePositionsIfExist()
        })
        await test.step(`Switch to Naga mena user-${MenaUser}`,async()=>{
            await signIn2Mena.switchPage(proxyPageUAE)
            await signIn2Mena.goto(AppNAGA, 'login')
            await signIn2Mena.signInUserToPlatform(MenaUser, process.env.USER_PASSWORD || "")
        })
        await test.step('Check previously opened positions and close if they exist', async()=>{
            await mainPageMena.openHeaderMenuPoint('my-trades')
            await new MyTrades(proxyPageUAE).closePositionsIfExist()
        })
        await test.step(`Open My trades and open 1 position for ${tradingInstrument}`, async()=>{
            await mainPageMena.openHeaderMenuPoint('markets')
            await new AllInstruments(proxyPageUAE).openPositionOfInstrument(tradingInstrument, 'Short')
            await new NewPosition(proxyPageUAE).submitPosition()
        })
        await test.step('Go to Mena My-trades and check source of opened position. Must be -OWN TRADE', async()=>{
            await mainPageMena.openHeaderMenuPoint('my-trades')
            expect(await new MyTrades(proxyPageUAE).getSourceOfOpenedPosition(tradingInstrument)).toEqual('OWN TRADE')
        })
        await test.step(`Switch to Capital. Check source op opened position. Must be - copied`, async()=>{
            await signInCapital.switchPage(page)
            await new MyTrades(page).refreshPage()
            expect(await new MyTrades(page).getSourceOfOpenedPosition(tradingInstrument)).toEqual('COPIED')
        })
        await test.step('Switch to Mena and close opened position', async()=>{
            await signIn2Mena.switchPage(proxyPageUAE)
            await new MyTrades(proxyPageUAE).closePositionsIfExist()
        })
        await test.step(`Switch to Capital, and check that position is closed`, async()=>{
            await signInCapital.switchPage(page)
            expect(await new MyTrades(page).emptyPageTextIsVisible()).toBeTruthy()
        })
        await test.step('Remove autocopy conection on NagaCapital', async()=>{
            await mainPageCapital.openBackMenuPoint('Copy Trading')
            await autoCopyCapital.chooseAutocopyTab('Active')
            await autoCopyCapital.closeAutoCopiesIfexist()
        })
    })

    test(`Save AUTOCOPIED Mena closed positions for Capital user`, {tag: ['@autocopy', '@web','@debug']}, async({page, proxyPageUAE, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 60000)
        let signInCapital = new SignIn(page)
        let signIn2Mena = new SignIn(proxyPageUAE)
        let mainPageCapital = new MainPage(page)
        let mainPageMena = new MainPage(proxyPageUAE)
        let tradingInstrument = "Solana/USD";
        let CapitalUser = 'testTrading2'
        let MenaUser = 'testTradingMena'
        let autoCopyCapital = new AutoCopy(page)
        let MenaOpenedPositionsDate;
        await signInCapital.goto(AppNAGA, 'login')
        await test.step(`Login by Capital user ${CapitalUser}`, async()=>{
            await signInCapital.switchPage(page)
            await signInCapital.signInUserToPlatform(CapitalUser, process.env.USER_PASSWORD || "")
        })
        await test.step('Check Cpaital My trades and close positions if they exist', async()=>{
            await mainPageCapital.openHeaderMenuPoint('my-trades')
            await new MyTrades(page).closePositionsIfExist()
        })
        await test.step(`Check autocopied users. AutoCopy user - ${MenaUser}`, async()=>{
            await mainPageCapital.openBackMenuPoint('Copy Trading')
            await autoCopyCapital.chooseAutocopyTab('Active')
            await autoCopyCapital.closeAutoCopiesIfexist()
            await autoCopyCapital.chooseAutocopyTab('Inactive')
            await autoCopyCapital.chooseUserForCopyTrading(MenaUser)
            await autoCopyCapital.EnableAutoCopyUser()
        })
        await test.step(`Switch to Naga mena user-${MenaUser}`,async()=>{
            await signIn2Mena.switchPage(proxyPageUAE)
            await signIn2Mena.goto(AppNAGA, 'login')
            await signIn2Mena.signInUserToPlatform(MenaUser, process.env.USER_PASSWORD || "")
        })
        await test.step('Check Mena My trades and close positions if they exist', async()=>{
            await mainPageMena.openHeaderMenuPoint('my-trades')
            await new MyTrades(proxyPageUAE).closePositionsIfExist()
        })
        await test.step(`Open My trades and open 1 position for ${tradingInstrument}`, async()=>{
            await mainPageMena.openHeaderMenuPoint('markets')
            await new AllInstruments(proxyPageUAE).openPositionOfInstrument(tradingInstrument, 'Short')
            await new NewPosition(proxyPageUAE).submitPosition()
        })
        await test.step('Save date of opened position (Mena user). And Close positon', async()=>{
            await mainPageMena.openHeaderMenuPoint('my-trades')
            MenaOpenedPositionsDate = await new MyTrades(proxyPageUAE).getDateOfOpenedPosition()
            await new MyTrades(proxyPageUAE).closePositionsIfExist()
        })
        await test.step(`Switch to ${CapitalUser} and check close postions`, async()=>{
            await signInCapital.switchPage(page)
            await mainPageCapital.openHeaderMenuPoint('my-trades')
            await new MyTrades(page).openCloseTradesTab()
            let closeTime = await new MyTrades(page).openLastTrade(tradingInstrument)
            expect(MenaOpenedPositionsDate).toContain(closeTime)
        })
        await test.step('Remove autocopy conection on NagaCapital', async()=>{
            await mainPageCapital.openBackMenuPoint('Copy Trading')
            await autoCopyCapital.chooseAutocopyTab('Active')
            await autoCopyCapital.closeAutoCopiesIfexist()
        })
    })
        
})
