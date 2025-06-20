import { expect } from "playwright/test";
import { test } from "../../test-options";

test.describe('Mobile trading with protections', async()=>{
type tradingTypesWithProtection = {
    brand: string,
    user: string,
    investDirection: string,
    protection: string,
    tradeField: string,
    mobileDirection: string
  }
  let tradingInstrument = "Solana/USD";
  let NagaProtectionValue;
  let SL; 
  let TP;
  let deposit;
  let units;
  
  const tradingParametersPositionsSL: tradingTypesWithProtection[] = [
    {brand: '@Capital', user:'testTrading2', investDirection:'Short', protection: 'Stop Loss',tradeField: 'sl', mobileDirection:'SELL'},
    {brand: '@Capital', user:'testTrading2', investDirection:"Long", protection: 'Take Profit',tradeField: 'tp', mobileDirection:'BUY'},
    {brand: '@Markets', user:'testTrading2Markets', investDirection:'Short', protection: 'Stop Loss', tradeField:'sl', mobileDirection:'SELL'},
    {brand: '@Markets', user:'testTrading2Markets', investDirection:'Long', protection: 'Take Profit', tradeField:'tp', mobileDirection:'BUY'},
    {brand: '@Mena', user:'testTrading@naga.com', investDirection:'Long', protection: 'Take Profit', tradeField:'tp', mobileDirection:'BUY'},
    {brand: '@Mena', user:'testTrading@naga.com', investDirection:'Short', protection: 'Stop Loss', tradeField:'sl',mobileDirection:'SELL'},
    {brand: '@Africa', user:'testTradingAfrica2@naga.com', investDirection:'Long', protection: 'Take Profit', tradeField:'tp', mobileDirection:'BUY'},
    {brand: '@Africa', user:'testTradingAfrica2@naga.com', investDirection:'Short', protection: 'Stop Loss', tradeField:'sl',mobileDirection:'SELL'},
]
for(const{brand, user, investDirection, protection,tradeField,mobileDirection} of tradingParametersPositionsSL){
  test(`${brand} Mobile Open/Close ${investDirection} position + ${protection}`, 
    {tag:['@trading','@mobile']}, async ({ app,AppNAGA }, testInfo) => {
    testInfo.setTimeout(testInfo.timeout + 170000);
    await test.step(`Login to platfotm ${brand} by ${user}`, async () => {
      await app.signIn.goto(AppNAGA, "login");
      await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || "");
    });
    await test.step("Check previously opened positions and close if they exist", async () => {
      await app.mainPage.openMobileMenu('My Trades');
      await app.myTrades.closeMobilePositionsIfExist();
    });
    await test.step(`Choose ${tradingInstrument} and open position`, async () => {
      await app.mainPage.openMobileMenu('Trade');
      await app.instruments.openMobilePosition(tradingInstrument, mobileDirection)
    });
    await test.step(`Open ${investDirection} position + ${protection}`, async () => {
      await app.newPosition.enableProtection(protection)
      await app.newPosition.installMobileLotsSize(55, 2)
      NagaProtectionValue = await app.newPosition.getProtectionValue(protection)
      await app.newPosition.submitPosition();
    });
    await test.step("Check My-trades popup", async () => {
      await app.mainPage.openMobileMenu('My Trades');
      expect(await app.myTrades.checkStatusOfElement(await app.myTrades.activeTradesTab)).toContain("active");
      await app.myTrades.clickMobilePositionAndOpenTradedetails()
      let protectionValue = await app.tradeDetails.getMobileProtectionValue(protection);
      expect(Number(protectionValue)).toBeCloseTo(Number(NagaProtectionValue), 0)
      await app.tradeDetails.closePosition()
    });
    await test.step('Close position and check sucses popup', async()=>{
      await app.successfullClosePopup.successOkBtnclick()
    })
  })}


  const tradingParametersOrders: tradingTypesWithProtection[] = [
    {brand: '@Capital', user:'testTrading2', investDirection:'Short', protection: 'Stop Loss',tradeField: 'sl', mobileDirection:'SELL'},
    {brand: '@Capital', user:'testTrading2', investDirection:"Long", protection: 'Take profit',tradeField: 'tp', mobileDirection:'BUY'},
    {brand: '@Markets', user:'testTrading2Markets', investDirection:'Short', protection: 'Stop Loss', tradeField:'sl', mobileDirection:'SELL'},
    {brand: '@Markets', user:'testTrading2Markets', investDirection:'Long', protection: 'Take profit', tradeField:'tp', mobileDirection:'BUY'},
    {brand: '@Mena', user:'testTrading@naga.com', investDirection:'Long', protection: 'Take profit', tradeField:'tp', mobileDirection:'BUY'},
    {brand: '@Mena', user:'testTrading@naga.com', investDirection:'Short', protection: 'Stop Loss', tradeField:'sl', mobileDirection:'SELL'},
    {brand: '@Africa', user:'testTradingAfrica2@naga.com', investDirection:'Long', protection: 'Take profit', tradeField:'tp', mobileDirection:'BUY'},
    {brand: '@Africa', user:'testTradingAfrica2@naga.com', investDirection:'Short', protection: 'Stop Loss', tradeField:'sl', mobileDirection:'SELL'}
  ]

   for(const{ brand, user, investDirection, protection, tradeField, mobileDirection}of tradingParametersOrders){
      test(`${brand} Mobile Open/Close pending ${investDirection} position + ${protection}`, 
        {tag:['@trading', '@mobile']}, async({app, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 170000);
        await test.step(`Login to ${brand} platfotm by ${user}`, async () => {
          await app.signIn.goto(AppNAGA, "login");
          await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || "");
        });
        await test.step("Check previously opened orders and close if they exist", async () => {
          await app.mainPage.openMobileMenu('My Trades');
          await app.myTrades.openActivePendingOrdersTab();
          await app.myTrades.closeMobilePositionsIfExist();
        });
        await test.step(`Choose ${tradingInstrument} and open position`, async () => {
          await app.mainPage.openMobileMenu('Trade');
          await app.instruments.openMobilePosition(tradingInstrument, mobileDirection)
        });
        await test.step(`Open ${investDirection} position + ${protection}`, async () => {
          await app.newPosition.chooseBtn(await app.newPosition.ratePositionBtn(`${investDirection} at Specific Rate`))
          await app.newPosition.installMobileLotsSize(55, 2)
          await app.newPosition.enableProtection(protection)
          NagaProtectionValue = await app.newPosition.getProtectionValue(protection)
          await app.newPosition.submitPosition();
        });
        await test.step("Check My-trades popup", async () => {
          await app.mainPage.openMobileMenu('My Trades');
          await app.myTrades.openActivePendingOrdersTab();
          expect(await app.myTrades.checkStatusOfElement(await app.myTrades.activePendingOrdersTab)).toContain("active");
          expect(Number(await app.myTrades.getMobileProtectionValue(tradeField))).toBeCloseTo(Number(NagaProtectionValue), 0)
        });
        await test.step('Close position and check sucses popup', async()=>{
          await app.myTrades.clickMobilePositionAndOpenTradedetails()
          await app.tradeDetails.closePosition()
          await app.successfullClosePopup.successOkBtnclick()
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
        {brand: '@Capital', user:'testTrading2', investDirection:'Short', protectionSL: 'Stop Loss', protectionTP: 'Take Profit', tradeFieldSL: 'sl', tradeFieldsTP: 'tp', currency:'$', mobileDirection:'SELL'},
        {brand: '@Markets', user:'testTrading2Markets', investDirection:"Short", protectionSL: 'Stop Loss', protectionTP: 'Take Profit', tradeFieldSL: 'sl', tradeFieldsTP: 'tp', currency:'$', mobileDirection:'SELL'},
        {brand: '@Mena', user:'testTrading@naga.com', investDirection:"Short", protectionSL: 'Stop Loss', protectionTP: 'Take Profit', tradeFieldSL: 'sl', tradeFieldsTP: 'tp', currency:'€', mobileDirection:'SELL'},
        {brand: '@Africa', user:'testTradingAfrica2@naga.com', investDirection:"Short", protectionSL: 'Stop Loss', protectionTP: 'Take Profit', tradeFieldSL: 'sl', tradeFieldsTP: 'tp', currency:'$', mobileDirection:'SELL'}
      ]

    for(const{brand, user, protectionSL, protectionTP, currency, mobileDirection} of tradingParametersSLTP){
        test(`${brand} Mobile Edit position popup with ${protectionSL}/${protectionTP}`, 
          {tag:['@trading','@mobile']}, async({app, AppNAGA}, testInfo)=>{
          testInfo.setTimeout(testInfo.timeout + 170000);
          let stopLossValue;
          await test.step(`Login to ${brand} platfotm by ${user}`, async () => {
            await app.signIn.goto(AppNAGA, "login");
            await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || "");
          });
          await test.step("Check previously opened positions. Close it if exist", async () => {
            await app.mainPage.openMobileMenu('My Trades');
            await app.myTrades.closeMobilePositionsIfExist();
          });
          await test.step(`Choose ${tradingInstrument} for trading. Open new position page. Enable ${protectionSL} `, async () => {
            await app.mainPage.openMobileMenu('Trade')
            await app.instruments.openMobilePosition(tradingInstrument, mobileDirection)
            await app.newPosition.switchToSpecificRateForm()
            await app.newPosition.installMobileLotsSize(55, 2)
            await app.newPosition.enableProtection(protectionSL)
            stopLossValue = await app.newPosition.getStopLossValue(protectionSL)
            await app.newPosition.submitPosition(); 
          });
          await test.step("Check My-trades. Open trade details ", async () => {
            await app.mainPage.openMobileMenu('My Trades');
            expect(await app.myTrades.checkStatusOfElement(await app.myTrades.activeTradesTab)).toContain("active");
            deposit = (await app.myTrades.getMobileDepositValue(currency));
            units = await app.myTrades.getMobileUnits();
            await app.myTrades.clickMobilePositionAndOpenTradedetails()
            await app.tradeDetails.openEditLimitsPopup()
          })
          await test.step(`Enable ${protectionTP} on Edit limits popup`, async()=>{
            await app.changeLimitPopup.switchToSpecificRateForm()
            await app.changeLimitPopup.enableStopLoss();
            await app.changeLimitPopup.enableTakeProgit();
            TP = await app.changeLimitPopup.getProtectionValue(protectionTP)
            await app.changeLimitPopup.updatePosition()
          })
          await test.step('Check "Change limiit" popup', async()=>{
            expect(await app.changeLimitSuccessPopup.getProtectionValue(protectionTP)).toContain(TP)
            await app.changeLimitSuccessPopup.acceptPopup()
          })
          await test.step('Check take profit value on trade details popup. And close trade', async()=>{
            expect (await app.tradeDetails.getMobileProtectionValue(protectionTP)).toContain(TP)
            await app.tradeDetails.closePosition()
            await app.successfullClosePopup.successOkBtnclick()
          })
        })
      }

})