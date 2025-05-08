import { expect } from "@playwright/test";
import { SignIn } from "../../pageObjects/SignIn/SignInPage";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { MyTrades } from "../../pageObjects/Trading/MyTrades";
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
    test(`${brand} My trades. Filter closed positions by date.`, {tag:['@trading','@mobile']},async({page, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 20000)
        let signIn = new SignIn(page)
        let mainPage = new MainPage(page)
        let myTrades = new MyTrades(page)
        await test.step(`Login to platform ny user - ${user}, brand - ${brand}`, async()=>{
            await signIn.goto(AppNAGA, "login");
            await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || "");
        })
        await test.step(`Open My-trades and switch to Close trade`, async()=>{
            await mainPage.openMobileMenu('My Trades')
            await myTrades.openMobileCloseTradesTab()
        })
        await test.step(`Check that first closed position is visible, and number of positions is displayed`, async()=>{
            expect(await myTrades.checkMobilePositionIsVisible()).toBeTruthy()
            expect(Number(await myTrades.getNumberOfClosedTrades())).toBeGreaterThan(1)
        })
    })
}
})
