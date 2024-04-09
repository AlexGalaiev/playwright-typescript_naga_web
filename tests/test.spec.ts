import {test} from "../test-options";
import { TestInfo } from "playwright/test";
import TestRailRunID from "../global.setup";
import TestRail from "@dlenroc/testrail";
import { TestRailIntegration } from "../testrail_setup";


test("test @24926", async({page})=>{
    console.log('22222')
    console.log(await test.info().status)
})

