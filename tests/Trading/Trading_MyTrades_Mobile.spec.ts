import { expect } from "@playwright/test";
import { test } from "../../test-options"

test.describe('Mobile ', async()=>{

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
    test(`${brand} My trades. Filter closed positions by date.`, {tag:['@trading','@mobile']},async({app, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 20000)
        await test.step(`Login to platform ny user - ${user}, brand - ${brand}`, async()=>{
            await app.signIn.goto(AppNAGA, "login");
            await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || "");
        })
        await test.step(`Open My-trades and switch to Close trade`, async()=>{
            await app.mainPage.openMobileMenu('My Trades')
            await app.myTrades.openMobileCloseTradesTab()
        })
        await test.step(`Check that first closed position is visible, and number of positions is displayed`, async()=>{
            expect(await app.myTrades.checkMobilePositionIsVisible()).toBeTruthy()
            expect(Number(await app.myTrades.getNumberOfClosedTrades())).toBeGreaterThan(1)
        })
    })
}
})
