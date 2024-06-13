import { expect } from "@playwright/test";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { Withdrawal } from "../../pageObjects/ManageFunds/Withdrawal"
import { SighIn } from "../../pageObjects/SighIn/SignInPage";
import {test} from "..//..//test-options"
import { getLocalization } from "../../pageObjects/localization/getText";

test.describe("Naga Capital. Withdrawal.", async()=>{
    const ManageFunds_Withdrawal = "/pageObjects/localization/ManageFunds_Withdrawal.json";
    let amountValueToWithrawal = '50'

    test.beforeEach("Login by trade user", async({page, NagaCapital })=>{
        let sighIn = new SighIn(page);
        let mainPage = new MainPage(page);
        await test.step('Login by withdrawal user to platform and open withdrawal', async()=>{
            await sighIn.goto(NagaCapital,'login');
            await sighIn.sigInUserToPlatform("testTrading2", process.env.USER_PASSWORD || '');
            await mainPage.openManageFunds();
            await new Withdrawal(page).chooseWithdrawalMenu();
        });
    })
    test("@24097 Withdrawal via credtit card", async({page})=>{
        let withdrawal = new Withdrawal(page);
        await test.step('Make withdrawal via credit card', async()=>{
            await withdrawal.clickMenuPoint('Credit Card');
            await withdrawal.inputAmountWithdrawal(amountValueToWithrawal);
            expect(await withdrawal.getWithdrawalAmountValue()).toContain(amountValueToWithrawal);
            await withdrawal.clickWithdrawBtn();
        })
        await test.step("Check withdrawal iframe", async()=>{
            expect(await withdrawal.getTitleOfCashierName()).toContain('Credit Card')
            expect(await withdrawal.checkNameOfIframe()).toEqual('_cashier_iframe')
        })
    })
    test("@24932 Withdrawal validation rulls", async({page})=>{
        let withdrawal = new Withdrawal(page);
        let valueToWithrawal = '10'
        await test.step('Input NOT valid amount for withdrawal', async()=>{
            await withdrawal.clickMenuPoint('Credit Card');
            await withdrawal.inputAmountWithdrawal(valueToWithrawal);
            expect(await withdrawal.getErrorText()).toContain("Amount has to be greater than or equal to")
        });
        await test.step("Open modal popup for cc cashier", async()=>{
            await withdrawal.openModalCCPopup();
            expect(await withdrawal.checkModalPopup()).toBeVisible()
        })
    });

    test("@24098 Check Neteller withdrawal", async({page})=>{
        let withdrawal = new Withdrawal(page);
        await test.step("Make Neteler withdrawal", async()=>{
            await withdrawal.clickMenuPoint('eWallet')
            await withdrawal.clickPaymentMethod('neteller')
            await withdrawal.inputAmountWithdrawal(amountValueToWithrawal);
            expect(await withdrawal.getEwalletWithdrawalAmount()).toContain(amountValueToWithrawal);
            await withdrawal.clickWithdrawBtn();
        })
        await test.step("Check Neteller cashier", async()=>{
            expect(await withdrawal.getTitleOfCashierName()).toContain('Neteller')
            expect(await withdrawal.checkNameOfIframe()).toEqual('_cashier_iframe')
        })
    })

    test("@24095 Check Skrill withdrawal", async({page})=>{
        let withdrawal = new Withdrawal(page);
        await test.step("Make Skrill withdrawal", async()=>{
            await withdrawal.clickMenuPoint('eWallet')
            await withdrawal.clickPaymentMethod('skrill')
            await withdrawal.inputAmountWithdrawal(amountValueToWithrawal);
            expect(await withdrawal.getEwalletWithdrawalAmount()).toContain(amountValueToWithrawal);
            await withdrawal.clickWithdrawBtn();
        })
        await test.step("Check Skril withdrawal", async()=>{
            expect(await withdrawal.getTitleOfCashierName()).toContain('Skrill')
            expect(await withdrawal.checkNameOfIframe()).toEqual('_cashier_iframe')
        })
    });
    test("@24089 Check Perfect money withdrawal", async({page})=>{
        let withdrawal = new Withdrawal(page);
        await test.step("Make Perfect Money withdrawal", async()=>{
            await withdrawal.clickMenuPoint('eWallet')
            await withdrawal.clickPaymentMethod('perfectmoney')
            await withdrawal.inputAmountWithdrawal(amountValueToWithrawal);
            expect(await withdrawal.getEwalletWithdrawalAmount()).toContain(amountValueToWithrawal);
            await withdrawal.clickWithdrawBtn();
        })
        await test.step("Check Perfect money withdrawal", async()=>{
            expect(await withdrawal.getTitleOfCashierName()).toContain('Perfect Money')
            expect(await withdrawal.checkNameOfIframe()).toEqual('_cashier_iframe')
        })
    })

    test("@24091 Check Crypto withdrawal", async({page})=>{
        let withdrawal = new Withdrawal(page);
        let localization = new getLocalization(ManageFunds_Withdrawal);
        await test.step("Make crypto withdrawal", async()=>{
            await withdrawal.clickMenuPoint('Crypto')
            await withdrawal.inputAmountWithdrawal(amountValueToWithrawal);
            await withdrawal.clickWithdrawBtn();
        })
        await test.step("Check crypto wallet popup", async()=>{
            expect(await withdrawal.checkCryptoPopup()).toBeVisible()
            expect(await withdrawal.checkCryptoPopupHeaderText()).toEqual('Withdraw to Crypto')
            await withdrawal.performCryptoWithdrawalToTestAccount();
        })
        await test.step('Check crypto withdrawal success popup', async()=>{
            expect(await withdrawal.checkCryptoWithdrawalSuccessPopup()).toBeVisible()
            expect(await withdrawal.checkCryptoSuccessPopupText()).toEqual(await localization.getLocalizationText("CryptoWithdrawalSuccessPopupText"))
        })
    })
})

