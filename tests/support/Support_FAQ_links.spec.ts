import { MainPage } from "../../pageObjects/MainPage/MainPage"
import { SighIn } from "../../pageObjects/SighIn/SignInPage"
import { FAQ } from "../../pageObjects/Support/Faq"
import {test} from "../../test-options"


test.describe('FAQ links', async()=>{

let FAQ_NM = "/pageObjects/Support/FAQ_NM.json"
let FAQ_NS = "/pageObjects/Support/FAQ_NS.json"

type faqTypes = {
    testRailId: string,
    brand: string,
    user: string,
    categories: string
}

const testFAQParams: faqTypes[] = [
    {testRailId: '@23621', brand: '@NM', user: "testSupportMarkets@i.ua", categories: FAQ_NM},
    {testRailId: '@23981', brand: '@NS', user: "testSupport@i.ua", categories: FAQ_NM}
]

for(const{testRailId, brand, user, categories} of testFAQParams){
    test(`${testRailId} FAQ support links ${brand}`, {tag:'@support'},async({page}, testInfo)=>{
        await testInfo.setTimeout(testInfo.timeout + 70000);
        let sighIn = new SighIn(page)
        let faq = new FAQ(page, categories)
        await test.step('Login to platform', async()=>{
            await sighIn.goto(await sighIn.chooseBrand(brand), 'login')
            await sighIn.sigInUserToPlatform(user,  process.env.USER_PASSWORD || '')
            await new MainPage(page).openFAQMenuPoint();
        })
        await test.step('Check FAQ poits', async()=>{
            await faq.checkSubcategory("Getting Started");
            await faq.checkSubcategory("Community");
            await faq.checkSubcategory("Deposits")
            await faq.checkSubcategory("Withdrawals")
            await faq.checkSubcategory("Trading")
            await faq.checkSubcategory("Account")
        })
    })
}
})
