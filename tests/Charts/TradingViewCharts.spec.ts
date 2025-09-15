import { expect } from "@playwright/test"
import {test} from "../../test-options"

test.describe('Trading view charts', async()=>{

    type chartsTypes= {
        brand: string,
        user: string
    }
    const tradingViewCharts: chartsTypes[] = [
        {brand:'@Capital', user:'leadCapital@naga.com'},
        {brand:'@Markets', user:'leadMarkets@naga.com'},
        {brand:'@Mena', user:'leadMena@naga.com'},
        {brand:'@Africa', user:'leadAfrica@naga.com'},
    ]
    for(const {brand, user} of tradingViewCharts){
        test(`${brand} Chart visibility. Check response from tradiung view service`, 
            {tag:['@web', '@smoke', '@trading','@lightTests']}, async({app, AppNAGA})=>{
        let tradingInstrument = 'SOLUSD'
        await test.step(`Login to platform by user ${user}`, async()=>{
            await app.signIn.goto(AppNAGA, 'login')
            await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
        })
        await test.step(`Search and open ${tradingInstrument} instrument. Get trading view response`, async()=>{
            const [config, symbols] = await app.mainPage.getTradingViewResponse(tradingInstrument)
            expect(await app.mainPage.getServiceStatusCode(config)).toEqual(200)
            expect(await app.mainPage.getInstrumentFullName(symbols)).toEqual(tradingInstrument)
        })
        })
    }

    type chartTabsViaInstruments = {
        brand: string,
        user: string,
        instrument1: string,
        instrument2: string,
        instrument3: string
    }
    const chartTabInstrumentsView: chartTabsViaInstruments[] = [
        {brand: '@Capital', user:'testTrading2', instrument1:'AUDCHF', instrument2:'SOLUSD', instrument3:'FB.OQ'},
        {brand: '@Markets', user:'testTrading2Markets', instrument1:'EURUSD', instrument2:'BTCEUR', instrument3:'AAPL'},
        {brand: '@Africa', user:'testTradingAfrica2', instrument1:'AUDJPY', instrument2:'DOGEUSD', instrument3:'TSLA.OQ'},
    ]
    for(const{brand, user, instrument1, instrument2, instrument3} of chartTabInstrumentsView){
        test(`${brand} Check visibility of chart tabs. And check visibility elements inside these tabs`, 
            {tag:['@web', '@smoke', '@trading','@lightTests']}, async({app, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout+40000)
        await test.step(`Login to platform by user ${user}. Open Trade tab`, async()=>{
            await app.signIn.goto(AppNAGA, 'login')
            await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
            await app.mainPage.openBackMenuPoint('trade')
        })
        await test.step(`Open category Forex and check ${instrument1} instrument`, async()=>{
            await app.instruments.searchInstrument(instrument1)
            await app.instruments.openIntrument(instrument1)
            await app.newPosition.switchToTab('Chart')
            expect(await app.newPosition.checkChartIsVisible()).toBeTruthy
            await app.newPosition.switchToTab('Overview')
            expect(await app.newPosition.checkChartIsVisible()).toBeTruthy
            await app.newPosition.switchToTab('Community')
            expect(await app.newPosition.checkFeedFormIsVisible()).toBeTruthy()
            let code3 = await app.newPosition.switchToTab('Insights')
            expect(await app.newPosition.checkSymolsItemsIsVisbile()).toBeTruthy()
            await app.newPosition.moveBackToTrades()
        })
        await test.step(`Open category RealStock and check ${instrument2} instrument`, async()=>{
            await app.instruments.inputInSearch(instrument2)
            await app.instruments.openIntrument(instrument2)
            await app.newPosition.switchToTab('Chart')
            expect(await app.newPosition.checkChartIsVisible()).toBeTruthy
            await app.newPosition.switchToTab('Overview')
            expect(await app.newPosition.checkChartIsVisible()).toBeTruthy
            await app.newPosition.switchToTab('Community')
            expect(await app.newPosition.checkFeedFormIsVisible()).toBeTruthy()
            await app.newPosition.switchToTab('Insights')
            expect(await app.newPosition.checkSymolsItemsIsVisbile()).toBeTruthy()
            await app.newPosition.moveBackToTrades()
        })
        await test.step(`Open category Commodity Futures and check ${instrument3} instrument`, async()=>{
            await app.instruments.inputInSearch(instrument3)
            await app.instruments.openIntrument(instrument3)
            let code7 = await app.newPosition.switchToTab('Chart')
            expect(await app.newPosition.checkChartIsVisible()).toBeTruthy
            let code8 = await app.newPosition.switchToTab('Overview')
            expect(await app.newPosition.checkChartIsVisible()).toBeTruthy
            await app.newPosition.switchToTab('Community')
            expect(await app.newPosition.checkFeedFormIsVisible()).toBeTruthy()
            let code9 = await app.newPosition.switchToTab('Insights')
            expect(await app.newPosition.checkSmartScoreIsVisible()).toBeTruthy()
            await app.newPosition.moveBackToTrades()
        })
    })
    }
})
