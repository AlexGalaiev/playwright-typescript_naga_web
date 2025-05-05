import { expect } from "@playwright/test";
import { SignIn } from "../../pageObjects/SignIn/SignInPage";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { MyTrades } from "../../pageObjects/Trading/MyTrades";
import { test } from "..//..//test-options"

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
        test(`${brand} My trades. Filter closed positions by date.`, {tag:['@trading','@web']},async({page, AppNAGA}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 10000)
            let signIn = new SignIn(page)
            let mainPage = new MainPage(page)
            let myTrades = new MyTrades(page)
            let NumberOfTrades_Today
            let NumberOfTrades_7Days
            let NumberOfTrades_30Days
            await test.step(`Login to platform ny user - ${user}, brand - ${brand}`, async()=>{
                await signIn.goto(AppNAGA, "login");
                await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || "");
            })
            await test.step(`Open My-trades and switch to Close tra`, async()=>{
                await mainPage.openBackMenuPoint('my-trades')
                await myTrades.openCloseTradesTab()
            })
            await test.step(`Install filter - Today, and check number of closed trades in UI`, async()=>{
                await myTrades.setFilterDate('Today')
                NumberOfTrades_Today = await myTrades.getNumberOfClosedTrades()
            })
            await test.step(`Install filter - Today, and check number of closed trades in UI`, async()=>{
                await myTrades.setFilterDate('Last 7 Days')
                NumberOfTrades_7Days = await myTrades.getNumberOfClosedTrades()
            })
            await test.step(`Install filter - Today, and check number of closed trades in UI`, async()=>{
                await myTrades.setFilterDate('Last 30 Days')
                NumberOfTrades_30Days = await myTrades.getNumberOfClosedTrades()
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
            {tag:['@trading','@web'], annotation:{description:'https://keywaygroup.atlassian.net/browse/RG-9396',type:'ticket'}},async({page, AppNAGA}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 10000)
            let signIn = new SignIn(page)
            let mainPage = new MainPage(page)
            let myTrades = new MyTrades(page)
            let allTrades;
            let autocopiedTrades;
            let myAllTrades;
            await test.step(`Login to platform ny user - ${user}, brand - ${brand}`, async()=>{
                await signIn.goto(AppNAGA, "login");
                await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || "");
            })
            await test.step(`Open My-trades and switch to Close tra`, async()=>{
                await mainPage.openBackMenuPoint('my-trades')
                await myTrades.openCloseTradesTab()
                allTrades = await myTrades.getNumberOfClosedTrades()
                await myTrades.openTypeFilter()
            })
            await test.step(`Check autocopied closed positions`, async()=>{
                await myTrades.setTypeOfClosedPosition('Autocopied Trades')
                autocopiedTrades = await myTrades.getNumberOfClosedTrades()
                expect(await myTrades.checkSourceOfTradeVisibility('OWN TRADE')).not.toBeTruthy()
            })
            await test.step(`Check autocopied closed positions`, async()=>{
                await myTrades.setTypeOfClosedPosition('My Trades')
                myAllTrades = await myTrades.getNumberOfClosedTrades()
            })
            await test.step('Check filtering of trades via different type', async()=>{
                expect(Number(allTrades)).toBeGreaterThan(Number(myAllTrades))
                expect(Number(myAllTrades)).toBeGreaterThan(Number(autocopiedTrades))
            })
        })
    }
})
