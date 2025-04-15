import { expect } from "playwright/test";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { SignIn } from "../../pageObjects/SignIn/SignInPage";
import { ClosePositionSuccessPopup } from "../../pageObjects/Trading/closePositionSuccessPopup";
import { AllInstruments } from "../../pageObjects/Trading/InstrumentsPage";
import { MyTrades } from "../../pageObjects/Trading/MyTrades";
import { NewPosition } from "../../pageObjects/Trading/OpenNewPositionPage";
import { TradeDetails } from "../../pageObjects/Trading/TradeDetails";
import { test } from "../../test-options";
import { ChangeLimitSuccessPopup } from "../../pageObjects/Trading/ChangeLimitResultPopup";
import { ChangeLimitsPopup } from "../../pageObjects/Trading/ChangeLimitsPopup";


test.describe('Mobile trading with protections', async()=>{
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
    {tag:['@trading','@mobile']}, async ({ page,AppNAGA }, testInfo) => {
    testInfo.setTimeout(testInfo.timeout + 170000);
    let signIn = new SignIn(page);
    let mainPage = new MainPage(page);
    let myTrades = new MyTrades(page);
    let instruments = new AllInstruments(page);
    let newPosition = new NewPosition(page);
    let successPopup = new ClosePositionSuccessPopup(page);
    let tradeDetails = new TradeDetails(page)
    await test.step(`Login to platfotm ${brand} by ${user}`, async () => {
      await signIn.goto(AppNAGA, "login");
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
      await myTrades.clickMobilePositionAndOpenTradedetails()
      let protectionValue = await tradeDetails.getMobileProtectionValue(protection);
      expect(Number(protectionValue)).toBeCloseTo(Number(NagaProtectionValue), 0)
      await tradeDetails.closePosition()
    });
    await test.step('Close position and check sucses popup', async()=>{
      await successPopup.successOkBtnclick()
    })
  })}


  const tradingParametersOrders: tradingTypesWithProtection[] = [
    {testRailId: '@25167', brand: '@Capital', user:'testTrading2', investDirection:'Short', protection: 'Stop Loss',tradeField: 'sl', mobileDirection:'SELL'},
    {testRailId: '@25169', brand: '@Capital', user:'testTrading2', investDirection:"Long", protection: 'Take profit',tradeField: 'tp', mobileDirection:'BUY'},
    {testRailId: '@25171', brand: '@Markets', user:'testTrading2Markets', investDirection:'Short', protection: 'Stop Loss', tradeField:'sl', mobileDirection:'SELL'},
    {testRailId: '@25170', brand: '@Markets', user:'testTrading2Markets', investDirection:'Long', protection: 'Take profit', tradeField:'tp', mobileDirection:'BUY'},
    {testRailId: '@25376', brand: '@Mena', user:'testTrading@naga.com', investDirection:'Long', protection: 'Take profit', tradeField:'tp', mobileDirection:'BUY'},
    {testRailId: '@25377', brand: '@Mena', user:'testTrading@naga.com', investDirection:'Short', protection: 'Stop Loss', tradeField:'sl', mobileDirection:'SELL'},
    {testRailId: '@25415', brand: '@Africa', user:'testTradingAfrica2@naga.com', investDirection:'Long', protection: 'Take profit', tradeField:'tp', mobileDirection:'BUY'},
    {testRailId: '@25416', brand: '@Africa', user:'testTradingAfrica2@naga.com', investDirection:'Short', protection: 'Stop Loss', tradeField:'sl', mobileDirection:'SELL'}
  ]

   for(const{testRailId, brand, user, investDirection, protection, tradeField, mobileDirection}of tradingParametersOrders){
      test(`${testRailId} ${brand} Mobile Open/Close pending ${investDirection} position + ${protection}`, 
        {tag:['@trading', '@mobile']}, async({page, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 170000);
        let signIn = new SignIn(page);
        let mainPage = new MainPage(page);
        let myTrades = new MyTrades(page);
        let instruments = new AllInstruments(page);
        let newPosition = new NewPosition(page);
        let successPopup = new ClosePositionSuccessPopup(page);
        await test.step(`Login to ${brand} platfotm by ${user}`, async () => {
          await signIn.goto(AppNAGA, "login");
          await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || "");
        });
        await test.step("Check previously opened orders and close if they exist", async () => {
          await mainPage.openMobileMenuPoint("my-trades");
          await myTrades.openActivePendingOrdersTab();
          await myTrades.closeMobilePositionsIfExist();
        });
        await test.step(`Choose ${tradingInstrument} and open position`, async () => {
          await mainPage.openMobileMenuPoint("markets");
          await instruments.openMobilePosition(tradingInstrument, mobileDirection)
        });
        await test.step(`Open ${investDirection} position + ${protection}`, async () => {
          await newPosition.chooseBtn(await newPosition.ratePositionBtn(`${investDirection} at Specific Rate`))
          await newPosition.enableProtection(protection)
          NagaProtectionValue = await newPosition.getProtectionValue(protection)
          await newPosition.submitPosition();
        });
        await test.step("Check My-trades popup", async () => {
          await mainPage.openMobileMenuPoint("my-trades");
          await myTrades.openActivePendingOrdersTab();
          expect(await myTrades.checkStatusOfElement(await myTrades.activePendingOrdersTab)).toContain("active");
          expect(Number(await myTrades.getMobileProtectionValue(tradeField))).toBeCloseTo(Number(NagaProtectionValue), 0)
        });
        await test.step('Close position and check sucses popup', async()=>{
          await myTrades.clickMobilePositionAndOpenTradedetails()
          await new TradeDetails(page).closePosition()
          await successPopup.successOkBtnclick()
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
        currency: string,
        mobileDirection: string,
      }
      
      const tradingParametersSLTP: changeLimittypes[] = [
        {testRailId: '@25173', brand: '@Capital', user:'testTrading2', investDirection:'Short', protectionSL: 'Stop Loss', protectionTP: 'Take Profit', tradeFieldSL: 'sl', tradeFieldsTP: 'tp', currency:'$', mobileDirection:'SELL'},
        {testRailId: '@25172', brand: '@Markets', user:'testTrading2Markets', investDirection:"Short", protectionSL: 'Stop Loss', protectionTP: 'Take Profit', tradeFieldSL: 'sl', tradeFieldsTP: 'tp', currency:'$', mobileDirection:'SELL'},
        {testRailId: '@25378', brand: '@Mena', user:'testTrading@naga.com', investDirection:"Short", protectionSL: 'Stop Loss', protectionTP: 'Take Profit', tradeFieldSL: 'sl', tradeFieldsTP: 'tp', currency:'€', mobileDirection:'SELL'},
        {testRailId: '@25417', brand: '@Africa', user:'testTradingAfrica2@naga.com', investDirection:"Short", protectionSL: 'Stop Loss', protectionTP: 'Take Profit', tradeFieldSL: 'sl', tradeFieldsTP: 'tp', currency:'$', mobileDirection:'SELL'}
      ]

    for(const{testRailId, brand, user, protectionSL, protectionTP, currency, mobileDirection} of tradingParametersSLTP){
        test(`${testRailId} ${brand} Mobile Edit position popup with ${protectionSL}/${protectionTP}`, 
          {tag:['@trading','@mobile']}, async({page, AppNAGA}, testInfo)=>{
          testInfo.setTimeout(testInfo.timeout + 170000);
          let signIn = new SignIn(page);
          let mainPage = new MainPage(page);
          let myTrades = new MyTrades(page)
          let instruments = new AllInstruments(page);
          let newPosition = new NewPosition(page);
          let changeLimits = new ChangeLimitsPopup(page);
          let changeLimitsSuccessPopup = new ChangeLimitSuccessPopup(page)
          let successfullClosePopup = new ClosePositionSuccessPopup(page)
          let tradeDetails = new TradeDetails(page)
          let stopLossValue;
          await test.step(`Login to ${brand} platfotm by ${user}`, async () => {
            await signIn.goto(AppNAGA, "login");
            await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || "");
          });
          await test.step("Check previously opened positions. Close it if exist", async () => {
            await mainPage.openMobileMenuPoint("my-trades");
            await myTrades.closeMobilePositionsIfExist();
          });
          await test.step(`Choose ${tradingInstrument} for trading. Open new position page. Enable ${protectionSL} `, async () => {
            await mainPage.openMobileMenuPoint("markets");
            await instruments.openMobilePosition(tradingInstrument, mobileDirection)
            await newPosition.switchToSpecificRateForm()
            await newPosition.enableProtection(protectionSL)
            stopLossValue = await newPosition.getStopLossValue(protectionSL)
            await newPosition.submitPosition(); 
          });
          await test.step("Check My-trades. Open trade details ", async () => {
            await mainPage.openMobileMenuPoint("my-trades");
            expect(await myTrades.checkStatusOfElement(await myTrades.activeTradesTab)).toContain("active");
            deposit = (await myTrades.getMobileDepositValue(currency));
            units = await myTrades.getMobileUnits();
            await myTrades.clickMobilePositionAndOpenTradedetails()
            await tradeDetails.openEditLimitsPopup()
          })
          await test.step(`Enable ${protectionTP} on Edit limits popup`, async()=>{
            await changeLimits.switchToSpecificRateForm()
            await changeLimits.enableStopLoss();
            await changeLimits.enableTakeProgit();
            TP = await changeLimits.getProtectionValue(protectionTP)
            await changeLimits.updatePosition()
          })
          await test.step('Check "Change limiit" popup', async()=>{
            expect(await changeLimitsSuccessPopup.getProtectionValue(protectionTP)).toContain(TP)
            await changeLimitsSuccessPopup.acceptPopup()
          })
          await test.step('Check take profit value on trade details popup. And close trade', async()=>{
            expect (await tradeDetails.getMobileProtectionValue(protectionTP)).toContain(TP)
            await tradeDetails.closePosition()
            await successfullClosePopup.successOkBtnclick()
          })
        })
      }

})