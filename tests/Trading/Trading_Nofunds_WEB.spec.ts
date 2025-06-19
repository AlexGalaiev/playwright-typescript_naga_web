import { expect } from "@playwright/test";
import {test} from "../../test-options"

test.describe("Trading with No funds", async()=>{
type testNoFunds = {
    brand: string,
    user: string,
    tradingInstrument: string
}
//need to have opened previously opened positions of BTC

const testNoFundsParaketers: testNoFunds[] = [
   {brand: '@Capital', user: 'tradingNoFunds', tradingInstrument: "Bitcoin/EUR"},
   {brand: '@Markets', user: 'tradNoFundsMarket', tradingInstrument: "Bitcoin/EUR"},
   {brand: '@Mena', user: 'testNoFundsMena@naga.com', tradingInstrument: "Bitcoin/EUR"},
   {brand: '@Africa', user: 'testNoFundsAfrica@naga.com', tradingInstrument: "Bitcoin/EUR"}
]
for(const{ brand, user,tradingInstrument}of testNoFundsParaketers){
    test(`Open position without funds ${brand}`, 
      {tag:['@trading','@web']}, async({app, AppNAGA}, testInfo)=>{
      testInfo.setTimeout(testInfo.timeout + 60000)  
    await test.step(`Login to platfotm by ${user} to ${brand} brand`, async () => {
        await app.signIn.goto(AppNAGA, "login");
        await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || "");
    });
    await test.step(`Choose ${tradingInstrument} and open position`, async () => {
        await app.mainPage.openBackMenuPoint("trade");
        await app.instruments.openPositionOfInstrument(tradingInstrument, 'Sell')
    });
    await test.step('Check Not enough money messages', async()=>{
        expect(await app.newPosition.getNotEnoughFundsMsg()).toEqual('You have insufficient funds to trade at the moment')
        expect(await app.newPosition.getSubmitBtnText()).toEqual('Fund account now')
    })
})}
})
