import { expect } from "playwright/test";
import { VerificationPopup } from "../../pageObjects/VerificationCenter/verificationPopup";
import { test } from "../../test-options";
import { MyAccounts } from "../../pageObjects/MainPage/MyAccounts";
import { SignIn } from "../../pageObjects/SignIn/SignInPage";

test.describe("Verification center", async() => {
  
  type VerificationTypes = {
    testRailId: string,
    user: string,
    brand: string
  }

  const testVerificatrionParams: VerificationTypes[] = [
    {testRailId: '@23599', user: 'testVerification@i.ua', brand: '@Capital'},
    {testRailId: '@23921', user: 'testVerificationMarkets@i.ua', brand: '@Markets'}
  ]

  for(const{testRailId, user, brand}of testVerificatrionParams){
    test(`${testRailId} ${brand} Check My documents(My accounts) page`, {tag:"@verification"},async({page, AppNAGA})=>{
      let signIn = new SignIn(page);
      let myAccounts = new MyAccounts(page);
      let verificationPopup = new VerificationPopup(page);
      await test.step(`Login by ${user} user, to ${brand}`, async()=>{
        await signIn.goto(AppNAGA, "login");
        await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
      await test.step('Check statuses of uploaded documents in My Accounts', async()=>{
        await myAccounts.openUserMenu()
        await myAccounts.openMyAccountMenuItem('My Documents')
        expect(await verificationPopup.getStatusOdDocuments()).toEqual('Requested')
      })
    })
  })
}
});
