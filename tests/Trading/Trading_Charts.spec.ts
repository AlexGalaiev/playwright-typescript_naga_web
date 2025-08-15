import {test} from "..//..//test-options"

test.describe('WEB', async()=>{

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
        test.skip(`${brand} Trading view charts visibility`, 
            {tag:['@web', '@smoke', '@trading']}, async({app, AppNAGA})=>{
        let tradingInstrument = 'SOLUSD'
        await test.step(`Login to platform by user ${user}`, async()=>{
            await app.signIn.goto(AppNAGA, 'login')
            await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
        })
        await test.step(`Search and open ${tradingInstrument} instrument. Get trading view response`, async()=>{
            await app.mainPage.globalSearch(tradingInstrument)

        })
        })
    }
})
