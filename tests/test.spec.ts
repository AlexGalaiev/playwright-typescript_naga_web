import {test} from "../test-options";
import { TestInfo } from "playwright/test";
import TestRailRunID from "../global_setup";
import TestRail from "@dlenroc/testrail";
import { TestRailIntegration } from "../testrail_setup";


test("test @24926", async({}, TestInfo)=>{
    let Tr = await new TestRailIntegration();
    await Tr.addResultToTest(await Tr.getTestRunId(), await test.info().tags)
})

