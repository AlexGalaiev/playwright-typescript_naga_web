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

test.describe("Trading. Trading by positions/orders + protection", async () => {
type tradingTypesWithProtection = {
  testRailId: string,
  brand: string,
  user: string,
  investDirection: string,
  protection: string,
  tradeField: string
}
let tradingInstrument = "Dogecoin/USD";
let NagaProtectionValue;
let SL; 
let TP;
let deposit;
let units;

const tradingParametersPositionsSL: tradingTypesWithProtection[] = [
  {testRailId: '@25165', brand: '@NS', user:'testTrading2', investDirection:'Short', protection: 'Stop Loss',tradeField: 'sl'},
  {testRailId: '@25160', brand: '@NS', user:'testTrading2', investDirection:"Long", protection: 'Take profit',tradeField: 'tp'},
  {testRailId: '@25166', brand: '@NM', user:'testTrading2Markets', investDirection:'Short', protection: 'Stop Loss', tradeField:'sl'},
  {testRailId: '@25017', brand: '@NM', user:'testTrading2Markets', investDirection:'Long', protection: 'Take profit', tradeField:'tp'},
]
for(const{testRailId, brand, user, investDirection, protection,tradeField} of tradingParametersPositionsSL){
  test(`${testRailId} ${brand} Open/Close ${investDirection} position + ${protection}`, {tag:['@trading','@prodSanity']},async ({ page}, testInfo) => {
    await testInfo.setTimeout(testInfo.timeout + 140000);
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
      expect(Number(await myTrades.getProtectionValue(tradeField))).toBeCloseTo(Number(NagaProtectionValue), 2)
    });
    await test.step('Close position and check sucses popup', async()=>{
      await myTrades.closePosition()
      await successPopup.acceptPopup()
    })
  })}

  const tradingParametersOrders: tradingTypesWithProtection[] = [
    {testRailId: '@25167', brand: '@NS', user:'testTrading2', investDirection:'Short', protection: 'Stop Loss',tradeField: 'sl'},
    {testRailId: '@25169', brand: '@NS', user:'testTrading2', investDirection:"Long", protection: 'Take profit',tradeField: 'tp'},
    {testRailId: '@25171', brand: '@NM', user:'testTrading2Markets', investDirection:'Short', protection: 'Stop Loss', tradeField:'sl'},
    {testRailId: '@25170', brand: '@NM', user:'testTrading2Markets', investDirection:'Long', protection: 'Take profit', tradeField:'tp'}
  ]
  for(const{testRailId, brand, user, investDirection, protection, tradeField}of tradingParametersOrders){
    test(`${testRailId} ${brand} Open/Close pending ${investDirection} position + ${protection}`, {tag:'@trading'}, async({page}, testInfo)=>{
      await testInfo.setTimeout(testInfo.timeout + 150000);
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
  tradeFieldsTP: string
}

const tradingParametersSLTP: changeLimittypes[] = [
  {testRailId: '@25173', brand: '@NS', user:'testTrading2', investDirection:'Short', protectionSL: 'Stop Loss', protectionTP: 'Take Profit', tradeFieldSL: 'sl', tradeFieldsTP: 'tp'},
  {testRailId: '@25172', brand: '@NM', user:'testTrading2Markets', investDirection:"Short", protectionSL: 'Stop Loss', protectionTP: 'Take Profit', tradeFieldSL: 'sl', tradeFieldsTP: 'tp'}
]
for(const{testRailId, brand, user, investDirection, protectionSL, protectionTP, tradeFieldSL, tradeFieldsTP} of tradingParametersSLTP){
  test(`${testRailId} Edit position popup with ${protectionSL}/${protectionTP}`, {tag:'@trading'}, async({page}, testInfo)=>{
    await testInfo.setTimeout(testInfo.timeout + 140000);
    let signIn = new SignIn(page);
    let mainPage = new MainPage(page);
    let myTrades = new MyTrades(page)
    let instruments = new AllInstruments(page);
    let newPosition = new NewPosition(page);
    let changeLimits = new ChangeLimitsPopup(page);
    let changeLimitsSuccessPopup = new ChangeLimitSuccessPopup(page)
    let successfullClosePopup = new ClosePositionSuccessPopup(page)
    await test.step(`Login to ${brand} platfotm by ${user}`, async () => {
      await signIn.goto(await signIn.chooseBrand(brand), "login");
      await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || "");
    });
    await test.step("Check previously opened positions. Close it if exist", async () => {
      await mainPage.openHeaderMenuPoint("my-trades");
      await myTrades.closePositionsIfExist();
    });
    await test.step(`Choose ${tradingInstrument} for trading. Open new position page`, async () => {
      await mainPage.openHeaderMenuPoint("markets");
      await instruments.openPositionOfInstrument(tradingInstrument, investDirection)
      await newPosition.submitPosition(); 
    });
    await test.step("Check My-trades", async () => {
      await mainPage.openHeaderMenuPoint("my-trades");
      expect(await myTrades.checkStatusOfElement(await myTrades.activeTradesTab)).toContain("active");
      deposit = (await myTrades.getDepositValue())?.replace('$','');
      units = await myTrades.getUnits();
    })
    await test.step(`Open change limit popup and install ${protectionSL}`, async()=>{
      await myTrades.openChangeLimitPopup()
      await changeLimits.enableStopLoss();
      SL = await changeLimits.getProtectionValue(protectionSL)
      await changeLimits.updatePosition()
    })
    await test.step('Check change limit successfull popup', async()=>{
      expect(await changeLimitsSuccessPopup.getLotsAmount()).toContain(units)
      expect(Number(await changeLimitsSuccessPopup.getInvesctmentsAmount())).toBeCloseTo(Number(deposit))
      expect(await changeLimitsSuccessPopup.getProtectionValue(protectionSL)).toContain(SL)
      await changeLimitsSuccessPopup.acceptPopup()
    })
    await test.step('Check my traders Stop Loss', async()=>{
      expect(await myTrades.getProtectionValue(tradeFieldSL)).toContain(SL)
    })
    await test.step(`Enable ${protectionTP} and check result`, async()=>{
      await myTrades.openChangeLimitPopup();
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
