import { expect } from "playwright/test";
import { VerificationPopup } from "../../pageObjects/VerificationCenter/verificationPopup";
import { test } from "../../test-options";
import { MyAccounts } from "../../pageObjects/MainPage/MyAccounts";
import { SighIn } from "../../pageObjects/SighIn/SignInPage";

test.describe("Verification center", async() => {
  
  type VerificationTypes = {
    testRailId: string,
    user: string,
    brand: string
  }

  const testVerificatrionParams: VerificationTypes[] = [
    {testRailId: '@23599', user: 'testVerification@i.ua', brand: '@NS'},
    {testRailId: '@23921', user: 'testVerificationMarkets@i.ua', brand: '@NM'}
  ]

  for(const{testRailId, user, brand}of testVerificatrionParams){
    test(`${testRailId} ${brand} check documents page`, {tag:"@verification"},async({page})=>{
      let sighIn = new SighIn(page);
      let myAccounts = new MyAccounts(page);
      let verificationPopup = new VerificationPopup(page);
      await test.step('Login by user', async()=>{
        await sighIn.goto(await sighIn.chooseBrand(brand), "login");
        await sighIn.sigInUserToPlatform(user, process.env.USER_PASSWORD || '');
      await test.step('Check statuses of documents in My Accounts', async()=>{
        await myAccounts.openUserMenu()
        await myAccounts.openMyAccountsMenuItem('My Documents')
        expect(await verificationPopup.getStatusOdDocuments()).toEqual('Requested')
      })
    })
  })
}
});
