import { expect } from "@playwright/test";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { Withdrawal } from "../../pageObjects/ManageFunds/Withdrawal"
import { SighIn } from "../../pageObjects/SighIn/SignInPage";
import {test} from "..//..//test-options"

test.describe("Naga Capital. Withdrawal credit card", async()=>{
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
    })
})
