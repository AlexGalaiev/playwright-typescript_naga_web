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
            {tag:['@web', '@smoke', '@trading']}, async({app, AppNAGA})=>{
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
})
