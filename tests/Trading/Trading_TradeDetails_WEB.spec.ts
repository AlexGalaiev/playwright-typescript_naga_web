import { expect } from "playwright/test"
import {test} from "..//..//test-options"


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
    test(`${brand} Trade details test`, {tag:['@trading', '@web']}, async({app, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 170000)
        let tradeInstrumentName
        let deposit
        await test.step(`Login to ${brand} by ${user}`, async () => {
            await app.signIn.goto(AppNAGA, "login");
            await app.signIn.signInUserToPlatform(user,process.env.USER_PASSWORD || "")
        })
        await test.step('Close opened positions, if they exist', async()=>{
            await app.mainPage.openBackMenuPoint("my-trades")
            await app.myTrades.closePositionsIfExist()
        })
        await test.step(`Open new ${tradingInstrument} position`, async()=>{
            await app.mainPage.openBackMenuPoint("trade");
            await app.instruments.openPositionOfInstrument(tradingInstrument, 'Buy')
            await app.newPosition.installLotsSize(90, 2)
            await app.newPosition.submitPosition()
        })
        await test.step(`Switch to My trades and open Trade details popup`, async()=>{
            await app.mainPage.openBackMenuPoint("my-trades")
            tradeInstrumentName = await app.myTrades.getInstrumentName()
            deposit = await app.myTrades.getDepositValue(currency)
            await app.myTrades.openTradeDetails()
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
        {tag:['@trading', '@web']}, async({app, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 35000)
        let takeProfit;
        await test.step(`Login to ${brand} by ${user}`, async () => {
            await app.signIn.goto(AppNAGA, "login");
            await app.signIn.signInUserToPlatform(user,process.env.USER_PASSWORD || "")
        })
        await test.step('Close opened positions, if they exist', async()=>{
            await app.mainPage.openBackMenuPoint("my-trades")
            await app.myTrades.closePositionsIfExist()
        })
        await test.step(`Open new ${tradingInstrument} position`, async()=>{
            await app.mainPage.openBackMenuPoint("trade");
            await app.instruments.openPositionOfInstrument(tradingInstrument, 'Buy')
            await app.newPosition.installLotsSize(90, 2)
            await app.newPosition.submitPosition()
        })
        await test.step(`Switch to My trades and open Trade details popup`, async()=>{
            await app.mainPage.openBackMenuPoint("my-trades")
            await app.myTrades.openTradeDetails()
        })
        await test.step('Check trade details popup. Edit position. Enable Take Profit', async()=>{
            await app.tradeDetails.openEditLimitsPopup()
            await app.changeLimitPopup.switchToSpecificRate()
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
        {tag:['@web', '@feed', '@debug']}, async({app, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 45000)
        let postText
        await test.step(`Login to ${brand} by ${user}`, async () => {
            await app.signIn.goto(AppNAGA, "login");
            await app.signIn.signInUserToPlatform(user,process.env.USER_PASSWORD || "")
        })
        await test.step('Close opened positions, if they exist', async()=>{
            await app.mainPage.openBackMenuPoint("my-trades")
            await app.myTrades.closePositionsIfExist()
        })
        await test.step(`Open new ${tradingInstrument} position`, async()=>{
            await app.mainPage.openBackMenuPoint("trade");
            await app.instruments.openPositionOfInstrument(tradingInstrument, 'Buy')
            await app.newPosition.installLotsSize(90, 2)
            await app.newPosition.submitPosition()
        })
        await test.step(`Switch to My trades and open Trade details popup`, async()=>{
            await app.mainPage.openBackMenuPoint("my-trades")
            await app.myTrades.openTradeDetails()
        })
        await test.step('Share trade infromation in feed', async()=>{
            postText = await app.tradeDetails.sharePostInFeed()
        })
        await test.step('Open My accounts(header)-> social profile. Check post in user cabinet', async()=>{
            await app.myAccounts.openUserMenu()
            await app.myAccounts.openMyAccountMenuItem('My Social Profile')
            await app.mainPage.refreshPage()
            expect(await app.feed.getLastPublishedTime()).toContain('sec')
            expect(await app.feed.getFirstPostInstrumentName()).toEqual('Solana/USD')
        })
         await test.step('Close opened position', async()=>{
            await app.mainPage.openBackMenuPoint("my-trades")
            await app.myTrades.closePositionsIfExist()
        })
    })}

    for(const{brand, user}of tradeDetailsParams){
        test(`${brand} Baloon test. WEB notification about opened position`, 
            {tag:['@trading', '@web']}, async({app, AppNAGA}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 25000)
            await test.step(`Login to ${brand} by ${user}`, async () => {
            await app.signIn.goto(AppNAGA, "login");
            await app.signIn.signInUserToPlatform(user,process.env.USER_PASSWORD || "")
        })
        await test.step('Close opened positions, if they exist', async()=>{
            await app.mainPage.openBackMenuPoint("my-trades")
            await app.myTrades.closePositionsIfExist()
        })
        await test.step(`Open new ${tradingInstrument} position`, async()=>{
            await app.mainPage.openBackMenuPoint("trade");
            await app.instruments.openPositionOfInstrument(tradingInstrument, 'Buy')
            await app.newPosition.installLotsSize(90, 2)
            await app.newPosition.submitPosition()
        })
        await test.step('Check web notification appears after opened position', async()=>{
            let baloonText = await app.newPosition.getBalloonText()
            expect(baloonText).toEqual(` Your Solana/USD order was placed.`)
        })
        await test.step('Close opened positions, if they exist', async()=>{
            await app.mainPage.openBackMenuPoint("my-trades")
            await app.myTrades.closePositionsIfExist()
        })
    })
}
})

