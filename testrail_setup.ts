import TestRail from "@dlenroc/testrail";
import _ from 'lodash';
import * as fs from 'fs';
import path from "path";

let momentTime = new Date();

export class TestRailIntegration{
    readonly TestRail: TestRail;
    readonly TestProject: number;
    TestRunId: number | undefined;
    
    constructor(){
        this.TestRail = new TestRail({
            host: "https://naga.testrail.io/",
            username: process.env.TESTRAIL_USERNAME || '',
            password: process.env.TESTRAIL_PASSWORD || ''
        }),
        this.TestRunId;
    };
    // create automation test run
    async AddAutomationRun(){
        const cases = await this.getTestCases(4,3)
        const addRunId = await this.TestRail.addRun(1, {
            suite_id:7,
            name:`Naga_AT_${{ github.head_ref || github.ref_name }}_${momentTime.toLocaleDateString()}`,
            description:'Naga Automation test cases for all brands',
            include_all:false,
            case_ids: cases.map(testCase => testCase.id)

        });
        this.TestRunId = addRunId.id;
        return this.TestRunId
    };
    // create manual test run
    async AddManualRun(){
        const cases = await this.getTestCases(3,13)
        const addRunId = await this.TestRail.addRun(1, {
            suite_id:7,
            name:`Naga_manual_${{ github.head_ref || github.ref_name }}_${momentTime.toLocaleDateString()}`,
            description:'Naga manual cases for all brands',
            include_all:false,
            case_ids: cases.map(testCase => testCase.id)

        });
    };
    // function that filter all number of test cases and give only with need parameters
    private async getTestCases(priority: number, type: number){
        let cases = await this.TestRail.getCases(1,{
            priority_id:priority,
            type_id: type
        });
        return cases;
    }; 
    //get all test cases of test run
    private async getTestCasesFromTestRun(RunId){
        const username = process.env.TESTRAIL_USERNAME || '';
        const password = process.env.TESTRAIL_PASSWORD || '';
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Basic " + btoa(`${username}:${password}`));
        myHeaders.append("Cookie", "tr_session=a82a5cd8-7ac0-4898-b21f-b0af952411e7");
        const requestOptions = {method: "GET", headers: myHeaders, redirect: "follow"};
        try {
          const response = await fetch(`https://naga.testrail.io/index.php?/api/v2/get_tests/${RunId}`, requestOptions);
          const result = await response.json();
          return result;
        } catch (error) {
          console.error(error);
        }
      };
    // return real case Id from tag . It works ONLY with one tag
    async getTestCaseId(RunId, tags){
        let getCasesFromTestRun = await this.getTestCasesFromTestRun(RunId);
        let findId = _.find(getCasesFromTestRun.tests, {case_id: _.toNumber(tags[0]?.replace('@',''))});
        return findId.id
    };
    //add results to only ONE test
    async addResultToTest(RunId, tags, testStatus){
        let realTestCaseId = await this.getTestCaseId(RunId, tags);
        let testRailStatus = await this.getStatus(testStatus)
        await this.TestRail.addResult(realTestCaseId, {status_id:testRailStatus})
    };
    //Check AT run is correct and return correct AT run
    async getTestRunId(){
        let allRuns = await this.TestRail.getRuns(1);
        let testATruns = _.filter(allRuns, item=> _.includes(item.name, "Naga_AT"));
        let currentRun = _.orderBy(testATruns, ['id']['desc'])
        return currentRun[0].id
    };
    //map of testStatuses
    private async getStatus(testStatus){
        let testRailStatuses = {
            'passed':1,
            'failed':5,
            'skipped':2,
            'timedOut':5,
            'interrupted':4
        };
        let TRstatus = await testRailStatuses[testStatus]
        return TRstatus
    }
// ___________________________________
    //create map of testcaseid (tag of test) and real testCaseIn test run {@tag:realTestCaseId}
    async getListTags(RunId, tags){
        const tagIdMap = {};
        let getCasesFromTestRun = await this.getTestCasesFromTestRun(RunId);
        _.forEach(tags, (tag)=>{
            let findId = _.find(getCasesFromTestRun.tests, {case_id: _.toNumber(tag?.replace('@',''))});
            tagIdMap[tag] = findId.id
        })
        return tagIdMap;
    };
    //marks ALL test from test map 
    async addResultToListOfTests(RunId, tags, testStatus){
        let realIdMap = await this.getListTags(RunId, tags);
        let testRailStatus = await this.getStatus(testStatus);
        
        await tags.forEach(async (tag)=>{
            let realId = await realIdMap[tag]
            await this.TestRail.addResult(realId, {status_id:testRailStatus, comment: 'comment'})
        })
    }
    async addCommentToTestCase(TestCaseId, status){
        if(status === 'failed'|| status === 'timedOut' || status === 'skipped' || status === 'interrupted') {
            await this.TestRail.addResult(TestCaseId, {comment: 'for more information visit github action ==> https://github.com/SwipeStoxGmbH/naga-trader-automation/actions'})
        }
        
    };
}
