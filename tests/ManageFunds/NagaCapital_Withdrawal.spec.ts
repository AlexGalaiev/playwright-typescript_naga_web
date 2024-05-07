import { expect } from "@playwright/test";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { Withdrawal } from "../../pageObjects/ManageFunds/Withdrawal"
import { SighIn } from "../../pageObjects/SighIn/SignInPage";
import {test} from "..//..//test-options"
import { getLocalization } from "../../pageObjects/localization/getText";

test.describe("Naga Capital. Withdrawal credit card", async()=>{
    const ManageFunds_Withdrawal = "/pageObjects/localization/ManageFunds_Withdrawal.json";
    test("@24097 Withdrawal credti card", async({page, NagaCapital})=>{
        let sighIn = new SighIn(page);
        let withdrawal = new Withdrawal(page);
        let mainPage = new MainPage(page);
        let amountValueToWithrawal = '50'
        await test.step('Login by withdrawal user to platform and open withdrawal', async()=>{
            await sighIn.goto(NagaCapital,'login');
            await sighIn.sigInUserToPlatform("n.mucibabic+testcap1@naga.com", process.env.USER_PASSWORD || '');
            await mainPage.openManageFunds();
        });
        await test.step("Make withdrawal with credit card", async()=>{
            await withdrawal.chooseWithdrawalMenu();
            await withdrawal.inputAmountWithdrawal(amountValueToWithrawal);
            expect(await withdrawal.getCheckWithdrawalAmount()).toContain(amountValueToWithrawal);
            await withdrawal.clickWithdrawBtn();
        });
        await test.step("Check withdrawal iframe", async()=>{
            expect(await withdrawal.checkCCCashier()).toBeVisible();
        })
    })

    test("@24932 Withdrawal validation rulls", async({page, NagaCapital})=>{
        let sighIn = new SighIn(page);
        let withdrawal = new Withdrawal(page);
        let mainPage = new MainPage(page);
        let amountValueToWithrawal = '10'
        await test.step('Login by withdrawal user to platform and open withdrawal', async()=>{
            await sighIn.goto(NagaCapital,'login');
            await sighIn.sigInUserToPlatform("n.mucibabic+testcap1@naga.com", process.env.USER_PASSWORD || '');
            await mainPage.openManageFunds();
        });
        await test.step('Input NOT valid amount for withdrawal', async()=>{
            await withdrawal.chooseWithdrawalMenu();
            await withdrawal.inputAmountWithdrawal(amountValueToWithrawal);
            await withdrawal.getErrorText() === "Amount has to be greater than or equal to $50"
        });
        await test.step("Open modal popup for cc cashier", async()=>{
            await withdrawal.openModalCCPopup();
            expect(await withdrawal.checkModalPopup()).toBeVisible()
        })
    });

    test("@24098 Check Neteller withdrawal", async({page, NagaCapital})=>{
        let sighIn = new SighIn(page);
        let withdrawal = new Withdrawal(page);
        let mainPage = new MainPage(page);
        let amountValueToWithrawal = '50'
        await test.step('Login by withdrawal user to platform and open Neteler withdrawal', async()=>{
            await sighIn.goto(NagaCapital,'login');
            await sighIn.sigInUserToPlatform("n.mucibabic+testcap1@naga.com", process.env.USER_PASSWORD || '');
            await mainPage.openManageFunds();
            await withdrawal.chooseWithdrawalMenu()
            await withdrawal.clickEwalletWithdrawal()
        });
        await test.step("Make Neteler withdrawal", async()=>{
            await withdrawal.inputAmountWithdrawal(amountValueToWithrawal);
            await withdrawal.clickWithdrawBtn();
        })
        await test.step("Check Neteller cashier", async()=>{
            expect(await withdrawal.checkNetelerCashier()).toBeVisible()
        })
    })

    test("@24095 Check Skrill withdrawal", async({page, NagaCapital})=>{
        let sighIn = new SighIn(page);
        let withdrawal = new Withdrawal(page);
        let mainPage = new MainPage(page);
        let amountValueToWithrawal = '50'
        await test.step('Login by withdrawal user to platform and open Skrill withdrawal', async()=>{
            await sighIn.goto(NagaCapital,'login');
            await sighIn.sigInUserToPlatform("n.mucibabic+testcap1@naga.com", process.env.USER_PASSWORD || '');
            await mainPage.openManageFunds();
            await withdrawal.chooseWithdrawalMenu();
            await withdrawal.clickEwalletWithdrawal()
            await withdrawal.clickSkrillWithdrawal();
        });
        await test.step("Make Skrill withdrawal", async()=>{
            await withdrawal.inputAmountWithdrawal(amountValueToWithrawal);
            await withdrawal.clickWithdrawBtn();
        })
        await test.step("Check Skril withdrawal", async()=>{
            expect(await withdrawal.checkSkrilCashier()).toBeVisible()
        })
    });
    test("@24089 Check Perfect money withdrawal", async({page, NagaCapital})=>{
        let sighIn = new SighIn(page);
        let withdrawal = new Withdrawal(page);
        let mainPage = new MainPage(page);
        let amountValueToWithrawal = '50'
        await test.step('Login by withdrawal user to platform and open Perfect Money withdrawal', async()=>{
            await sighIn.goto(NagaCapital,'login');
            await sighIn.sigInUserToPlatform("n.mucibabic+testcap1@naga.com", process.env.USER_PASSWORD || '');
            await mainPage.openManageFunds();
            await withdrawal.chooseWithdrawalMenu();
            await withdrawal.clickEwalletWithdrawal();
            await withdrawal.clickPerfectMoney();
        });
        await test.step("Make Perfect Money withdrawal", async()=>{
            await withdrawal.inputAmountWithdrawal(amountValueToWithrawal);
            await withdrawal.clickWithdrawBtn();
        })
        await test.step("Check Perfect money withdrawal", async()=>{
            expect(await withdrawal.checkPerfectMoneyCashier()).toBeVisible()
        })
    })

    test("@24091 Check Crypto withdrawal", async({page, NagaCapital})=>{
        let sighIn = new SighIn(page);
        let withdrawal = new Withdrawal(page);
        let mainPage = new MainPage(page);
        let amountValueToWithrawal = '60';
        let localization = new getLocalization(ManageFunds_Withdrawal);
        await test.step('Login to platform and open Crypto withdrawal', async()=>{
            await sighIn.goto(NagaCapital,'login');
            await sighIn.sigInUserToPlatform("n.mucibabic+testcap1@naga.com", process.env.USER_PASSWORD || '');
            await mainPage.openManageFunds();
            await withdrawal.chooseWithdrawalMenu();
            await withdrawal.clickCrypto();
        })
        await test.step("Make crypto withdrawal", async()=>{
            await withdrawal.inputAmountWithdrawal(amountValueToWithrawal);
            await withdrawal.clickWithdrawBtn();
        })
        await test.step("Check crypto wallet popup", async()=>{
            expect(await withdrawal.checkCryptoPopup).toBeTruthy
            await withdrawal.checkCryptoPopupHeaderText() === 'Withdraw to Crypto'
            await withdrawal.performCryptoWithdrawalToTestAccount();
        })
        await test.step('Check crypto withdrawal success popup', async()=>{
            expect(await withdrawal.checkCryptoWithdrawalSuccessPopup).toBeTruthy
            await withdrawal.checkCryptoSuccessPopupText() === await localization.getLocalizationText("CryptoWithdrawalSuccessPopupText")

        })
    })
})

