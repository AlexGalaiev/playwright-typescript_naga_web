import { expect } from "@playwright/test";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { SignIn } from "../../pageObjects/SignIn/SignInPage";
import { AllInstruments } from "../../pageObjects/Trading/InstrumentsPage";
import { MyTrades } from "../../pageObjects/Trading/MyTrades";
import { NewPosition } from "../../pageObjects/Trading/OpenNewPositionPage";
import { test } from "../../test-options";
import { ClosePositionSuccessPopup } from "../../pageObjects/Trading/closePositionSuccessPopup";
import { getLocalization } from "../../pageObjects/localization/getText";
import { RealStockPopup } from "../../pageObjects/Trading/realStockShortPosition";
import { TradeDetails } from "../../pageObjects/Trading/TradeDetails";

type tradingTypes = {
  testRailId: string,
  brand: string,
  user: string,
  investDirection: string,
  currency: string,
  mobileDirection: string
}
const tradingInstrument = "Solana/USD";
const realStockInstrument = 'Agilent Technologies'
let investmentValue;
let units;
let rate;

test.describe("Trading - Positions/Orders.", async () => {

  const tradingParamsPositions: tradingTypes[] = [
    {testRailId: '@25159', brand: '@Capital', user:'testTrading2', investDirection:'Short',currency:'$', mobileDirection:'SELL'},
    {testRailId: '@25163', brand: '@Capital', user:'testTrading2', investDirection:"Long", currency:'$', mobileDirection:'BUY'},
    {testRailId: '@23675', brand: '@Markets', user:'testTrading2Markets', investDirection:'Short', currency:'$',mobileDirection:'SELL'},
    {testRailId: '@25164', brand: '@Markets', user:'testTrading2Markets', investDirection:'Long', currency:'$',mobileDirection:'BUY'},
    {testRailId: '@25369', brand: '@Mena', user:'testTrading@naga.com', investDirection:'Short',currency:'€', mobileDirection: 'SELL'},
    {testRailId: '@25368', brand: '@Mena', user:'testTrading@naga.com', investDirection:'Long',currency:'€', mobileDirection: 'BUY'},
    {testRailId: '@25410', brand: '@Africa', user:'testTradingAfrica2@naga.com', investDirection:'Long',currency:'$', mobileDirection:'BUY'},
    {testRailId: '@25409', brand: '@Africa', user:'testTradingAfrica2@naga.com', investDirection:'Short',currency:'$', mobileDirection:'SELL'}
  ]
  for(const{testRailId, brand, user,investDirection, currency}of tradingParamsPositions){
    test(`${testRailId} ${brand} Open/Close ${investDirection} trading position`,
        {tag:['@trading', '@prodSanity', '@web'], 
          annotation:{type:'ticket', description:'https://keywaygroup.atlassian.net/browse/RG-6633'}}, 
        async ({ page }, testInfo) => {
      testInfo.setTimeout(testInfo.timeout + 170000);
      let signIn = new SignIn(page);
      let mainPage = new MainPage(page);
      let myTrades = new MyTrades(page)
      let instruments = new AllInstruments(page);
      let newPosition = new NewPosition(page);
      let successfullClosePopup = new ClosePositionSuccessPopup(page)
      await test.step(`Login to ${brand} by ${user}`, async () => {
        await signIn.goto(await signIn.chooseBrand(brand), "login");
        await signIn.signInUserToPlatform(user,process.env.USER_PASSWORD || "");
      });
      await test.step("Test check's previously opened positions. Test close's, if positions exist", async () => {
        await mainPage.openHeaderMenuPoint("my-trades");
        await myTrades.closePositionsIfExist();
      });
      await test.step(`Choose ${tradingInstrument} instrument.  Open ${investDirection} type`, async () => {
        await mainPage.openHeaderMenuPoint("markets");
        await instruments.openPositionOfInstrument(tradingInstrument, investDirection)
      });
      await test.step(`Check status of ${investDirection} button. And click on Submit btn`, async () => {
        expect(await newPosition.getStatusOfBtn(await newPosition.investmentDirectionBtn(investDirection))).toContain('active')
        expect(await newPosition.getStatusOfBtn(await newPosition.ratePositionBtn(`${investDirection} at Current Price`))).toContain('active')
        await newPosition.submitPosition();
      });
      await test.step("Switch to My-Trades page. Save trading parameters - Investments and values. Close position", async () => {
        await mainPage.openHeaderMenuPoint("my-trades");
        expect(await myTrades.checkStatusOfElement(await myTrades.activeTradesTab)).toContain("active");
        investmentValue = await myTrades.getDepositValue(currency);
        units = await myTrades.getUnits();
        await myTrades.closePosition()
      });
      await test.step('Check successfull closing popup. Assert of trading parameters', async()=>{
        expect(Number(await successfullClosePopup.getDeposit(currency))).toBeCloseTo(Number(investmentValue))
        expect(await successfullClosePopup.getLots()).toContain(units)
      })
    });
  }

  for(const{testRailId, brand, user,mobileDirection, currency, investDirection}of tradingParamsPositions){
    test(`${testRailId} ${brand} Mobile Open/Close ${investDirection} trading position`,
        {tag:['@trading', '@mobile'], 
          annotation:{type:'ticket', description:'https://keywaygroup.atlassian.net/browse/RG-6633'}}, 
        async ({ page }, testInfo) => {
      testInfo.setTimeout(testInfo.timeout + 170000);
      let signIn = new SignIn(page);
      let mainPage = new MainPage(page);
      let myTrades = new MyTrades(page)
      let instruments = new AllInstruments(page);
      let newPosition = new NewPosition(page);
      let successfullClosePopup = new ClosePositionSuccessPopup(page)
      let tradeDetails = new TradeDetails(page)
      await test.step(`Login to ${brand} by ${user}`, async () => {
        await signIn.goto(await signIn.chooseBrand(brand), "login");
        await signIn.signInUserToPlatform(user,process.env.USER_PASSWORD || "");
      });
      await test.step("Test check's previously opened positions. Test close's, if positions exist", async () => {
        await mainPage.openMobileMenuPoint("my-trades");
        await myTrades.closeMobilePositionsIfExist();
      });
      await test.step(`Choose ${tradingInstrument} instrument.  Open ${investDirection} type`, async () => {
        await mainPage.openMobileMenuPoint("markets");
        await instruments.openMobilePosition(tradingInstrument, mobileDirection)
      });
      await test.step(`Check status of ${mobileDirection} button. And click on Submit btn`, async () => {
        expect(await newPosition.getStatusOfBtn(await newPosition.investmentDirectionBtn(investDirection))).toContain('active')
        expect(await newPosition.getStatusOfBtn(await newPosition.ratePositionBtn(`${investDirection} at Current Price`))).toContain('active')
        await newPosition.submitPosition();
      });
      await test.step("Switch to My-Trades page. Save trading parameters - Investments and values. Close position", async () => {
        await mainPage.openMobileMenuPoint("my-trades");
        expect(await myTrades.checkStatusOfElement(await myTrades.activeTradesTab)).toContain("active");
        investmentValue = await myTrades.getMobileDepositValue(currency);
        await myTrades.clickMobilePositionAndOpenTradedetails()
      });
      await test.step('Check trade details', async()=>{
        units = await tradeDetails.getMobileLots();
        await tradeDetails.closePosition()
      })
      await test.step('Check successfull closing popup. Assert of trading parameters', async()=>{
        expect(Number(await successfullClosePopup.getDeposit(currency))).toBeCloseTo(Number(investmentValue))
        expect(await successfullClosePopup.getLots()).toContain(units)
      })
    });
  }
})

