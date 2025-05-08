import { expect } from "@playwright/test";
import { getLocalization } from "../../pageObjects/localization/getText";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { SignIn } from "../../pageObjects/SignIn/SignInPage";
import { ClosePositionSuccessPopup } from "../../pageObjects/Trading/closePositionSuccessPopup";
import { AllInstruments } from "../../pageObjects/Trading/InstrumentsPage";
import { MyTrades } from "../../pageObjects/Trading/MyTrades";
import { NewPosition } from "../../pageObjects/Trading/OpenNewPositionPage";
import { TradeDetails } from "../../pageObjects/Trading/TradeDetails";
import { test } from "../../test-options"
import { RealStockPopup } from "../../pageObjects/Trading/realStockShortPosition";



test.describe('Mobile', async()=>{

  type tradingTypes = {
      testRailId: string,
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
    {testRailId: '@25161', brand: '@Capital', user:'testTrading2', investDirection:'Sell', currency:'$', mobileDirection:'SELL', ratePosition:'Short'},
    {testRailId: '@25162', brand: '@Capital', user:'testTrading2', investDirection:"Buy", currency:'$', mobileDirection:'BUY', ratePosition:'Long'},
    {testRailId: '@25016', brand: '@Markets', user:'testTrading2Markets', investDirection:'Sell', currency:'$', mobileDirection:'SELL', ratePosition:'Short'},
    {testRailId: '@25015', brand: '@Markets', user:'testTrading2Markets', investDirection:'Buy',currency:'$', mobileDirection:'BUY', ratePosition:'Long'},
    {testRailId: '@25371', brand: '@Mena', user:'testTrading@naga.com', investDirection:'Buy',currency:'€', mobileDirection:'BUY', ratePosition:'Long'},
    {testRailId: '@25372', brand: '@Mena', user:'testTrading@naga.com', investDirection:'Sell',currency:'€', mobileDirection:'SELL', ratePosition:'Short'},
    {testRailId: '@25411', brand: '@Africa', user:'testTradingAfrica2@naga.com', investDirection:'Buy',currency:'$', mobileDirection:'BUY', ratePosition:'Long'},
    {testRailId: '@25412', brand: '@Africa', user:'testTradingAfrica2@naga.com', investDirection:'Sell',currency:'$', mobileDirection:'SELL', ratePosition:'Short'}
    ]
    for(const{testRailId, brand, user,investDirection,mobileDirection, ratePosition}of tradingParamsOrders){
      test(`${testRailId} ${brand} Mobile. Open/Close pending ${investDirection} order`,
          {tag:['@trading', '@mobile'], 
          annotation:{type:'ticket', description:'https://keywaygroup.atlassian.net/browse/RG-6633'}},
          async ({ page,AppNAGA }, testInfo) => {
      testInfo.setTimeout(testInfo.timeout + 170000);
      let signIn = new SignIn(page);
      let mainPage = new MainPage(page);
      let myTrades = new MyTrades(page)
      let instruments = new AllInstruments(page);
      let newPosition = new NewPosition(page);
      let successfullClosePopup = new ClosePositionSuccessPopup(page)
      let tradeDetails = new TradeDetails(page)
      await test.step(`Login to ${brand} by ${user}`, async () => {
          await signIn.goto(AppNAGA, "login");
          await signIn.signInUserToPlatform(user,process.env.USER_PASSWORD || "");
      })
      await test.step("Check previously opened positions. Close it if exist", async () => {
          await mainPage.openMobileMenu('My Trades');
          await myTrades.openActivePendingOrdersTab();
          await myTrades.closeMobilePositionsIfExist();
      })
      await test.step(`Choose ${tradingInstrument} for trading. Open new position page`, async () => {
          await mainPage.openMobileMenu("Trade");
          await instruments.openMobilePosition(tradingInstrument, mobileDirection)
      })
      await test.step('Open order with manual rate value', async()=>{
          await newPosition.chooseBtn(await newPosition.ratePositionBtn(`${ratePosition} at Specific Rate`))
          await newPosition.installMobileLotsSize(55, 2)
          await newPosition.submitPosition()
      })
      await test.step('Check my-trades', async()=>{
        await mainPage.openMobileMenu('My Trades');
          await myTrades.openActivePendingOrdersTab();
          rate = await myTrades.getMobileOrderRate()
      })
      await myTrades.clickMobilePositionAndOpenTradedetails()
          await test.step('Check trade details', async()=>{
          units = await tradeDetails.getMobileLots();
          await tradeDetails.closePosition()
      })
      await test.step('Check succesfull closing order popup', async()=>{
        expect(Number(await successfullClosePopup.getRate())).toBeCloseTo(Number(rate), 0);
        expect(await successfullClosePopup.getLots()).toContain(units)
      })
  })}

  const tradingParamsPositions: tradingTypes[] = [
    {testRailId: '@25159', brand: '@Capital', user:'testTrading2', investDirection:'Sell',currency:'$', mobileDirection:'SELL', ratePosition:'Short'},
    {testRailId: '@25163', brand: '@Capital', user:'testTrading2', investDirection:"Buy", currency:'$', mobileDirection:'BUY', ratePosition:'Long'},
    {testRailId: '@23675', brand: '@Markets', user:'testTrading2Markets', investDirection:'Sell', currency:'$',mobileDirection:'SELL', ratePosition:'Short'},
    {testRailId: '@25164', brand: '@Markets', user:'testTrading2Markets', investDirection:'Buy', currency:'$',mobileDirection:'BUY', ratePosition:'Long'},
    {testRailId: '@25369', brand: '@Mena', user:'testTrading@naga.com', investDirection:'Sell',currency:'€', mobileDirection: 'SELL', ratePosition:'Short'},
    {testRailId: '@25368', brand: '@Mena', user:'testTrading@naga.com', investDirection:'Buy',currency:'€', mobileDirection: 'BUY', ratePosition:'Long'},
    {testRailId: '@25410', brand: '@Africa', user:'testTradingAfrica2@naga.com', investDirection:'Sell',currency:'$', mobileDirection:'SELL', ratePosition:'Short'},
    {testRailId: '@25409', brand: '@Africa', user:'testTradingAfrica2@naga.com', investDirection:'Buy',currency:'$', mobileDirection:'BUY', ratePosition:'Long'}
  ]
  for(const{testRailId, brand, user,mobileDirection, currency, investDirection, ratePosition}of tradingParamsPositions){
    test(`${testRailId} ${brand} Mobile Open/Close ${investDirection} trading position`,
        {tag:['@trading', '@mobile', '@debug'], 
          annotation:{type:'ticket', description:'https://keywaygroup.atlassian.net/browse/RG-6633'}}, 
        async ({ page, AppNAGA }, testInfo) => {
      testInfo.setTimeout(testInfo.timeout + 170000);
      let signIn = new SignIn(page);
      let mainPage = new MainPage(page);
      let myTrades = new MyTrades(page)
      let instruments = new AllInstruments(page);
      let newPosition = new NewPosition(page);
      let successfullClosePopup = new ClosePositionSuccessPopup(page)
      let tradeDetails = new TradeDetails(page)
      await test.step(`Login to ${brand} by ${user}`, async () => {
        await signIn.goto(AppNAGA, "login");
        await signIn.signInUserToPlatform(user,process.env.USER_PASSWORD || "");
      });
      await test.step("Test check's previously opened positions. Test close's, if positions exist", async () => {
        await mainPage.openMobileMenu('My Trades');
        await myTrades.closeMobilePositionsIfExist();
      });
      await test.step(`Choose ${tradingInstrument} instrument.  Open ${investDirection} type`, async () => {
        await mainPage.openMobileMenu('Trade');
        await instruments.openMobilePosition(tradingInstrument, mobileDirection)
      });
      await test.step(`Check status of ${mobileDirection} button. And click on Submit btn`, async () => {
        expect(await newPosition.getStatusOfBtn(await newPosition.investmentDirectionBtn(mobileDirection))).toContain('active')
        expect(await newPosition.getStatusOfBtn(await newPosition.ratePositionBtn(`${ratePosition} at Current Price`))).toContain('active')
        await newPosition.installMobileLotsSize(55, 2)
        await newPosition.submitPosition();
      });
      await test.step("Switch to My-Trades page. Save trading parameters - Investments and values. Close position", async () => {
        await mainPage.openMobileMenu('My Trades');
        expect(await myTrades.checkStatusOfElement(await myTrades.activeTradesTab)).toContain("active");
        investmentValue = await myTrades.getMobileDepositValue(currency);
        await myTrades.clickMobilePositionAndOpenTradedetails()
      });
      await test.step('Check trade details', async()=>{
        units = await tradeDetails.getMobileLots();
        await tradeDetails.closePosition()
      })
      await test.step('Check successfull closing popup. Assert of trading parameters', async()=>{
        expect(Number(await successfullClosePopup.getDeposit(currency))).toBeCloseTo(Number(investmentValue), 0)
        expect(await successfullClosePopup.getLots()).toContain(units)
      })
  })}
    
  const tradingParameters: tradingTypes[] = [
    {testRailId: '@25175', brand: '@Capital', user:'testTrading2', investDirection:'Sell', mobileDirection:'SELL', currency:'$', ratePosition:'Short'},
    {testRailId: '@25174', brand: '@Markets', user:'testTrading2Markets', investDirection:"Sell", mobileDirection:'SELL', currency:'$', ratePosition:'Short'}
  ]
  for(const{testRailId, brand, user, ratePosition, mobileDirection}of tradingParameters){
    test(`${testRailId} Mobile Open short position of real stock ${brand}`,
      {tag:['@trading', '@mobile']}, async({page, AppNAGA}, testInfo)=>{
      testInfo.setTimeout(testInfo.timeout + 140000);
      let signIn = new SignIn(page);
      let mainPage = new MainPage(page);
      let myTrades = new MyTrades(page);
      let instruments = new AllInstruments(page);
      let realStockPopup = new RealStockPopup(page)
      let localization = new getLocalization('/pageObjects/localization/NagaCapital_Trading.json')
      await test.step(`Login to ${brand} by ${user}`, async () => {
        await signIn.goto(AppNAGA, "login");
        await signIn.signInUserToPlatform(user,process.env.USER_PASSWORD || "");
      })
      await test.step("Check previously opened positions. Close it if exist", async () => {
        await mainPage.openMobileMenu('My Trades');
        await myTrades.closeMobilePositionsIfExist();
      })
      await test.step(`Choose ${realStockInstrument} for trading. Open new position page`, async () => {
        await mainPage.openMobileMenu('Trade');
        await instruments.openMobileRealStockPosition(realStockInstrument, mobileDirection)
        expect(await realStockPopup.getPopupText()).toEqual(await localization.getLocalizationText('RealStock_OpenShortPosition'))
      })
    })
  }
})
