import { expect } from "@playwright/test";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { SignIn } from "../../pageObjects/SignIn/SignInPage";
import { AllInstruments } from "../../pageObjects/Trading/InstrumentsPage";
import { NewPosition } from "../../pageObjects/Trading/OpenNewPositionPage";
import {test} from "../../test-options"

test.describe("Trading without funds", async()=>{
type testNoFunds = {
    testRailId: string, 
    brand: string,
    user: string,
    tradingInstrument: string
}
//need to have opened previously opened positions of BTC

const testNoFundsParaketers: testNoFunds[] = [
   {testRailId: '@25018', brand: '@Capital', user: 'tradingNoFunds', tradingInstrument: "Bitcoin/EUR"},
   {testRailId: '@25176', brand: '@Markets', user: 'tradNoFundsMarket', tradingInstrument: "Cardano/USD"},
   {testRailId: '@25381', brand: '@Mena', user: 'testNoFundsMena@naga.com', tradingInstrument: "Bitcoin/EUR"},
   {testRailId: '@25420', brand: '@Africa', user: 'testTradingAfrica@naga.com', tradingInstrument: "Bitcoin/EUR"}
]
for(const{testRailId, brand, user,tradingInstrument}of testNoFundsParaketers){
    test(`${testRailId} Open position without funds ${brand}`, {tag:['@trading']}, async({page}, testInfo)=>{
      await testInfo.setTimeout(testInfo.timeout + 60000);  
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
          })
    })
}
})
