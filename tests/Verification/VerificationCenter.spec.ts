import { expect } from "playwright/test";
import { test } from "../../test-options";


test.describe("Verification center", async() => {
  
  type VerificationTypes = {
    user: string,
    brand: string
  }

  const testVerificatrionParams: VerificationTypes[] = [
    { user: 'testVerification@i.ua', brand: '@Capital'},
    { user: 'testVerificationMarkets@i.ua', brand: '@Markets'}
  ]

  for(const{ user, brand}of testVerificatrionParams){
    test(`${brand} Check My documents(My accounts) page`, 
      {tag:"@verification", annotation:{description:"https://keywaygroup.atlassian.net/browse/RG-9752", type:'ticket'}},async({app, AppNAGA})=>{
      await test.step(`Login by ${user} user, to ${brand}`, async()=>{
        await app.signIn.goto(AppNAGA, "login");
        await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
      await test.step('Check statuses of uploaded documents in My Accounts', async()=>{
        await app.myAccounts.openUserMenu()
        await app.myAccounts.openMyAccountMenuItem('My Documents')
        expect(await app.verificationPopup.getStatusOdDocuments()).toEqual('Requested')
      })})})
    }
});
