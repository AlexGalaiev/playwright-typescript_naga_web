import { expect } from "@playwright/test";
import { test } from "../../test-options";
import { getLocalization } from "../../pageObjects/localization/getText";

type tradingTypes = {
  brand: string,
  user: string,
  investDirection: string,
  currency: string,
  mobileDirection: string,
  ratePosition: string
}
const tradingInstrument = "SOLUSD";
const realStockInstrument = 'ABNB.re'
const realStockInstrumentShort = 'A.N'
let investmentValue;
let units;
let rate;

test.describe("Trading - Positions/Orders.", async () => {

  const tradingParamsPositions: tradingTypes[] = [
    {brand: '@Capital', user:'testTrading2', investDirection:'SELL',currency:'$', mobileDirection:'SELL', ratePosition:'Short'},
    {brand: '@Capital', user:'testTrading2', investDirection:"BUY", currency:'$', mobileDirection:'BUY', ratePosition:'Long'},
    {brand: '@Markets', user:'testTrading2Markets', investDirection:'SELL', currency:'$',mobileDirection:'SELL', ratePosition:'Short'},
    {brand: '@Markets', user:'testTrading2Markets', investDirection:'BUY', currency:'$',mobileDirection:'BUY', ratePosition:'Long'},
    {brand: '@Mena', user:'testTrading@naga.com', investDirection:'SELL',currency:'€', mobileDirection: 'SELL', ratePosition:'Short'},
    {brand: '@Mena', user:'testTrading@naga.com', investDirection:'BUY',currency:'€', mobileDirection: 'BUY', ratePosition:'Long'},
    {brand: '@Africa', user:'testTradingAfrica2@naga.com', investDirection:'SELL',currency:'$', mobileDirection:'SELL', ratePosition:'Short'},
    {brand: '@Africa', user:'testTradingAfrica2@naga.com', investDirection:'BUY',currency:'$', mobileDirection:'BUY', ratePosition:'Long'}
  ]
  for(const{brand, user,investDirection, currency, mobileDirection, ratePosition}of tradingParamsPositions){
    test(`${brand} Open/Close ${investDirection} trading position`,
        {tag:['@trading', '@prodSanity', '@web'], 
          annotation:{type:'ticket', description:'https://keywaygroup.atlassian.net/browse/RG-6633'}}, 
        async ({ app, AppNAGA }, testInfo) => {
      testInfo.setTimeout(testInfo.timeout + 90000)
      await test.step(`Login to ${brand} by ${user}`, async () => {
        await app.signIn.goto(AppNAGA, "login");
        await app.signIn.signInUserToPlatform(user,process.env.USER_PASSWORD || "");
      });
      await test.step("Test check's previously opened positions. Test close's, if positions exist", async () => {
        await app.mainPage.openBackMenuPoint("my-trades");
        await app.myTrades.closePositionsIfExist();
      });
      await test.step(`Choose ${tradingInstrument} instrument.  Open ${investDirection} type`, async () => {
        await app.mainPage.openBackMenuPoint("trade");
        await app.instruments.openPositionOfInstrument(tradingInstrument, investDirection)
      });
      await test.step(`Check status of ${investDirection} button. And click on Submit btn`, async () => {
        expect(await app.newPosition.getStatusOfBtn(await app.newPosition.investmentDirectionBtn(mobileDirection))).toContain('active')
        expect(await app.newPosition.getStatusOfBtn(await app.newPosition.ratePositionBtn(`Market Price`))).toContain('active')
        await app.newPosition.installLotsManually('0.01','Lotsize')
        await app.newPosition.submitPosition()
      });
      await test.step("Switch to My-Trades page. Save trading parameters - Investments and values. Close position", async () => {
        await app.mainPage.openBackMenuPoint("my-trades");
        expect(await app.myTrades.checkStatusOfElement(await app.myTrades.activeTradesTab)).toContain("active");
        investmentValue = await app.myTrades.getDepositValue(currency);
        units = await app.myTrades.getUnits();
        await app.myTrades.closePosition()
      });
      await test.step('Check successfull closing popup. Assert of trading parameters', async()=>{
        expect(Number(await app.successfullClosePopup.getDeposit(currency))).toBeCloseTo(Number(investmentValue), 0)
        expect(await app.successfullClosePopup.getLots()).toContain(units)
      })})
  }
})

