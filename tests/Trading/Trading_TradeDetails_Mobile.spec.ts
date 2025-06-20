import { expect } from "playwright/test"
import {test} from "..//..//test-options"

test.describe('Mobile', async()=>{
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
    test(`${brand} Trade details test`, {tag:['@trading', '@mobile']}, async({app, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 170000)
        let tradeInstrumentName
        let deposit
        await test.step(`Login to ${brand} by ${user}`, async () => {
            await app.signIn.goto(AppNAGA, "login");
            await app.signIn.signInUserToPlatform(user,process.env.USER_PASSWORD || "")
        })
        await test.step('Close opened positions, if they exist', async()=>{
            await app.mainPage.openMobileMenu('My Trades')
            await app.myTrades.closeMobilePositionsIfExist()
        })
        await test.step(`Open new ${tradingInstrument} position`, async()=>{
            await app.mainPage.openMobileMenu('Trade')
            await app.instruments.openMobilePosition(tradingInstrument, 'BUY')
            await app.newPosition.installMobileLotsSize(90, 2)
            await app.newPosition.submitPosition()
        })
        await test.step(`Switch to My trades and open Trade details popup`, async()=>{
            await app.mainPage.openMobileMenu("My Trades")
            tradeInstrumentName = await app.myTrades.getMobileInstrumentName()
            deposit = await app.myTrades.getMobileDepositValue(currency)
            await app.myTrades.openMobileTradeDetails()
        })
        await test.step('Check trade details popup', async()=>{
            expect(await app.tradeDetails.getTradingInstrumnetName()).toContain(tradeInstrumentName)
            expect(await app.tradeDetails.getTradeOwner()).toEqual(user)
            expect(await app.tradeDetails.getDepositAmount()).toContain(deposit)
        })
        await test.step('Close trade details popup', async()=>{
            await app.tradeDetails.closePosition()
        })})
    }

    for(const{brand, user, currency} of tradeDetailsParams){
    test(`${brand} Edit position on Trade details popup`, 
    {tag:['@trading', '@mobile']}, async({app, AppNAGA}, testInfo)=>{
    testInfo.setTimeout(testInfo.timeout + 30000)
    let stopLoss;
    let takeProfit
    await test.step(`Login to ${brand} by ${user}`, async () => {
        await app.signIn.goto(AppNAGA, "login");
        await app.signIn.signInUserToPlatform(user,process.env.USER_PASSWORD || "")
    })
    await test.step('Close opened positions, if they exist', async()=>{
        await app.mainPage.openMobileMenu('My Trades')
        await app.myTrades.closeMobilePositionsIfExist()
    })
    await test.step(`Open new ${tradingInstrument} position`, async()=>{
        await app.mainPage.openMobileMenu('Trade')
        await app.instruments.openMobilePosition(tradingInstrument, 'BUY')
        await app.newPosition.installMobileLotsSize(90, 2)
        await app.newPosition.submitPosition()
    })
    await test.step(`Switch to My trades and open Trade details popup`, async()=>{
        await app.mainPage.openMobileMenu("My Trades")
        await app.myTrades.openMobileTradeDetails()
    })
    await test.step('Check trade details popup. Edit position. Enable Stop Loss', async()=>{
        await app.tradeDetails.openEditLimitsPopup()
        await app.changeLimitPopup.switchToSpecificRate()
        let SL = await app.changeLimitPopup.updatePosition_EnableProtection('Stop Loss')
        await app.changeLimitPopup.updatePosition()
        await app.changeLimitSuccessPopup.acceptPopup()
        stopLoss = await app.tradeDetails.getTradeDetailsProtectionValue('Stop Loss')
        expect(stopLoss).toEqual(SL)
    })
    await test.step('Check trade details popup. Edit position. Enable Take Profit', async()=>{
        await app.tradeDetails.openEditLimitsPopup()
        await app.changeLimitPopup.switchToSpecificRate()
        await app.changeLimitPopup.updatePosition_EnableProtection('Stop Loss')
        let TP = await app.changeLimitPopup.updatePosition_EnableProtection('Take Profit')
        await app.changeLimitPopup.updatePosition()
        await app.changeLimitSuccessPopup.acceptPopup()
        takeProfit = await app.tradeDetails.getTradeDetailsProtectionValue('Take Profit')
        expect(takeProfit).toEqual(TP)
    })
    await test.step('Close position', async()=>{
        await app.tradeDetails.closePosition()
    })
})
}
    for(const{brand, user, currency} of tradeDetailsParams){
    test(`${brand} Share opened position in feed. User shares posiiton from Trade details`, 
        {tag:['@trading', '@mobile', '@feed']}, async({app, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 45000)
        let postText
        await test.step(`Login to ${brand} by ${user}`, async () => {
            await app.signIn.goto(AppNAGA, "login");
            await app.signIn.signInUserToPlatform(user,process.env.USER_PASSWORD || "")
        })
        await test.step('Close opened positions, if they exist', async()=>{
            await app.mainPage.openMobileMenu('My Trades')
            await app.myTrades.closeMobilePositionsIfExist()
        })
        await test.step(`Open new ${tradingInstrument} position`, async()=>{
            await app.mainPage.openMobileMenu('Trade')
            await app.instruments.openMobilePosition(tradingInstrument, 'BUY')
            await app.newPosition.installMobileLotsSize(90, 2)
            await app.newPosition.submitPosition()
        })
        await test.step(`Switch to My trades and open Trade details popup`, async()=>{
            await app.mainPage.openMobileMenu("My Trades")
            await app.myTrades.openMobileTradeDetails()
        })
        await test.step('Share trade infromation in feed', async()=>{
            postText = await app.tradeDetails.sharePostInFeed()
        })
        await test.step('Open My accounts(header)-> social profile. Check post in user cabinet', async()=>{
            await app.mainPage.openMobileBackMenuPoint('My Social Profile')
            expect(await app.feed.checkMobileTradeBtnIsVisible()).toBeTruthy()
        })
        await test.step('Close opened positions, if they exist', async()=>{
            await app.mainPage.openMobileMenu('My Trades')
            await app.myTrades.closeMobilePositionsIfExist()
        })
    })}

    for(const{brand, user}of tradeDetailsParams){
        test(`${brand} Baloon test. WEB notification about opened position`, 
            {tag:['@trading', '@mobile']}, async({app, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 25000)
        await test.step(`Login to ${brand} by ${user}`, async () => {
            await app.signIn.goto(AppNAGA, "login");
            await app.signIn.signInUserToPlatform(user,process.env.USER_PASSWORD || "")
        })
        await test.step('Close opened positions, if they exist', async()=>{
            await app.mainPage.openMobileMenu('My Trades')
            await app.myTrades.closeMobilePositionsIfExist()
        })
        await test.step(`Open new ${tradingInstrument} position`, async()=>{
            await app.mainPage.openMobileMenu('Trade')
            await app.instruments.openMobilePosition(tradingInstrument, 'BUY')
            await app.newPosition.installMobileLotsSize(90, 2)
            await app.newPosition.submitPosition()
        })
        await test.step('Check web notification appears after opened position', async()=>{
            let baloonText = await app.newPosition.getBalloonText()
            expect(baloonText).toEqual(` Your Solana/USD order was placed.`)
        })
        await test.step('Close opened positions, if they exist', async()=>{
            await app.mainPage.openMobileMenu('My Trades')
            await app.myTrades.closeMobilePositionsIfExist()
        })
    })
}
})

