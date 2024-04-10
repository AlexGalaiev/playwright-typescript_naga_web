import {test} from "../test-options";
import { TestInfo } from "playwright/test";
import TestRail from "@dlenroc/testrail";
import { TestRailIntegration } from "../testrail_setup";


test("test @23569 @23896", async({page})=>{
    let Tr = await new TestRailIntegration();
    // console.log(await Tr.getListTags(1288, test.info().tags))
    await Tr.addResultToListOfTests(await Tr.getTestRunId(), await test.info().tags, await test.info().status)


})
