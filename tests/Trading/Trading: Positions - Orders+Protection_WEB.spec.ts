import { expect } from "@playwright/test";
import { test } from "../../test-options";

test.describe("Trading. Positions/Orders + protection", async () => {
type tradingTypesWithProtection = {
  brand: string,
  user: string,
  investDirection: string,
  protection: string,
  tradeField: string,
  mobileDirection: string,
  ratePosition:string
  currency: string
}
let tradingInstrument = "Solana/USD";
let NagaProtectionValue;
let TP;
let deposit;
let units;

const tradingParametersPositionsSL: tradingTypesWithProtection[] = [
  {brand: '@Capital', user:'testTrading2', investDirection:'Sell', protection: 'Stop Loss',tradeField: 'sl', mobileDirection:'SELL', ratePosition:'Short', currency:'$'},
  {brand: '@Capital', user:'testTrading2', investDirection:"Buy", protection: 'Take Profit',tradeField: 'tp', mobileDirection:'BUY', ratePosition:'Long',currency:'$'},
  {brand: '@Markets', user:'testTrading2Markets', investDirection:'Sell', protection: 'Stop Loss', tradeField:'sl', mobileDirection:'SELL', ratePosition:'Short',currency:'$'},
  {brand: '@Markets', user:'testTrading2Markets', investDirection:'Buy', protection: 'Take Profit', tradeField:'tp', mobileDirection:'BUY', ratePosition:'Long',currency:'$'},
  {brand: '@Mena', user:'testTrading@naga.com', investDirection:'Buy', protection: 'Take Profit', tradeField:'tp', mobileDirection:'BUY', ratePosition:'Long', currency:'€'},
  {brand: '@Mena', user:'testTrading@naga.com', investDirection:'Sell', protection: 'Stop Loss', tradeField:'sl',mobileDirection:'SELL', ratePosition:'Short',currency:'€'},
  {brand: '@Africa', user:'testTradingAfrica2@naga.com', investDirection:'Buy', protection: 'Take Profit', tradeField:'tp', mobileDirection:'BUY', ratePosition:'Long', currency:'$'},
  {brand: '@Africa', user:'testTradingAfrica2@naga.com', investDirection:'Sell', protection: 'Stop Loss', tradeField:'sl',mobileDirection:'SELL', ratePosition:'Short', currency:'$'},
]

for(const{brand, user, investDirection, protection,tradeField,currency} of tradingParametersPositionsSL){
  test(`${brand} Open/Close ${investDirection} position + ${protection}`, 
    {tag:['@trading','@web']}, async ({ app, AppNAGA }, testInfo) => {
    testInfo.setTimeout(testInfo.timeout + 90000);
    await test.step(`Login to platfotm ${brand} by ${user}`, async () => {
      await app.signIn.goto(AppNAGA, "login");
      await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || "");
    });
    await test.step("Check previously opened positions and close if they exist", async () => {
      await app.mainPage.openBackMenuPoint("my-trades");
      await app.myTrades.closePositionsIfExist();
    });
    await test.step(`Choose ${tradingInstrument} and open position`, async () => {
      await app.mainPage.openBackMenuPoint("trade");
      await app.instruments.openPositionOfInstrument(tradingInstrument, investDirection)
    });
    await test.step(`Open ${investDirection} position + ${protection}`, async () => {
      await app.newPosition.installLotsManually('0.01', 'Lotsize')
      await app.newPosition.enableProtection(protection)
      NagaProtectionValue = await app.newPosition.getProtectionValue(protection)
      await app.newPosition.submitPosition();
    });
    await test.step("Check My-trades popup", async () => {
      await app.mainPage.openBackMenuPoint("my-trades");
      expect(await app.myTrades.checkStatusOfElement(await app.myTrades.activeTradesTab)).toContain("active");
      expect(Number(await app.myTrades.getProtectionValue(tradeField, currency))).toBeCloseTo(Number(NagaProtectionValue), 0)
    });
    await test.step('Close position and check sucses popup', async()=>{
      await app.myTrades.closePosition()
      await app.successfullClosePopup.acceptPopup()
    })
  })}

  const tradingParametersOrders: tradingTypesWithProtection[] = [
    {brand: '@Capital', user:'testTrading2', investDirection:'Sell', protection: 'Stop Loss',tradeField: 'sl', mobileDirection:'SELL', ratePosition:'Short',currency:'$'},
    {brand: '@Capital', user:'testTrading2', investDirection:"Buy", protection: 'Take profit',tradeField: 'tp', mobileDirection:'BUY', ratePosition:'Long',currency:'$'},
    {brand: '@Markets', user:'testTrading2Markets', investDirection:'Sell', protection: 'Stop Loss', tradeField:'sl', mobileDirection:'SELL', ratePosition:'Short',currency:'$'},
    {brand: '@Markets', user:'testTrading2Markets', investDirection:'Buy', protection: 'Take profit', tradeField:'tp', mobileDirection:'BUY', ratePosition:'Long',currency:'$'},
    {brand: '@Mena', user:'testTrading@naga.com', investDirection:'Buy', protection: 'Take profit', tradeField:'tp', mobileDirection:'BUY', ratePosition:'Long',currency:'€'},
    {brand: '@Mena', user:'testTrading@naga.com', investDirection:'Sell', protection: 'Stop Loss', tradeField:'sl', mobileDirection:'SELL', ratePosition:'Short',currency:'€'},
    {brand: '@Africa', user:'testTradingAfrica2@naga.com', investDirection:'Buy', protection: 'Take profit', tradeField:'tp', mobileDirection:'BUY', ratePosition:'Long',currency:'$'},
    {brand: '@Africa', user:'testTradingAfrica2@naga.com', investDirection:'Sell', protection: 'Stop Loss', tradeField:'sl', mobileDirection:'SELL', ratePosition:'Short',currency:'$'}
  ]
  for(const{brand, user, investDirection, protection, tradeField,ratePosition, currency}of tradingParametersOrders){
    test(`${brand} Open/Close pending ${investDirection} position + ${protection}`, 
      {tag:['@trading', '@web']}, async({app, AppNAGA}, testInfo)=>{
      testInfo.setTimeout(testInfo.timeout + 170000);
      await test.step(`Login to ${brand} platfotm by ${user}`, async () => {
        await app.signIn.goto(AppNAGA, "login");
        await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || "");
      });
      await test.step("Check previously opened orders and close if they exist", async () => {
        await app.mainPage.openBackMenuPoint("my-trades");
        await app.myTrades.openActivePendingOrdersTab();
        await app.myTrades.removeOrdersIfExist();
      });
      await test.step(`Choose ${tradingInstrument} and open position`, async () => {
        await app.mainPage.openBackMenuPoint("trade");
        await app.instruments.openPositionOfInstrument(tradingInstrument, investDirection)
      });
      await test.step(`Open ${investDirection} position + ${protection}`, async () => {
        await app.newPosition.chooseBtn(await app.newPosition.ratePositionBtn(`Specific Price`))
        //await app.newPosition.installLotsSize(90, 2)
        await app.newPosition.installLotsManually('0.01','Lotsize')
        await app.newPosition.enableProtection(protection)
        NagaProtectionValue = await app.newPosition.getProtectionValue(protection)
        await app.newPosition.submitPosition();
      });
      await test.step("Check My-trades popup", async () => {
        await app.mainPage.openBackMenuPoint("my-trades");
        await app.myTrades.openActivePendingOrdersTab();
        expect(await app.myTrades.checkStatusOfElement(await app.myTrades.activePendingOrdersTab)).toContain("active");
        expect(Number(await app.myTrades.getProtectionValue(tradeField, currency))).toBeCloseTo(Number(NagaProtectionValue), 0)
      });
      await test.step('Close position and check sucses popup', async()=>{
        await app.myTrades.closePosition()
        await app.successfullClosePopup.acceptPopup()
      })
      })
  }

 
