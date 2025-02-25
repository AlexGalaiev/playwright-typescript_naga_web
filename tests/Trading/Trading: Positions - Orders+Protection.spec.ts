import { expect } from "@playwright/test";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { SignIn } from "../../pageObjects/SignIn/SignInPage";
import { ChangeLimitSuccessPopup } from "../../pageObjects/Trading/ChangeLimitResultPopup";
import { ChangeLimitsPopup } from "../../pageObjects/Trading/ChangeLimitsPopup";
import { ClosePositionSuccessPopup } from "../../pageObjects/Trading/closePositionSuccessPopup";
import { AllInstruments } from "../../pageObjects/Trading/InstrumentsPage";
import { MyTrades } from "../../pageObjects/Trading/MyTrades";
import { NewPosition } from "../../pageObjects/Trading/OpenNewPositionPage";
import { TradeDetails } from "../../pageObjects/Trading/TradeDetails";
import { test } from "../../test-options";

test.describe("Trading. Trading by positions/orders + protection. WEB/Mobile", async () => {
type tradingTypesWithProtection = {
  testRailId: string,
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
  {testRailId: '@25165', brand: '@Capital', user:'testTrading2', investDirection:'Short', protection: 'Stop Loss',tradeField: 'sl', mobileDirection:'SELL'},
  {testRailId: '@25160', brand: '@Capital', user:'testTrading2', investDirection:"Long", protection: 'Take Profit',tradeField: 'tp', mobileDirection:'BUY'},
  {testRailId: '@25166', brand: '@Markets', user:'testTrading2Markets', investDirection:'Short', protection: 'Stop Loss', tradeField:'sl', mobileDirection:'SELL'},
  {testRailId: '@25017', brand: '@Markets', user:'testTrading2Markets', investDirection:'Long', protection: 'Take Profit', tradeField:'tp', mobileDirection:'BUY'},
  {testRailId: '@25374', brand: '@Mena', user:'testTrading@naga.com', investDirection:'Long', protection: 'Take Profit', tradeField:'tp', mobileDirection:'BUY'},
  {testRailId: '@25375', brand: '@Mena', user:'testTrading@naga.com', investDirection:'Short', protection: 'Stop Loss', tradeField:'sl',mobileDirection:'SELL'},
  {testRailId: '@25413', brand: '@Africa', user:'testTradingAfrica2@naga.com', investDirection:'Long', protection: 'Take Profit', tradeField:'tp', mobileDirection:'BUY'},
  {testRailId: '@25414', brand: '@Africa', user:'testTradingAfrica2@naga.com', investDirection:'Short', protection: 'Stop Loss', tradeField:'sl',mobileDirection:'SELL'},
]
for(const{testRailId, brand, user, investDirection, protection,tradeField,mobileDirection} of tradingParametersPositionsSL){
  test(`${testRailId} ${brand} Mobile Open/Close ${investDirection} position + ${protection}`, 
    {tag:['@trading','@mobile']}, async ({ page}, testInfo) => {
    testInfo.setTimeout(testInfo.timeout + 170000);
    let signIn = new SignIn(page);
    let mainPage = new MainPage(page);
    let myTrades = new MyTrades(page);
    let instruments = new AllInstruments(page);
    let newPosition = new NewPosition(page);
    let successPopup = new ClosePositionSuccessPopup(page);
    let tradeDetails = new TradeDetails(page)
    await test.step(`Login to platfotm ${brand} by ${user}`, async () => {
      await signIn.goto(await signIn.chooseBrand(brand), "login");
      await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || "");
    });
    await test.step("Check previously opened positions and close if they exist", async () => {
      await mainPage.openMobileMenuPoint("my-trades");
      await myTrades.closeMobilePositionsIfExist();
    });
    await test.step(`Choose ${tradingInstrument} and open position`, async () => {
      await mainPage.openMobileMenuPoint("markets");
      await instruments.openMobilePosition(tradingInstrument, mobileDirection)
    });
    await test.step(`Open ${investDirection} position + ${protection}`, async () => {
      await newPosition.enableProtection(protection)
      NagaProtectionValue = await newPosition.getProtectionValue(protection)
      await newPosition.submitPosition();
    });
    await test.step("Check My-trades popup", async () => {
      await mainPage.openMobileMenuPoint("my-trades");
      expect(await myTrades.checkStatusOfElement(await myTrades.activeTradesTab)).toContain("active");
      await myTrades.closeMobileAndOpenTradedetails()
      let protectionValue = await tradeDetails.getMobileProtectionValue(protection);
      expect(Number(protectionValue)).toBeCloseTo(Number(NagaProtectionValue))
      await tradeDetails.closePosition()
    });
    await test.step('Close position and check sucses popup', async()=>{
      await successPopup.successOkBtnclick()
    })
  })}

for(const{testRailId, brand, user, investDirection, protection,tradeField} of tradingParametersPositionsSL){
  test(`${testRailId} ${brand} Open/Close ${investDirection} position + ${protection}`, 
    {tag:['@trading','@web', '@prodSanity','@debug']}, async ({ page}, testInfo) => {
    testInfo.setTimeout(testInfo.timeout + 170000);
    let signIn = new SignIn(page);
    let mainPage = new MainPage(page);
    let myTrades = new MyTrades(page);
    let instruments = new AllInstruments(page);
    let newPosition = new NewPosition(page);
    let successPopup = new ClosePositionSuccessPopup(page);
    await test.step(`Login to platfotm ${brand} by ${user}`, async () => {
      await signIn.goto(await signIn.chooseBrand(brand), "login");
      await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || "");
    });
    await test.step("Check previously opened positions and close if they exist", async () => {
      await mainPage.openHeaderMenuPoint("my-trades");
      await myTrades.closePositionsIfExist();
    });
    await test.step(`Choose ${tradingInstrument} and open position`, async () => {
      await mainPage.openHeaderMenuPoint("markets");
      await instruments.openPositionOfInstrument(tradingInstrument, investDirection)
    });
    await test.step(`Open ${investDirection} position + ${protection}`, async () => {
      await newPosition.enableProtection(protection)
      NagaProtectionValue = await newPosition.getProtectionValue(protection)
      await newPosition.submitPosition();
    });
    await test.step("Check My-trades popup", async () => {
      await mainPage.openHeaderMenuPoint("my-trades");
      expect(await myTrades.checkStatusOfElement(await myTrades.activeTradesTab)).toContain("active");
      expect(Number(await myTrades.getProtectionValue(tradeField))).toBeCloseTo(Number(NagaProtectionValue))
    });
    await test.step('Close position and check sucses popup', async()=>{
      await myTrades.closePosition()
      await successPopup.acceptPopup()
    })
  })}

  const tradingParametersOrders: tradingTypesWithProtection[] = [
    {testRailId: '@25167', brand: '@Capital', user:'testTrading2', investDirection:'Short', protection: 'Stop Loss',tradeField: 'sl'},
    {testRailId: '@25169', brand: '@Capital', user:'testTrading2', investDirection:"Long", protection: 'Take profit',tradeField: 'tp'},
    {testRailId: '@25171', brand: '@Markets', user:'testTrading2Markets', investDirection:'Short', protection: 'Stop Loss', tradeField:'sl'},
    {testRailId: '@25170', brand: '@Markets', user:'testTrading2Markets', investDirection:'Long', protection: 'Take profit', tradeField:'tp'},
    {testRailId: '@25376', brand: '@Mena', user:'testTrading@naga.com', investDirection:'Long', protection: 'Take profit', tradeField:'tp'},
    {testRailId: '@25377', brand: '@Mena', user:'testTrading@naga.com', investDirection:'Short', protection: 'Stop Loss', tradeField:'sl'},
    {testRailId: '@25415', brand: '@Africa', user:'testTradingAfrica2@naga.com', investDirection:'Long', protection: 'Take profit', tradeField:'tp'},
    {testRailId: '@25416', brand: '@Africa', user:'testTradingAfrica2@naga.com', investDirection:'Short', protection: 'Stop Loss', tradeField:'sl'}
  ]
  for(const{testRailId, brand, user, investDirection, protection, tradeField}of tradingParametersOrders){
    test(`${testRailId} ${brand} Open/Close pending ${investDirection} position + ${protection}`, {tag:['@trading']}, async({page}, testInfo)=>{
      testInfo.setTimeout(testInfo.timeout + 170000);
      let signIn = new SignIn(page);
      let mainPage = new MainPage(page);
      let myTrades = new MyTrades(page);
      let instruments = new AllInstruments(page);
      let newPosition = new NewPosition(page);
      let successPopup = new ClosePositionSuccessPopup(page);
      await test.step(`Login to ${brand} platfotm by ${user}`, async () => {
        await signIn.goto(await signIn.chooseBrand(brand), "login");
        await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || "");
      });
      await test.step("Check previously opened orders and close if they exist", async () => {
        await mainPage.openHeaderMenuPoint("my-trades");
        await myTrades.openActivePendingOrdersTab();
        await myTrades.removeOrdersIfExist();
      });
      await test.step(`Choose ${tradingInstrument} and open position`, async () => {
        await mainPage.openHeaderMenuPoint("markets");
        await instruments.openPositionOfInstrument(tradingInstrument, investDirection)
      });
      await test.step(`Open ${investDirection} position + ${protection}`, async () => {
        await newPosition.chooseBtn(await newPosition.ratePositionBtn(`${investDirection} at Specific Rate`))
        await newPosition.enableProtection(protection)
        NagaProtectionValue = await newPosition.getProtectionValue(protection)
        await newPosition.submitPosition();
      });
      await test.step("Check My-trades popup", async () => {
        await mainPage.openHeaderMenuPoint("my-trades");
        await myTrades.openActivePendingOrdersTab();
        expect(await myTrades.checkStatusOfElement(await myTrades.activePendingOrdersTab)).toContain("active");
        expect(Number(await myTrades.getProtectionValue(tradeField))).toBeCloseTo(Number(NagaProtectionValue), 2)
      });
      await test.step('Close position and check sucses popup', async()=>{
        await myTrades.closePosition()
        await successPopup.acceptPopup()
      })
      })
  }

