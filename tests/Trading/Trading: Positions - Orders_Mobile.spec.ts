import { expect } from "@playwright/test";
import { getLocalization } from "../../pageObjects/localization/getText";
import { test } from "../../test-options"

test.describe('Mobile', async()=>{

  type tradingTypes = {
      brand: string,
      user: string,
      investDirection: string,
      currency: string,
      mobileDirection: string,
      ratePosition: string
    }
  
  const tradingInstrument = "Solana/USD";
  const realStockInstrument = 'Agilent Technologies'
  let investmentValue;
  let units;
  let rate;
  
  const tradingParamsOrders: tradingTypes[] = [
    {brand: '@Capital', user:'testTrading2', investDirection:'Sell', currency:'$', mobileDirection:'SELL', ratePosition:'Short'},
    {brand: '@Capital', user:'testTrading2', investDirection:"Buy", currency:'$', mobileDirection:'BUY', ratePosition:'Long'},
    {brand: '@Markets', user:'testTrading2Markets', investDirection:'Sell', currency:'$', mobileDirection:'SELL', ratePosition:'Short'},
    {brand: '@Markets', user:'testTrading2Markets', investDirection:'Buy',currency:'$', mobileDirection:'BUY', ratePosition:'Long'},
    {brand: '@Mena', user:'testTrading@naga.com', investDirection:'Buy',currency:'€', mobileDirection:'BUY', ratePosition:'Long'},
    {brand: '@Mena', user:'testTrading@naga.com', investDirection:'Sell',currency:'€', mobileDirection:'SELL', ratePosition:'Short'},
    {brand: '@Africa', user:'testTradingAfrica2@naga.com', investDirection:'Buy',currency:'$', mobileDirection:'BUY', ratePosition:'Long'},
    {brand: '@Africa', user:'testTradingAfrica2@naga.com', investDirection:'Sell',currency:'$', mobileDirection:'SELL', ratePosition:'Short'}
    ]
    for(const{brand, user,investDirection,mobileDirection, ratePosition}of tradingParamsOrders){
      test(`${brand} Mobile. Open/Close pending ${investDirection} order`,
          {tag:['@trading', '@mobile'], 
          annotation:{type:'ticket', description:'https://keywaygroup.atlassian.net/browse/RG-6633'}},
          async ({ app,AppNAGA }, testInfo) => {
      testInfo.setTimeout(testInfo.timeout + 170000)
      await test.step(`Login to ${brand} by ${user}`, async () => {
          await app.signIn.goto(AppNAGA, "login");
          await app.signIn.signInUserToPlatform(user,process.env.USER_PASSWORD || "");
      })
      await test.step("Check previously opened positions. Close it if exist", async () => {
          await app.mainPage.openMobileMenu('My Trades');
          await app.myTrades.openActivePendingOrdersTab();
          await app.myTrades.closeMobilePositionsIfExist();
      })
      await test.step(`Choose ${tradingInstrument} for trading. Open new position page`, async () => {
          await app.mainPage.openMobileMenu("Trade");
          await app.instruments.openMobilePosition(tradingInstrument, mobileDirection)
      })
      await test.step('Open order with manual rate value', async()=>{
          await app.newPosition.chooseBtn(await app.newPosition.ratePositionBtn(`${ratePosition} at Specific Rate`))
          await app.newPosition.installMobileLotsSize(55, 2)
          await app.newPosition.submitPosition()
      })
      await test.step('Check my-trades', async()=>{
        await app.mainPage.openMobileMenu('My Trades');
        await app.myTrades.openActivePendingOrdersTab();
        rate = await app.myTrades.getMobileOrderRate()
        })
        await app.myTrades.clickMobilePositionAndOpenTradedetails()
          await test.step('Check trade details', async()=>{
          units = await app.tradeDetails.getMobileLots();
          await app.tradeDetails.closePosition()
        })
      await test.step('Check succesfull closing order popup', async()=>{
        expect(Number(await app.successfullClosePopup.getRate())).toBeCloseTo(Number(rate), 0);
        expect(await app.successfullClosePopup.getLots()).toContain(units)
      })
  })}

  const tradingParamsPositions: tradingTypes[] = [
    {brand: '@Capital', user:'testTrading2', investDirection:'Sell',currency:'$', mobileDirection:'SELL', ratePosition:'Short'},
    {brand: '@Capital', user:'testTrading2', investDirection:"Buy", currency:'$', mobileDirection:'BUY', ratePosition:'Long'},
    {brand: '@Markets', user:'testTrading2Markets', investDirection:'Sell', currency:'$',mobileDirection:'SELL', ratePosition:'Short'},
    {brand: '@Markets', user:'testTrading2Markets', investDirection:'Buy', currency:'$',mobileDirection:'BUY', ratePosition:'Long'},
    {brand: '@Mena', user:'testTrading@naga.com', investDirection:'Sell',currency:'€', mobileDirection: 'SELL', ratePosition:'Short'},
    {brand: '@Mena', user:'testTrading@naga.com', investDirection:'Buy',currency:'€', mobileDirection: 'BUY', ratePosition:'Long'},
    {brand: '@Africa', user:'testTradingAfrica2@naga.com', investDirection:'Sell',currency:'$', mobileDirection:'SELL', ratePosition:'Short'},
    {brand: '@Africa', user:'testTradingAfrica2@naga.com', investDirection:'Buy',currency:'$', mobileDirection:'BUY', ratePosition:'Long'}
  ]
  for(const{brand, user,mobileDirection, currency, investDirection, ratePosition}of tradingParamsPositions){
    test(`${brand} Mobile Open/Close ${investDirection} trading position`,
        {tag:['@trading', '@mobile', '@debug'], 
          annotation:{type:'ticket', description:'https://keywaygroup.atlassian.net/browse/RG-6633'}}, 
        async ({ app, AppNAGA }, testInfo) => {
      testInfo.setTimeout(testInfo.timeout + 170000);
      await test.step(`Login to ${brand} by ${user}`, async () => {
        await app.signIn.goto(AppNAGA, "login");
        await app.signIn.signInUserToPlatform(user,process.env.USER_PASSWORD || "");
      });
      await test.step("Test check's previously opened positions. Test close's, if positions exist", async () => {
        await app.mainPage.openMobileMenu('My Trades');
        await app.myTrades.closeMobilePositionsIfExist();
      });
      await test.step(`Choose ${tradingInstrument} instrument.  Open ${investDirection} type`, async () => {
        await app.mainPage.openMobileMenu('Trade');
        await app.instruments.openMobilePosition(tradingInstrument, mobileDirection)
      });
      await test.step(`Check status of ${mobileDirection} button. And click on Submit btn`, async () => {
        expect(await app.newPosition.getStatusOfBtn(await app.newPosition.investmentDirectionBtn(mobileDirection))).toContain('active')
        expect(await app.newPosition.getStatusOfBtn(await app.newPosition.ratePositionBtn(`${ratePosition} at Current Price`))).toContain('active')
        await app.newPosition.installMobileLotsSize(55, 2)
        await app.newPosition.submitPosition();
      });
      await test.step("Switch to My-Trades page. Save trading parameters - Investments and values. Close position", async () => {
        await app.mainPage.openMobileMenu('My Trades');
        expect(await app.myTrades.checkStatusOfElement(await app.myTrades.activeTradesTab)).toContain("active");
        investmentValue = await app.myTrades.getMobileDepositValue(currency);
        await app.myTrades.clickMobilePositionAndOpenTradedetails()
      });
      await test.step('Check trade details', async()=>{
        units = await app.tradeDetails.getMobileLots();
        await app.tradeDetails.closePosition()
      })
      await test.step('Check successfull closing popup. Assert of trading parameters', async()=>{
        expect(Number(await app.successfullClosePopup.getDeposit(currency))).toBeCloseTo(Number(investmentValue), 0)
        expect(await app.successfullClosePopup.getLots()).toContain(units)
      })
  })}
    
  const tradingParameters: tradingTypes[] = [
    {brand: '@Capital', user:'testTrading2', investDirection:'Sell', mobileDirection:'SELL', currency:'$', ratePosition:'Short'},
    {brand: '@Markets', user:'testTrading2Markets', investDirection:"Sell", mobileDirection:'SELL', currency:'$', ratePosition:'Short'}
  ]
  for(const{brand, user, ratePosition, mobileDirection}of tradingParameters){
    test(` Mobile Open short position of real stock ${brand}`,
      {tag:['@trading', '@mobile']}, async({app, AppNAGA}, testInfo)=>{
      testInfo.setTimeout(testInfo.timeout + 140000);
      let localization = new getLocalization('/pageObjects/localization/NagaCapital_Trading.json')
      await test.step(`Login to ${brand} by ${user}`, async () => {
        await app.signIn.goto(AppNAGA, "login");
        await app.signIn.signInUserToPlatform(user,process.env.USER_PASSWORD || "");
      })
      await test.step("Check previously opened positions. Close it if exist", async () => {
        await app.mainPage.openMobileMenu('My Trades');
        await app.myTrades.closeMobilePositionsIfExist();
      })
      await test.step(`Choose ${realStockInstrument} for trading. Open new position page`, async () => {
        await app.mainPage.openMobileMenu('Trade');
        await app.instruments.openMobileRealStockPosition(realStockInstrument, mobileDirection)
        expect(await app.realStockPopup.getPopupText()).toEqual(await localization.getLocalizationText('RealStock_OpenShortPosition'))
      })
    })
  }
})
