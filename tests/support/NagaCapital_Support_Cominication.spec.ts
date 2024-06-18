import { expect } from "@playwright/test";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { SighIn } from "../../pageObjects/SighIn/SignInPage"
import { HelpPage } from "../../pageObjects/Support/HelpPage";
import {test} from "..//..//test-options"
test.describe('NagaCapital. Support links', async()=>{

    test.beforeEach("Login to platform", async({page, NagaCapital})=>{
        let sighIn = new SighIn(page);
        await sighIn.goto(NagaCapital, 'login');
        await sighIn.sigInUserToPlatform("testSupport@i.ua", process.env.USER_PASSWORD || '')
        await new MainPage(page).openFAQMenuPoint();
    })

    test("@23983 Call us links", async({page})=>{
        let helpPage = new HelpPage(page)
        await helpPage.openCallUsPage();
        expect(await helpPage.getPhoneValue()).toEqual("+248 4 671 946")
        expect(await helpPage.getEmailValue()).toEqual("support@nagacap.com")
    })

    test("@23982 Chat with us page", async({page})=>{
        let helpPage = new HelpPage(page)
        await helpPage.openChat();
        expect(await helpPage.checkOpenedChat()).toBeVisible()
    })
})