test.describe('Trading - Pending orders', async()=>{
  
  const tradingParamsOrders: tradingTypes[] = [
    {brand: '@Capital', user:'testTrading2', investDirection:'SELL', currency:'$', mobileDirection:'SELL', ratePosition:'Short'},
    {brand: '@Capital', user:'testTrading2', investDirection:"BUY", currency:'$', mobileDirection:'BUY', ratePosition:'Long'},
    {brand: '@Markets', user:'testTrading2Markets', investDirection:'SELL', currency:'$', mobileDirection:'SELL', ratePosition:'Short'},
    {brand: '@Markets', user:'testTrading2Markets', investDirection:'BUY',currency:'$', mobileDirection:'BUY', ratePosition:'Long'},
    {brand: '@Mena', user:'testTrading@naga.com', investDirection:'BUY',currency:'€', mobileDirection:'BUY', ratePosition:'Long'},
    {brand: '@Mena', user:'testTrading@naga.com', investDirection:'SELL',currency:'€', mobileDirection:'SELL', ratePosition:'Short'},
    {brand: '@Africa', user:'testTradingAfrica2@naga.com', investDirection:'BUY',currency:'$', mobileDirection:'BUY', ratePosition:'Long'},
    {brand: '@Africa', user:'testTradingAfrica2@naga.com', investDirection:'SELL',currency:'$', mobileDirection:'SELL', ratePosition:'Short'}
  ]
  for(const{brand, user,investDirection, ratePosition}of tradingParamsOrders){
    test(`${brand} Open/Close pending ${investDirection} order`,
          {tag:['@trading', '@web'], 
          annotation:{type:'ticket', description:'https://keywaygroup.atlassian.net/browse/RG-6633'}},
          async ({ app,AppNAGA }, testInfo) => {
      testInfo.setTimeout(testInfo.timeout + 90000);
      await test.step(`Login to ${brand} by ${user}`, async () => {
        await app.signIn.goto(AppNAGA, "login");
        await app.signIn.signInUserToPlatform(user,process.env.USER_PASSWORD || "");
      });
      await test.step("Check previously opened positions. Close it if exist", async () => {
        await app.mainPage.openBackMenuPoint("my-trades");
        await app.myTrades.openActivePendingOrdersTab();
        await app.myTrades.removeOrdersIfExist();
      });
      await test.step(`Choose ${tradingInstrument} for trading. Open new position page`, async () => {
        await app.mainPage.openBackMenuPoint("trade");
        await app.instruments.openPositionOfInstrument(tradingInstrument, investDirection)
      });
      await test.step('Open order with manual rate value', async()=>{
        await app.newPosition.chooseBtn(await app.newPosition.ratePositionBtn(`Specific Price`))
        await app.newPosition.installLotsManually('0.01','Lotsize')
        await app.newPosition.submitPosition()
      })
      await test.step('Check my-trades', async()=>{
        await app.mainPage.openBackMenuPoint("my-trades");
        await app.myTrades.openActivePendingOrdersTab();
        units = await app.myTrades.getOrderUnits()
        rate = await app.myTrades.getOrdersRate()
        await app.myTrades.deleteOrder()
      })
      await test.step('Check succesfull closing order popup', async()=>{
        expect(Number(await app.successfullClosePopup.getRate())).toBeCloseTo(Number(rate), 0);
        expect(await app.successfullClosePopup.getLots()).toContain(units)
      })
  })}
  
  const tradingParameters: tradingTypes[] = [
    {brand: '@Capital', user:'testTrading2', investDirection:'SELL', mobileDirection:'SELL', currency:'$', ratePosition:'Short'},
    {brand: '@Markets', user:'testTrading2Markets', investDirection:"SELL", mobileDirection:'SELL', currency:'$', ratePosition:'Short'}
  ]
  for(const{ brand, user, investDirection}of tradingParameters){
    test(`Open short position of real stock ${brand}`,
      {tag:['@trading', '@web']}, async({app, AppNAGA}, testInfo)=>{
      testInfo.setTimeout(testInfo.timeout + 90000);
      let localization = new getLocalization('/pageObjects/localization/NagaCapital_Trading.json')
      await test.step(`Login to ${brand} by ${user}`, async () => {
        await app.signIn.goto(AppNAGA, "login");
        await app.signIn.signInUserToPlatform(user,process.env.USER_PASSWORD || "");
      });
      await test.step("Check previously opened positions. Close it if exist", async () => {
        await app.mainPage.openBackMenuPoint("my-trades");
        await app.myTrades.closePositionsIfExist();
      });
      await test.step(`Choose ${realStockInstrument} for trading. Open new position page`, async () => {
        await app.mainPage.openBackMenuPoint("trade");
        await app.instruments.openPositionOfInstrument(realStockInstrument, investDirection)
        expect(await app.realStockPopup.getPopupText()).toEqual(await localization.getLocalizationText('RealStock_OpenShortPosition'))
      })
    })
  }
})
