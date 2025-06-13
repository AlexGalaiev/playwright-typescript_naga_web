import { expect } from "playwright/test"
import { MainPage } from "../../pageObjects/MainPage/MainPage"
import { SignIn } from "../../pageObjects/SignIn/SignInPage"
import { AllInstruments } from "../../pageObjects/Trading/InstrumentsPage"
import { MyTrades } from "../../pageObjects/Trading/MyTrades"
import { NewPosition } from "../../pageObjects/Trading/OpenNewPositionPage"
import { TradeDetails } from "../../pageObjects/Trading/TradeDetails"
import {test} from "..//..//test-options"
import { ChangeLimitsPopup } from "../../pageObjects/Trading/ChangeLimitsPopup"
import { ChangeLimitSuccessPopup } from "../../pageObjects/Trading/ChangeLimitResultPopup"
import { MyAccounts } from "..//..//pageObjects/MainPage/MyAccounts"
import { Feed } from "../../pageObjects/Feed/Feed"

test.describe('WEB', async()=>{
    const tradingInstrument = "SOLUSD"

    type tradeDetails = {
        brand: string,
        user: string,
        currency: string
    }
    const tradeDetailsParams: tradeDetails[] =[
        {brand:'@Markets', user:'testTrading2Markets', currency:'$'},
        {brand:'@Capital', user:'testTrading2', currency:'$'},
        {brand:'@Mena', user:'testTradingMena', currency:'€'},
        {brand:'@Africa', user:'testTradingAfrica2', currency:'$'}
    ]
    for(const{brand, user, currency} of tradeDetailsParams){
    test(`${brand} Trade details test`, {tag:['@trading', '@web']}, async({page, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 170000)
        let tradeInstrumentName
        let deposit
        let signIn = new SignIn(page)
        let mainPage = new MainPage(page)
        let myTrades = new MyTrades(page)
        let instruments = new AllInstruments(page)
        let newPosition = new NewPosition(page)
        let tradeDetails = new TradeDetails(page)
        await test.step(`Login to ${brand} by ${user}`, async () => {
            await signIn.goto(AppNAGA, "login");
            await signIn.signInUserToPlatform(user,process.env.USER_PASSWORD || "")
        })
        await test.step('Close opened positions, if they exist', async()=>{
            await mainPage.openBackMenuPoint("my-trades")
            await myTrades.closePositionsIfExist()
        })
        await test.step(`Open new ${tradingInstrument} position`, async()=>{
            await mainPage.openBackMenuPoint("trade");
            await instruments.openPositionOfInstrument(tradingInstrument, 'Buy')
            await newPosition.installLotsSize(90, 2)
            await newPosition.submitPosition()
        })
        await test.step(`Switch to My trades and open Trade details popup`, async()=>{
            await mainPage.openBackMenuPoint("my-trades")
            tradeInstrumentName = await myTrades.getInstrumentName()
            deposit = await myTrades.getDepositValue(currency)
            await myTrades.openTradeDetails()
        })
        await test.step('Check trade details popup', async()=>{
            expect(await tradeDetails.getTradingInstrumnetName()).toContain(tradeInstrumentName)
            expect(await tradeDetails.getTradeOwner()).toEqual(user)
            expect(await tradeDetails.getDepositAmount()).toContain(deposit)
        })
        await test.step('Close trade details popup', async()=>{
            await tradeDetails.closePosition()
        })})
    }

    for(const{brand, user, currency} of tradeDetailsParams){
    test(`${brand} Edit position on Trade details popup`, 
        {tag:['@trading', '@web']}, async({page, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 35000)
        let stopLoss;
        let takeProfit;
        let signIn = new SignIn(page)
        let mainPage = new MainPage(page)
        let myTrades = new MyTrades(page)
        let instruments = new AllInstruments(page)
        let newPosition = new NewPosition(page)
        let tradeDetails = new TradeDetails(page)
        let changeLimitPopup = new ChangeLimitsPopup(page)
        let changeLimitSuccessPopup = new ChangeLimitSuccessPopup(page)
        await test.step(`Login to ${brand} by ${user}`, async () => {
            await signIn.goto(AppNAGA, "login");
            await signIn.signInUserToPlatform(user,process.env.USER_PASSWORD || "")
        })
        await test.step('Close opened positions, if they exist', async()=>{
            await mainPage.openBackMenuPoint("my-trades")
            await myTrades.closePositionsIfExist()
        })
        await test.step(`Open new ${tradingInstrument} position`, async()=>{
            await mainPage.openBackMenuPoint("trade");
            await instruments.openPositionOfInstrument(tradingInstrument, 'Buy')
            await newPosition.installLotsSize(90, 2)
            await newPosition.submitPosition()
        })
        await test.step(`Switch to My trades and open Trade details popup`, async()=>{
            await mainPage.openBackMenuPoint("my-trades")
            await myTrades.openTradeDetails()
        })
        await test.step('Check trade details popup. Edit position. Enable Stop Loss', async()=>{
            await tradeDetails.openEditLimitsPopup()
            await changeLimitPopup.switchToSpecificRate()
            let SL = await changeLimitPopup.updatePosition_EnableProtection('Stop Loss')
            await changeLimitPopup.updatePosition()
            await changeLimitSuccessPopup.acceptPopup()
            stopLoss = await tradeDetails.getTradeDetailsProtectionValue('Stop Loss')
            expect(stopLoss).toEqual(SL)
        })
        await test.step('Check trade details popup. Edit position. Enable Take Profit', async()=>{
            await tradeDetails.openEditLimitsPopup()
            await changeLimitPopup.switchToSpecificRate()
            await changeLimitPopup.updatePosition_EnableProtection('Stop Loss')
            let TP = await changeLimitPopup.updatePosition_EnableProtection('Take Profit')
            await changeLimitPopup.updatePosition()
            await changeLimitSuccessPopup.acceptPopup()
            takeProfit = await tradeDetails.getTradeDetailsProtectionValue('Take Profit')
            expect(takeProfit).toEqual(TP)
        })
        await test.step('Close position', async()=>{
            await tradeDetails.closePosition()
        })
    })
}
    for(const{brand, user, currency} of tradeDetailsParams){
    test(`${brand} Share opened position in feed. User shares posiiton from Trade details`, 
        {tag:['@web', '@feed']}, async({page, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 45000)
        let postText
        let signIn = new SignIn(page)
        let mainPage = new MainPage(page)
        let myTrades = new MyTrades(page)
        let myAccounts = new MyAccounts(page)
        let instruments = new AllInstruments(page)
        let newPosition = new NewPosition(page)
        let tradeDetails = new TradeDetails(page)
        let feed = new Feed(page)
        await test.step(`Login to ${brand} by ${user}`, async () => {
            await signIn.goto(AppNAGA, "login");
            await signIn.signInUserToPlatform(user,process.env.USER_PASSWORD || "")
        })
        await test.step('Close opened positions, if they exist', async()=>{
            await mainPage.openBackMenuPoint("my-trades")
            await myTrades.closePositionsIfExist()
        })
        await test.step(`Open new ${tradingInstrument} position`, async()=>{
            await mainPage.openBackMenuPoint("trade");
            await instruments.openPositionOfInstrument(tradingInstrument, 'Buy')
            await newPosition.installLotsSize(90, 2)
            await newPosition.submitPosition()
        })
        await test.step(`Switch to My trades and open Trade details popup`, async()=>{
            await mainPage.openBackMenuPoint("my-trades")
            await myTrades.openTradeDetails()
        })
        await test.step('Share trade infromation in feed', async()=>{
            postText = await tradeDetails.sharePostInFeed()
        })
        await test.step('Open My accounts(header)-> social profile. Check post in user cabinet', async()=>{
            await myAccounts.openUserMenu()
            await myAccounts.openMyAccountMenuItem('My Social Profile')
            await mainPage.refreshPage()
            expect(await feed.getLastPublishedTime()).toContain('sec')
            expect(await feed.getFirstPostInstrumentName()).toEqual(tradingInstrument)
        })
         await test.step('Close opened position', async()=>{
            await mainPage.openBackMenuPoint("my-trades")
            await myTrades.closePositionsIfExist()
        })
    })}

    for(const{brand, user}of tradeDetailsParams){
        test(`${brand} Baloon test. WEB notification about opened position`, 
            {tag:['@trading', '@web']}, async({page, AppNAGA}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 25000)
            let signIn = new SignIn(page)
            let mainPage = new MainPage(page)
            let myTrades = new MyTrades(page)
            let instruments = new AllInstruments(page)
            let newPosition = new NewPosition(page)
            await test.step(`Login to ${brand} by ${user}`, async () => {
            await signIn.goto(AppNAGA, "login");
            await signIn.signInUserToPlatform(user,process.env.USER_PASSWORD || "")
        })
        await test.step('Close opened positions, if they exist', async()=>{
            await mainPage.openBackMenuPoint("my-trades")
            await myTrades.closePositionsIfExist()
        })
        await test.step(`Open new ${tradingInstrument} position`, async()=>{
            await mainPage.openBackMenuPoint("trade");
            await instruments.openPositionOfInstrument(tradingInstrument, 'Buy')
            await newPosition.installLotsSize(90, 2)
            await newPosition.submitPosition()
        })
        await test.step('Check web notification appears after opened position', async()=>{
            let baloonText = await newPosition.getBalloonText()
            expect(baloonText).toEqual(` Your Solana/USD order was placed.`)
        })
        await test.step('Close opened positions, if they exist', async()=>{
            await mainPage.openBackMenuPoint("my-trades")
            await myTrades.closePositionsIfExist()
        })
    })
}
})

