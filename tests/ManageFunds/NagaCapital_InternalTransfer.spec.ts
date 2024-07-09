import { expect } from "playwright/test";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { InternalTransfer } from "../../pageObjects/ManageFunds/InternalTransfer";
import { SighIn } from "../../pageObjects/SighIn/SignInPage";
import {test} from "..//..//test-options"

test("@23961 Internal transfer funds", async({page, NagaCapital})=>{
    let sighIn = new SighIn(page);
    let mainPage = new MainPage(page);
    let internalTransfer = new InternalTransfer(page);
    await test.step("Login to platform", async()=>{
        await sighIn.goto(NagaCapital,'login');
        await sighIn.sigInUserToPlatform("testTrading3", process.env.USER_PASSWORD || '');
    });
    await test.step("Make internal transfer", async()=>{
        await mainPage.openManageFunds();
        await internalTransfer.openInternalTransferPage();
        await internalTransfer.chooseAccount();
        await internalTransfer.make1$InternalTransfer();
        expect(await internalTransfer.checkSuccessPopupText()).toContain("You have successufuly transfered")
    })
})