type changeLimittypes = {
  testRailId: string,
  brand: string, 
  user: string,
  investDirection: string,
  protectionSL: string,
  protectionTP: string,
  tradeFieldSL: string,
  tradeFieldsTP: string,
  currency: string
}

const tradingParametersSLTP: changeLimittypes[] = [
  {testRailId: '@25173', brand: '@Capital', user:'testTrading2', investDirection:'Short', protectionSL: 'Stop Loss', protectionTP: 'Take Profit', tradeFieldSL: 'sl', tradeFieldsTP: 'tp', currency:'$'},
  {testRailId: '@25172', brand: '@Markets', user:'testTrading2Markets', investDirection:"Short", protectionSL: 'Stop Loss', protectionTP: 'Take Profit', tradeFieldSL: 'sl', tradeFieldsTP: 'tp', currency:'$'},
  {testRailId: '@25378', brand: '@Mena', user:'testTrading@naga.com', investDirection:"Short", protectionSL: 'Stop Loss', protectionTP: 'Take Profit', tradeFieldSL: 'sl', tradeFieldsTP: 'tp', currency:'€'},
  {testRailId: '@25417', brand: '@Africa', user:'testTradingAfrica2@naga.com', investDirection:"Short", protectionSL: 'Stop Loss', protectionTP: 'Take Profit', tradeFieldSL: 'sl', tradeFieldsTP: 'tp', currency:'$'}
]
for(const{testRailId, brand, user, investDirection, protectionSL, protectionTP, tradeFieldSL, tradeFieldsTP, currency} of tradingParametersSLTP){
  test(`${testRailId} ${brand} Edit position popup with ${protectionSL}/${protectionTP}`, 
    {tag:['@trading'], annotation:{description:'https://keywaygroup.atlassian.net/browse/RG-7506', type:'ticket'}}, async({page}, testInfo)=>{
    testInfo.setTimeout(testInfo.timeout + 170000);
    let signIn = new SignIn(page);
    let mainPage = new MainPage(page);
    let myTrades = new MyTrades(page)
    let instruments = new AllInstruments(page);
    let newPosition = new NewPosition(page);
    let changeLimits = new ChangeLimitsPopup(page);
    let changeLimitsSuccessPopup = new ChangeLimitSuccessPopup(page)
    let successfullClosePopup = new ClosePositionSuccessPopup(page)
    let stopLossValue;
    await test.step(`Login to ${brand} platfotm by ${user}`, async () => {
      await signIn.goto(await signIn.chooseBrand(brand), "login");
      await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || "");
    });
    await test.step("Check previously opened positions. Close it if exist", async () => {
      await mainPage.openHeaderMenuPoint("my-trades");
      await myTrades.closePositionsIfExist();
    });
    await test.step(`Choose ${tradingInstrument} for trading. Open new position page. Enable ${protectionSL} `, async () => {
      await mainPage.openHeaderMenuPoint("markets");
      await instruments.openPositionOfInstrument(tradingInstrument, investDirection)
      await newPosition.switchToSpecificRateForm()
      await newPosition.enableProtection(protectionSL)
      stopLossValue = await newPosition.getStopLossValue(protectionSL)
      await newPosition.submitPosition(); 
    });
    await test.step("Check My-trades", async () => {
      await mainPage.openHeaderMenuPoint("my-trades");
      expect(await myTrades.checkStatusOfElement(await myTrades.activeTradesTab)).toContain("active");
      deposit = (await myTrades.getDepositValue(currency));
      units = await myTrades.getUnits();
      //SL = await myTrades.getStopLossValue()
      expect(await myTrades.getStopLossValue()).toContain(stopLossValue)
      await myTrades.openChangeLimitPopup()
    })
    await test.step(`Enable ${protectionTP} and check result`, async()=>{
      //await myTrades.openChangeLimitPopup();
      await changeLimits.switchToSpecificRateForm()
      await changeLimits.enableStopLoss();
      await changeLimits.enableTakeProgit();
      TP = await changeLimits.getProtectionValue(protectionTP)
      await changeLimits.updatePosition()
    })
    await test.step('Check change limit succesfull popup', async()=>{
      expect(await changeLimitsSuccessPopup.getProtectionValue(protectionTP)).toContain(TP)
      await changeLimitsSuccessPopup.acceptPopup()
    })
    await test.step('Check my traders Stop Loss and Take profit', async()=>{
      expect(await myTrades.getProtectionValue(tradeFieldsTP)).toContain(TP)
      await myTrades.closePosition()
      await successfullClosePopup.acceptPopup()
    })
  })
}})
