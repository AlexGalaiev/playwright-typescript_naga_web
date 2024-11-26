import { expect } from "@playwright/test";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { SignIn } from "../../pageObjects/SignIn/SignInPage";
import { AllInstruments } from "../../pageObjects/Trading/InstrumentsPage";
import { MyTrades } from "../../pageObjects/Trading/MyTrades";
import { NewPosition } from "../../pageObjects/Trading/OpenNewPositionPage";
import {test} from "..//..//test-options"

test.describe("Trading without funds", async()=>{
let tradingInstrument = "Bitcoin/EUR"
type testNoFunds = {
    testRailId: string, 
    brand: string,
    user: string,
}
//need to have opened previously opened positions of BTC

const testNoFundsParaketers: testNoFunds[] = [
   {testRailId: '@25018', brand: '@NS', user: 'tradingNoFunds'},
   {testRailId: '@25176', brand: '@NM', user: 'tradNoFundsMarket'}
]
for(const{testRailId, brand, user}of testNoFundsParaketers){
    test(`${testRailId} Open position without funds ${brand}`, {tag:'@trading'}, async({page}, testInfo)=>{
      await testInfo.setTimeout(testInfo.timeout + 40000);  
      let signIn = new SignIn(page);
        let mainPage = new MainPage(page)
        let instruments = new AllInstruments(page);
        let newPosition = new NewPosition(page)
        await test.step(`Login to platfotm by ${user} to ${brand} brand`, async () => {
            await signIn.goto(await signIn.chooseBrand(brand), "login");
            await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || "");
          });
          await test.step(`Choose ${tradingInstrument} and open position`, async () => {
            await mainPage.openHeaderMenuPoint("markets");
            await instruments.openPositionOfInstrument(tradingInstrument, 'Short')
          });
          await test.step('Check Not enough money messages', async()=>{
            expect(await newPosition.getNotEnoughFundsMsg()).toEqual('You have insufficient funds to trade at the moment')
            expect(await newPosition.getSubmitBtnText()).toEqual('Fund account now')
            await newPosition.submitPosition()
            expect(await mainPage.getUrl()).toContain('manage-money/deposit')
          })
    })
}
})
