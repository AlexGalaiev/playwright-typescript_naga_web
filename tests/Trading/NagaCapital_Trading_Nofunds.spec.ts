import { expect } from "@playwright/test";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { SighIn } from "../../pageObjects/SighIn/SignInPage";
import { AllInstruments } from "../../pageObjects/Trading/InstrumentsPage";
import { MyTrades } from "../../pageObjects/Trading/MyTrades";
import { NewPosition } from "../../pageObjects/Trading/OpenNewPositionPage";
import {test} from "..//..//test-options"

test.describe("Trading without funds", async()=>{
let tradingInstrument = "BTCEUR"
type testNoFunds = {
    testRailId: string, 
    brand: string,
    user: string,
}

const testNoFundsParaketers: testNoFunds[] = [
    {testRailId: '@25018', brand: '@NS', user: 'tradingNoFunds'},
    {testRailId: '@25176', brand: '@NM', user: 'tradNoFundsMarket'}
]
for(const{testRailId, brand, user}of testNoFundsParaketers){
    test(`${testRailId} Open position without funds ${brand}`, async({page})=>{
        let sighIn = new SighIn(page);
        let mainPage = new MainPage(page)
        let myTrades = new MyTrades(page)
        let instruments = new AllInstruments(page);
        let newPosition = new NewPosition(page)
        await test.step("Login to platfotm", async () => {
            await sighIn.goto(await sighIn.chooseBrand(brand), "login");
            await sighIn.sigInUserToPlatform(user, process.env.USER_PASSWORD || "");
          });
          await test.step("Check previously opened positions and close if they exist", async () => {
            await mainPage.openHeaderMenuPoint("my-trades");
            await myTrades.closePositionsIfExist();
          });
          await test.step("Choose instrument and open position", async () => {
            await mainPage.openHeaderMenuPoint("markets");
            await instruments.openPositionOfInstrument(tradingInstrument, 'Short')
            // await instruments.searchInstrument(tradingInstrument);
            // await instruments.openPosition('Short');
          });
          await test.step('Check new position messages', async()=>{
            expect(await newPosition.getNotEnoughFundsMsg()).toEqual('You have insufficient funds to trade at the moment')
            expect(await newPosition.getSubmitBtnText()).toEqual('Fund account now')
            await newPosition.submitPosition()
            expect(await mainPage.getUrl()).toContain('manage-money/deposit')
          })
    })
}

   
})
