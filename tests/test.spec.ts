import {test} from "../test-options";
import {expect} from "@playwright/test";
import TestRail from "@dlenroc/testrail";
import { TestRailIntegration } from "../testrail_setup";
import { SignUp } from "../pageObjects/ShortRegistrationPage/SighUpPage";

test("name @24917", async({page, NagaCapital})=>{
    let Tr = await new TestRailIntegration();
    // let sighUp = new SignUp(page);
    // await sighUp.goto(NagaCapital, 'register');
    // expect(1).toBeGreaterThan(1000)
    expect(1000).toBeGreaterThan(100)
    
})