type changeLimittypes = {
  brand: string, 
  user: string,
  investDirection: string,
  protectionSL: string,
  protectionTP: string,
  tradeFieldSL: string,
  tradeFieldsTP: string,
  currency: string,
  mobileDirection: string,
}

const tradingParametersSLTP: changeLimittypes[] = [
  {brand: '@Capital', user:'testTrading2', investDirection:'Sell', protectionSL: 'Stop Loss', protectionTP: 'Take Profit', tradeFieldSL: 'sl', tradeFieldsTP: 'tp', currency:'$', mobileDirection:'SELL'},
  {brand: '@Markets', user:'testTrading2Markets', investDirection:"Sell", protectionSL: 'Stop Loss', protectionTP: 'Take Profit', tradeFieldSL: 'sl', tradeFieldsTP: 'tp', currency:'$', mobileDirection:'SELL'},
  {brand: '@Mena', user:'testTrading@naga.com', investDirection:"Sell", protectionSL: 'Stop Loss', protectionTP: 'Take Profit', tradeFieldSL: 'sl', tradeFieldsTP: 'tp', currency:'€', mobileDirection:'SELL'},
  {brand: '@Africa', user:'testTradingAfrica2@naga.com', investDirection:"Sell", protectionSL: 'Stop Loss', protectionTP: 'Take Profit', tradeFieldSL: 'sl', tradeFieldsTP: 'tp', currency:'$', mobileDirection:'SELL'}
]
for(const{brand, user, investDirection, protectionSL, protectionTP, tradeFieldSL, tradeFieldsTP, currency} of tradingParametersSLTP){
  test(`${brand} Edit position popup with ${protectionSL}/${protectionTP}`, 
    {tag:['@trading','@web']}, async({app, AppNAGA}, testInfo)=>{
    testInfo.setTimeout(testInfo.timeout + 170000);
    let stopLossValue;
    await test.step(`Login to ${brand} platfotm by ${user}`, async () => {
      await app.signIn.goto(AppNAGA, "login");
      await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || "");
    });
    await test.step("Check previously opened positions. Close it if exist", async () => {
      await app.mainPage.openBackMenuPoint("my-trades")
      await app.myTrades.openActivePendingOrdersTab();
      await app.myTrades.removeOrdersIfExist();
    });
    await test.step(`Choose ${tradingInstrument} for trading. Open new position page. Enable ${protectionSL} `, async () => {
      await app.mainPage.openBackMenuPoint("trade");
      await app.instruments.openPositionOfInstrument(tradingInstrument, investDirection)
      //await app.newPosition.switchToSpecificRateForm()
      await app.newPosition.chooseBtn(await app.newPosition.ratePositionBtn(`Specific Price`))
      //await app.newPosition.installLotsSize(90, 2)
      await app.newPosition.installLotsManually('0.01', 'Lotsize')
      await app.newPosition.enableProtection(protectionSL)
      stopLossValue = await app.newPosition.getStopLossValue(protectionSL)
      await app.newPosition.submitPosition(); 
    });
    await test.step("Check My-trades", async () => {
      await app.mainPage.openBackMenuPoint("my-trades");
      //expect(await app.myTrades.checkStatusOfElement(await app.myTrades.activeTradesTab)).toContain("active");
      await app.myTrades.openActivePendingOrdersTab();
      deposit = (await app.myTrades.getDepositValue(currency));
      units = await app.myTrades.getUnits();
      expect(await app.myTrades.getStopLossValue()).toContain(stopLossValue)
      await app.myTrades.openChangeLimitPopup()
    })
    await test.step(`Enable ${protectionTP} and check result`, async()=>{
      await app.changeLimitPopup.switchToSpecificRateForm()
      await app.changeLimitPopup.enableStopLoss();
      await app.changeLimitPopup.enableTakeProgit();
      TP = await app.changeLimitPopup.getProtectionValue(protectionTP)
      await app.changeLimitPopup.updatePosition()
    })
    await test.step('Check change limit succesfull popup', async()=>{
      expect(await app.changeLimitSuccessPopup.getProtectionValue(protectionTP)).toContain(TP)
      await app.changeLimitSuccessPopup.acceptPopup()
    })
    await test.step('Check my traders Stop Loss and Take profit', async()=>{
      expect(await app.myTrades.getProtectionValue(tradeFieldsTP, currency)).toContain(TP)
      await app.myTrades.closePosition()
      await app.successfullClosePopup.acceptPopup()
    })
  })}
})
