import { expect } from "playwright/test"
import { MainPage } from "../../pageObjects/MainPage/MainPage"
import { SignIn } from "../../pageObjects/SignIn/SignInPage"
import { AllInstruments } from "../../pageObjects/Trading/InstrumentsPage"
import { MyTrades } from "../../pageObjects/Trading/MyTrades"
import { NewPosition } from "../../pageObjects/Trading/OpenNewPositionPage"
import { TradeDetails } from "../../pageObjects/Trading/TradeDetails"
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
            })
        })
    }

})