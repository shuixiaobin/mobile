import {myGet,myGet1,myPost} from "./requestApi";
import axios from 'axios'
import Util from './util'
class Api {
    //获取科目树
    getCategory(params){
        return myGet('match/v1/tag/category','',params);
    }
    //判断新旧逻辑
    isOldFlag(params){
        return myGet('/p/v4/matches/old/flag','',params)
    }
    //获取模考大赛
    getModelTest(params){
        return myGet('/match/v4/search/list', params)
    }
    //获取模考大赛（旧版）
    getOldModelTest(param){
        return myGet('/p/v4/matches',param)
    }
    //获取报名地区
    getArea(){
        return myGet('/match/v1/positions')
    }
    //模考报名（旧）
    oldApply(param){
        return myPost(`/p/v2/matches/${param.paperId}`,param)
    }
    //模考报名（新）
    newApply(param){
        return myPost(`/match/v1/enroll/${param.matchId}?positionId=${param.positionId}`)
    }
    //0元下单
    zeroBuy(param){
        return myPost(`/c/v6/order/zero`,{form: { ...param }})
    }


    //获取申论 模考
    getShenlunMock(){
        // return myGet('/e/api/v3/mock')
        return myGet('/e/api/v4/mock/page')
    }
    //申论报名
    shenlunApply(param){
        return myPost(`/e/api/v3/mock?paperId=${param.paperId}&positionId=${param.positionId}`)
    }
    // //微信分享接口
    // wxShare(param){
    //     return myGet(WEBPACK_PHP_URL+`/plugins/tools/wxShareJssdk.php?url=${param}`,undefined,undefined,true)
    // }
	//微信分享接口
	wxShare(param){
		return myGet(WEBPACK_PHP_BASE_URL+`/lumenapi/v5/c/order/share_wechat_signature?url=${param}`)
    }
    
    // 获取模考大赛列表用户数据（行测）
    getMockUserList(params) {
        return myGet('/match/v2/search/list/user', params)
    }
    // 获取职位库下拉列表数据（行测）
     getJobSelect(params) {
        return myGet('/match/v1/position/next', params)
    }
  
    // 模考大赛职位库报名（行测）
     jobApply(params) {
        return myPost(`/match/v1/enroll/school/${params.matchId}?schoolName=${params.schoolName}`, { ...params.body })
    }
  
    // 获取职位库数据（行测）
     getJobContent(params) {
        return myGet('/match/v1/position/show', params)
    }

      // 获取职位库下拉列表数据（申论）
      getJobSelectSL(params) {
        return myGet('/e/api/position/next', params)
    }
  
    // 模考大赛职位库报名（申论）
     jobApplySL(params) {
        return myPost(`/e/api/v3/mock/school?paperId=${params.paperId}&schoolName=${params.schoolName}`, { ...params.body })
    }
  
    // 获取职位库数据（申论）
     getJobContentSL(params) {
        return myGet('/e/api/position/show', params)
    }
}

export default new Api()