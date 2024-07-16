import { SighIn } from "../../pageObjects/SighIn/SignInPage"
import {test} from "..//..//test-options"
import { TestInfo } from "playwright/test"

test.describe('Naga Capital. Main Page elements', async()=>{
    test.beforeEach('Login to platform', async({page, NagaCapital})=>{
        let sighIn = new SighIn(page)
    })

})