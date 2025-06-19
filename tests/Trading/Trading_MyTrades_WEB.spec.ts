import { expect } from "@playwright/test";
import { test } from "../../test-options"

test.describe('WEB. ', async()=>{
    
    type myTrades = {
        user: string,
        brand: string
    }

    const testMyTradesParams: myTrades[] = [
        {user:'testTrading2', brand:'@Capital'},
        {user:'testTrading2Markets', brand:'@Markets'},
        {user:'testTrading@naga.com', brand:'@Mena'},
        {user:'testTradingAfrica2@naga.com', brand:'@Africa'},
    ]

    for(const{user, brand}of testMyTradesParams){
        test(`${brand} My trades. Filter closed positions by date.`, {tag:['@trading','@web']},async({app, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 20000)
        let NumberOfTrades_Today
        let NumberOfTrades_7Days
        let NumberOfTrades_30Days
        await test.step(`Login to platform ny user - ${user}, brand - ${brand}`, async()=>{
            await app.signIn.goto(AppNAGA, "login");
            await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || "");
        })
        await test.step(`Open My-trades and switch to Close tra`, async()=>{
            await app.mainPage.openBackMenuPoint('my-trades')
            await app.myTrades.openCloseTradesTab()
        })
        await test.step(`Install filter - Today, and check number of closed trades in UI`, async()=>{
            await app.myTrades.setFilterDate('Today')
            NumberOfTrades_Today = await app.myTrades.getNumberOfClosedTrades()
        })
        await test.step(`Install filter - Today, and check number of closed trades in UI`, async()=>{
            await app.myTrades.setFilterDate('Last 7 Days')
            NumberOfTrades_7Days = await app.myTrades.getNumberOfClosedTrades()
        })
        await test.step(`Install filter - Today, and check number of closed trades in UI`, async()=>{
            await app.myTrades.setFilterDate('Last 30 Days')
            NumberOfTrades_30Days = await app.myTrades.getNumberOfClosedTrades()
        })
        await test.step('Check that number of trades are changing with changing filter',async()=>{
            expect(Number(NumberOfTrades_30Days)).toBeGreaterThan(Number(NumberOfTrades_7Days))
            expect(Number(NumberOfTrades_7Days)).toBeGreaterThan(Number(NumberOfTrades_Today))
        })
    })
    }

    const tradeParams: myTrades[] = [
        {user:'testTrading2', brand:'@Capital'},
        {user:'testTrading2Markets', brand:'@Markets'}
    ]
    for(const{user, brand} of tradeParams){
        test(`${brand} My trades. Filter close positions by type`, 
            {tag:['@trading','@web'], annotation:{description:'https://keywaygroup.atlassian.net/browse/RG-9396',type:'ticket'}},async({app, AppNAGA}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 10000)
            let allTrades;
            let autocopiedTrades;
            let myAllTrades;
            await test.step(`Login to platform ny user - ${user}, brand - ${brand}`, async()=>{
                await app.signIn.goto(AppNAGA, "login");
                await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || "");
            })
            await test.step(`Open My-trades and switch to Close tra`, async()=>{
                await app.mainPage.openBackMenuPoint('my-trades')
                await app.myTrades.openCloseTradesTab()
                allTrades = await app.myTrades.getNumberOfClosedTrades()
                await app.myTrades.openTypeFilter()
            })
            await test.step(`Check autocopied closed positions`, async()=>{
                await app.myTrades.setTypeOfClosedPosition('Autocopied Trades')
                autocopiedTrades = await app.myTrades.getNumberOfClosedTrades()
                expect(await app.myTrades.checkSourceOfTradeVisibility('OWN TRADE')).not.toBeTruthy()
            })
            await test.step(`Check autocopied closed positions`, async()=>{
                await app.myTrades.setTypeOfClosedPosition('My Trades')
                myAllTrades = await app.myTrades.getNumberOfClosedTrades()
            })
            await test.step('Check filtering of trades via different type', async()=>{
                expect(Number(allTrades)).toBeGreaterThan(Number(myAllTrades))
                expect(Number(myAllTrades)).toBeGreaterThan(Number(autocopiedTrades))
            })
        })
    }
})