test.describe('Trading - Pending orders', async()=>{
  
  const tradingParamsOrders: tradingTypes[] = [
    {testRailId: '@25161', brand: '@Capital', user:'testTrading2', investDirection:'Short', currency:'$', mobileDirection:'SELL'},
    {testRailId: '@25162', brand: '@Capital', user:'testTrading2', investDirection:"Long", currency:'$', mobileDirection:'BUY'},
    {testRailId: '@25016', brand: '@Markets', user:'testTrading2Markets', investDirection:'Short', currency:'$', mobileDirection:'SELL'},
    {testRailId: '@25015', brand: '@Markets', user:'testTrading2Markets', investDirection:'Long',currency:'$', mobileDirection:'BUY'},
    {testRailId: '@25371', brand: '@Mena', user:'testTrading@naga.com', investDirection:'Long',currency:'€', mobileDirection:'BUY'},
    {testRailId: '@25372', brand: '@Mena', user:'testTrading@naga.com', investDirection:'Short',currency:'€', mobileDirection:'SELL'},
    {testRailId: '@25411', brand: '@Africa', user:'testTradingAfrica2@naga.com', investDirection:'Long',currency:'$', mobileDirection:'BUY'},
    {testRailId: '@25412', brand: '@Africa', user:'testTradingAfrica2@naga.com', investDirection:'Short',currency:'$', mobileDirection:'SELL'}
  ]
  for(const{testRailId, brand, user,investDirection, mobileDirection}of tradingParamsOrders){
    test(`${testRailId} ${brand} Open/Close pending ${investDirection} order`,
          {tag:['@trading', '@web'], 
          annotation:{type:'ticket', description:'https://keywaygroup.atlassian.net/browse/RG-6633'}},
          async ({ page }, testInfo) => {
      testInfo.setTimeout(testInfo.timeout + 170000);
      let signIn = new SignIn(page);
      let mainPage = new MainPage(page);
      let myTrades = new MyTrades(page)
      let instruments = new AllInstruments(page);
      let newPosition = new NewPosition(page);
      let successfullClosePopup = new ClosePositionSuccessPopup(page)
      await test.step(`Login to ${brand} by ${user}`, async () => {
        await signIn.goto(await signIn.chooseBrand(brand), "login");
        await signIn.signInUserToPlatform(user,process.env.USER_PASSWORD || "");
      });
      await test.step("Check previously opened positions. Close it if exist", async () => {
        await mainPage.openHeaderMenuPoint("my-trades");
        await myTrades.openActivePendingOrdersTab();
        await myTrades.removeOrdersIfExist();
      });
      await test.step(`Choose ${tradingInstrument} for trading. Open new position page`, async () => {
        await mainPage.openHeaderMenuPoint("markets");
        await instruments.openPositionOfInstrument(tradingInstrument, investDirection)
      });
      await test.step('Open order with manual rate value', async()=>{
        await newPosition.chooseBtn(await newPosition.ratePositionBtn(`${investDirection} at Specific Rate`))
        await newPosition.installLotsSiveViaPlusBtn()
        await newPosition.submitPosition()
      })
      await test.step('Check my-trades', async()=>{
        await mainPage.openHeaderMenuPoint("my-trades");
        await myTrades.openActivePendingOrdersTab();
        units = await myTrades.getOrderUnits()
        rate = await myTrades.getOrdersRate()
        await myTrades.deleteOrder()
      })
      await test.step('Check succesfull closing order popup', async()=>{
        expect(Number(await successfullClosePopup.getRate())).toBeCloseTo(Number(rate), 3);
        expect(await successfullClosePopup.getLots()).toContain(units)
      })
  })}

  for(const{testRailId, brand, user,investDirection,mobileDirection}of tradingParamsOrders){
    test(`${testRailId} ${brand} Mobile. Open/Close pending ${investDirection} order`,
          {tag:['@trading', '@mobile'], 
          annotation:{type:'ticket', description:'https://keywaygroup.atlassian.net/browse/RG-6633'}},
          async ({ page }, testInfo) => {
      testInfo.setTimeout(testInfo.timeout + 170000);
      let signIn = new SignIn(page);
      let mainPage = new MainPage(page);
      let myTrades = new MyTrades(page)
      let instruments = new AllInstruments(page);
      let newPosition = new NewPosition(page);
      let successfullClosePopup = new ClosePositionSuccessPopup(page)
      let tradeDetails = new TradeDetails(page)
      await test.step(`Login to ${brand} by ${user}`, async () => {
        await signIn.goto(await signIn.chooseBrand(brand), "login");
        await signIn.signInUserToPlatform(user,process.env.USER_PASSWORD || "");
      });
      await test.step("Check previously opened positions. Close it if exist", async () => {
        await mainPage.openMobileMenuPoint("my-trades");
        await myTrades.openActivePendingOrdersTab();
        await myTrades.closeMobilePositionsIfExist();
      });
      await test.step(`Choose ${tradingInstrument} for trading. Open new position page`, async () => {
        await mainPage.openHeaderMenuPoint("markets");
        await instruments.openMobilePosition(tradingInstrument, mobileDirection)
      });
      await test.step('Open order with manual rate value', async()=>{
        await newPosition.chooseBtn(await newPosition.ratePositionBtn(`${investDirection} at Specific Rate`))
        await newPosition.installLotsSiveViaPlusBtn()
        await newPosition.submitPosition()
      })
      await test.step('Check my-trades', async()=>{
        await mainPage.openMobileMenuPoint("my-trades");
        await myTrades.openActivePendingOrdersTab();
        rate = await myTrades.getMobileOrderRate()
        await myTrades.clickMobilePositionAndOpenTradedetails()
      })
      await test.step('Check trade details', async()=>{
        units = await tradeDetails.getMobileLots();
        await tradeDetails.closePosition()
      })
      await test.step('Check succesfull closing order popup', async()=>{
        expect(Number(await successfullClosePopup.getRate())).toBeCloseTo(Number(rate), 3);
        expect(await successfullClosePopup.getLots()).toContain(units)
      })
  })}

  const tradingParameters: tradingTypes[] = [
    {testRailId: '@25175', brand: '@Capital', user:'testTrading2', investDirection:'Short', mobileDirection:'SELL', currency:'$'},
    {testRailId: '@25174', brand: '@Markets', user:'testTrading2Markets', investDirection:"Short", mobileDirection:'SELL', currency:'$'}
  ]
  for(const{testRailId, brand, user, investDirection}of tradingParameters){
    test(`${testRailId} Open short position of real stock ${brand}`,
      {tag:['@trading', '@web']}, async({page}, testInfo)=>{
      testInfo.setTimeout(testInfo.timeout + 140000);
      let signIn = new SignIn(page);
      let mainPage = new MainPage(page);
      let myTrades = new MyTrades(page);
      let instruments = new AllInstruments(page);
      let realStockPopup = new RealStockPopup(page)
      let localization = new getLocalization('/pageObjects/localization/NagaCapital_Trading.json')
      await test.step(`Login to ${brand} by ${user}`, async () => {
        await signIn.goto(await signIn.chooseBrand(brand), "login");
        await signIn.signInUserToPlatform(user,process.env.USER_PASSWORD || "");
      });
      await test.step("Check previously opened positions. Close it if exist", async () => {
        await mainPage.openHeaderMenuPoint("my-trades");
        await myTrades.closePositionsIfExist();
      });
      await test.step(`Choose ${realStockInstrument} for trading. Open new position page`, async () => {
        await mainPage.openHeaderMenuPoint("markets");
        await instruments.openPositionOfInstrument(realStockInstrument, investDirection)
        expect(await realStockPopup.getPopupText()).toEqual(await localization.getLocalizationText('RealStock_OpenShortPosition'))
      });
    })
  }

  for(const{testRailId, brand, user, investDirection, mobileDirection}of tradingParameters){
    test(`${testRailId} Mobile Open short position of real stock ${brand}`,
      {tag:['@trading', '@mobile']}, async({page}, testInfo)=>{
      testInfo.setTimeout(testInfo.timeout + 140000);
      let signIn = new SignIn(page);
      let mainPage = new MainPage(page);
      let myTrades = new MyTrades(page);
      let instruments = new AllInstruments(page);
      let realStockPopup = new RealStockPopup(page)
      let localization = new getLocalization('/pageObjects/localization/NagaCapital_Trading.json')
      await test.step(`Login to ${brand} by ${user}`, async () => {
        await signIn.goto(await signIn.chooseBrand(brand), "login");
        await signIn.signInUserToPlatform(user,process.env.USER_PASSWORD || "");
      });
      await test.step("Check previously opened positions. Close it if exist", async () => {
        await mainPage.openMobileMenuPoint("my-trades");
        await myTrades.closeMobilePositionsIfExist();
      });
      await test.step(`Choose ${realStockInstrument} for trading. Open new position page`, async () => {
        await mainPage.openMobileMenuPoint("markets");
        await instruments.openMobilePosition(realStockInstrument, mobileDirection)
        expect(await realStockPopup.getPopupText()).toEqual(await localization.getLocalizationText('RealStock_OpenShortPosition'))
      });
    })
  }
  
})



