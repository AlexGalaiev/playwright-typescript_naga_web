import TestRail from "@dlenroc/testrail";
import TestrailApiClient from "testrail-api";
import _ from 'lodash'
import moment, { now } from "moment";

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
    
    async AddAutomationRun(){
        const cases = await this.getTestCases(4,3)
        const addRunId = await this.TestRail.addRun(1, {
            suite_id:7,
            name:`Naga_AT_${momentTime.toISOString()}`,
            description:'Naga Automation test cases for all brands',
            include_all:false,
            case_ids: cases.map(testCase => testCase.id)

        });
        this.TestRunId = addRunId.id;
        return this.TestRunId
    };
    async AddManualRun(){
        const cases = await this.getTestCases(3,13)
        const addRunId = await this.TestRail.addRun(1, {
            suite_id:7,
            name:`Naga_manual_${momentTime.toISOString()}`,
            description:'Naga manual cases for all brands',
            include_all:false,
            case_ids: cases.map(testCase => testCase.id)

        });
    };

    private async getTestCases(priority: number, type: number){
        let cases = await this.TestRail.getCases(1,{
            priority_id:priority,
            type_id: type
        });
        return cases;
    }; 

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
      
    private async getTestCaseId(RunId, tags){
        let getCasesFromTestRun = await this.getTestCasesFromTestRun(RunId);
        let findId = _.find(getCasesFromTestRun.tests, {case_id: _.toNumber(tags[0]?.replace('@',''))});
        return findId.id
    };

    async addResultToTest(RunId, tags, testStatus){
        let realTestCaseId = await this.getTestCaseId(RunId, tags);
        let testRailStatus = await this.getStatus(testStatus)
        await this.TestRail.addResult(realTestCaseId, {status_id:testRailStatus})
    };

    async getTestRunId(){
        let allRuns = await this.TestRail.getRuns(1);
        let testATruns = _.filter(allRuns, item=> _.includes(item.name, "Naga_AT"));
        let currentRun = _.orderBy(testATruns, ['id']['desc'])
        return currentRun[0].id
    };

    private async getStatus(testStatus){
        let testRailStatuses = {
            'passed':1,
            'failed':5,
            'skipped':4,
            // 'interrupted':2,
            'timedOut':2
        };
        let TRstatus = await testRailStatuses[testStatus]
        return TRstatus
    }
// ___________________________________

    // async getListTags(){
    //     let tags = [ '@24926', '@24915' ];
    //     let itag = _.forEach(tags, (tag)=>{let finind = this.getTestCaseId(1284, tag)});
    
        
    //     }
    };





        // let itag = _.forEach(tags, (tag) =>{
        //     this.getTestCaseId(RunId, tag)
        //     console.log(tag, itag)


   
