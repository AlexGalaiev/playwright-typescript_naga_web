import {test} from "../test-options";
import { TestInfo } from "playwright/test";
import TestRail from "@dlenroc/testrail";
import { TestRailIntegration } from "../testrail_setup";


test("test @24926", async({page})=>{
    let Tr = await new TestRailIntegration();
    // await Tr.getListTags()
    // await Tr.getListTags()
})

