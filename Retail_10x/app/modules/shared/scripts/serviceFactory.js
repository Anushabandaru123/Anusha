'use strict';
angular.module('shared.serviceFactory', [])
  .service('serviceFactory', ['$http', function ($http) {
    var profile = '';
    //external,internal,static
      
      var self = this;
      self.timeout = 30000;
      self.base_url = "retailer/ws_retailer.asmx/";
      self.mode = 'development',
      
      self.developmentUrl = "http://retailesdev-es5-1.us-west-2.elasticbeanstalk.com/",
      //self.developmentUrl = "http://54.173.120.23:3000/",
      //self.developmentUrl = "http://192.168.0.8:3000/",
      
      
      self.localUrl = 'stubs',
      self.allretailer='000';
      
      self.productionUrl = "http://retailesdev-es5.us-west-2.elasticbeanstalk.com/",
      //self.campaignDevUrl="http://54.173.120.23:3000/";
      self.campaignDevUrl= "http://retailesdev-es5.us-west-2.elasticbeanstalk.com/"
 /***** dev api  *****/
 //http://retail10xcardenaspr-env.us-west-2.elasticbeanstalk.com
 /*****new api ******/
 //http://retailesdev-es5.us-west-2.elasticbeanstalk.com
 //http://retailesdev-es5-1.us-west-2.elasticbeanstalk.com
 //Production - http://retailesdev-es5.us-west-2.elasticbeanstalk.com
 //Development - http://retailesdev-es5-1.us-west-2.elasticbeanstalk.com
      
      
      self.urlConfiguration = {
        development: {
          authenticate: self.developmentUrl + 'login',
          logout: self.developmentUrl  + 'logout',
          StoreList:self.developmentUrl +'retailerId'+'/storeList',
          DepartmentList:self.developmentUrl +'retailerId'+'/departmentList',
          SalesPerformance:self.developmentUrl +'retailerId'+'/salesData',
          ShoppingTrips:self.developmentUrl +'retailerId' +'/basketCount',
          AvgBasket:self.developmentUrl +'retailerId' +'/basketSize',
          TopProducts:self.developmentUrl +'retailerId'+'/topPerformers',
          SalesPerformanceByStoreId:self.developmentUrl +'retailerId'+'/'+'storeId'+'/salesData',
          TopProductsByStoreId:self.developmentUrl +'retailerId'+'/'+'storeId'+'/topPerformers',
          ShoppingTripsByStoreId:self.developmentUrl +'retailerId'+'/'+'storeId'+'/basketCount',
          AvgBasketByStoreId:self.developmentUrl +'retailerId'+'/'+'storeId'+'/basketSize',
          TopTenProducts:self.developmentUrl +'retailerId'+'/topPerformers?size='+'productsSize',
          TopTenProductsByStoreId:self.developmentUrl +'retailerId'+'/'+'storeId'+'/topPerformers?size='+'productsSize',
          toptenDepartments:self.developmentUrl +'retailerId'+'/salesData?size=10',
          toptenDepartmentsBystoreId:self.developmentUrl +'retailerId'+'/'+'storeId'+'/salesData?size=10',
          getRetailers:self.developmentUrl +'getRetailers',
          SalesperformanceByAllRetailers:self.developmentUrl +self.allretailer+'/salesData?size=10',
          SalesperformanceByAllRetailerswithoutsize:self.developmentUrl +self.allretailer+'/salesData',
          shareOfCategory:self.developmentUrl +'MFGID'+'/shareOfCategory',
          shareOfBasket:self.developmentUrl +'MFGID'+'/shareOfBasket',
          topPerformersByAllRetailer:self.developmentUrl +self.allretailer+'/topPerformers?size='+'productsSize',
          topPerformersByAllRetailerwithoutsize:self.developmentUrl +self.allretailer+'/topPerformers',
          toptenDepartmentsByAllRetailer:self.developmentUrl +self.allretailer+'/salesData?size=10',
          getStoreListBasedonretailer:self.developmentUrl +'retailer'+'/storeList',
          itemLocations:self.developmentUrl+'itemLocations',
          createCampaign:self.developmentUrl+'createCampaign',
          //RetailercampaignList:self.developmentUrl+'campaignList?rid=retailerId&status='+'campaignStatus',
          geoSalesData:self.developmentUrl+'retailerId'+'/geoSalesData',
          geoSalesDataforcpg:self.developmentUrl+self.allretailer+'/geoSalesData',
          productsSuggested:self.developmentUrl+'retailerId'+'/productSuggest/'+'productsuggest',
          //cpgcampaignList:self.developmentUrl+'campaignList?mid=mfgId&status='+'campaignStatus',
          //selectedcampaign:self.developmentUrl+'campaignList?cid=cId',
          //updateCampaign:self.developmentUrl+'updateCampaign?cid=cId',
          //deleteCampaign:self.developmentUrl+'deleteCampaign?cid=cId',
          avgSaleschange:self.developmentUrl+'retailerId'+'/avgSalesChange',
          avgSaleschangeforcpg:self.developmentUrl+self.allretailer+'/avgSalesChange',
          SalesPerformanceByStoreIdforallretailer:self.developmentUrl +self.allretailer+'/'+'storeId'+'/salesData',
          GetHundredDepartments:self.developmentUrl +'retailerId'+'/salesData?size=100',
          GetHundredDepartmentsBystoreId:self.developmentUrl +'retailerId'+'/'+'storeId'+'/salesData?size=100',
          GetmanufacturerList:self.developmentUrl+'retailerId'+'/getManufacturers',
          GetmanufacturerListByFilter:self.developmentUrl+'retailerId'+'/getManufacturers?deptId='+'deptIdValue'+'&category='+'categoryValue',
          GetcategoriesList:self.developmentUrl+'getCategories?rid='+'retailerId',
          GetcategoriesListByFilter:self.developmentUrl+'getCategories?rid='+'retailerId'+'&deptId='+'deptIdValue',
          GetmanufacturerListByDepartment:self.developmentUrl+'retailerId'+'/getManufacturers?deptId='+'deptIdValue',
          GetmanufacturerListByCategory:self.developmentUrl+'retailerId'+'/getManufacturers?category='+'categoryValue',
          TokenRefresh:self.developmentUrl+'refreshToken',
          SalesPerformanceByStoreIdbaseonsize:self.developmentUrl +'retailerId'+'/'+'storeId'+'/salesData?size='+'salesdatasize'+'&sort_by='+'sortByValue',
          SalesPerformancebyretailerbasedonsize:self.developmentUrl +'retailerId'+'/salesData?size='+'salesdatasize'+'&sort_by='+'sortByValue',
          GetcategoriesListforcpg:self.developmentUrl+'getCategories?mid='+'MFGID',
          GetcategoriesListforcpgbasedonretailer:self.developmentUrl+'getCategories?mid='+'MFGID'+'&rid='+'retailerId',
          SalesPerformancebyallretailerbasedonsize:self.developmentUrl +self.allretailer+'/salesData?size='+'salesdatasize'+'&sort_by='+'sortByValue',
          getItems:self.developmentUrl+'MFGID'+'/getItems',
          itemsbycategory:self.developmentUrl +self.allretailer+'/salesData?size='+'itemssize'+'&sort_by=name-asc',
          getCategoriesbasedonstore:self.developmentUrl +'retailerId'+'/'+'storeId'+'/salesData?size='+'categorySize',
          sellersbystore:self.developmentUrl +'retailerId'+'/'+'storeId'+'/salesData?size=100'+'&sort_by='+'amt-desc',
          sellerbyretailer:self.developmentUrl +'retailerId'+'/salesData?size=100'+'&sort_by='+'amt-desc',
          worstsellersbystore:self.developmentUrl +'retailerId'+'/'+'storeId'+'/salesData?size=100'+'&sort_by='+'amt-asc',
          worstsellerbyretailer:self.developmentUrl +'retailerId'+'/salesData?size=100'+'&sort_by='+'amt-asc',
          bestsellersbyallretailer:self.developmentUrl +self.allretailer+'/salesData?size=5'+'&sort_by='+'amt-desc',
          bestsellersbyretailerforcpg:self.developmentUrl +'retailerId'+'/salesData?size=5'+'&sort_by='+'amt-desc',
          bestsellersbystoreforcpg:self.developmentUrl +'retailerId'+'/'+'storeId'+'/salesData?size=5'+'&sort_by='+'amt-desc',
          worstsellersbyallretailer:self.developmentUrl +self.allretailer+'/salesData?size=5'+'&sort_by='+'amt-asc',
          worstsellersbyretailerforcpg:self.developmentUrl +'retailerId'+'/salesData?size=5'+'&sort_by='+'amt-asc',
          worstsellersbystoreforcpg:self.developmentUrl +'retailerId'+'/'+'storeId'+'/salesData?size=5'+'&sort_by='+'amt-asc',
          salesdatafilter:self.developmentUrl +'retailerId'+'/salesData?size=10000'+'&sort_by='+'name-asc',
          salesdatafilterbystore:self.developmentUrl +'retailerId'+'/'+'storeId'+'/salesData?size=10000'+'&sort_by='+'name-asc',
          salesdatafordepartments:self.developmentUrl+'retailerId'+'/salesData?size=10000',
          salesdatafordepartmentsbystore:self.developmentUrl+'retailerId'+'/'+'storeId'+'/salesData?size=10000',
          salesdatafordepartmentsforcpg:self.developmentUrl+self.allretailer+'/salesData?size=10000',
          productsSuggestedforcpg:self.developmentUrl+self.allretailer+'/productSuggest/'+'productsuggest'+'?mfgIds='+'MFGID',
          grant:self.developmentUrl+"chat/grant?cid="+'campaignId',
          getPromotionTypes:self.developmentUrl+'promotionTypes',
          createCampaignNew:self.developmentUrl+'createCampaign',
          sendEmail:self.developmentUrl+'sendCampaignEmail',
          addCampaignFile:self.developmentUrl+'addCampaignFile',
          updateCampaignNew:self.developmentUrl+'updateCampaign?cid=cId',
          getCampaignDetails:self.developmentUrl+'campaignList?cid=cId',
          getCampaignDetailsforCPG:self.developmentUrl+'campaignList?cid=cId'+'&mid='+'MFGID',
          RetailercampaignList:self.developmentUrl+'campaignList?rid=retailerId&status='+'campaignStatus',
          cpgcampaignList:self.developmentUrl+'campaignList?mid=MFGID&status='+'campaignStatus',
          selectedcampaign:self.developmentUrl+'campaignList?cid=cId',
          selectedcampaignforcpg:self.developmentUrl+'campaignList?cid=cId'+'&mid='+'MFGID',
          updateCampaign:self.developmentUrl+'updateCampaign?cid=cId',
          deleteCampaign:self.developmentUrl+'deleteCampaign?cid=cId',
          deleteCampaignFile:self.developmentUrl+'deleteCampaignFile?cid=cId&fid=fileId',
          updateCampaignStatus:self.developmentUrl+'updateCampaignStatus',
          getCouponDiscountTypes:self.developmentUrl+'getCouponDiscountTypes',
          getCouponExpirationTypeDetails:self.developmentUrl+'getCouponExpirationTypes',
          createCoupon:self.developmentUrl+'createCoupon',
          updateCoupon:self.developmentUrl+'updateCoupon?cid=response_cid',
          couponList:self.developmentUrl+'listCoupons?mfgid='+'MFGID'+'&status='+'couponStatus',
          updateCouponStatus:self.developmentUrl+'updateCouponStatus',
          coupondetails:self.developmentUrl+'listCoupons?cupid='+'couponId'+'&status='+'couponStatus',
          retailercouponList:self.developmentUrl+'listCoupons?retid='+'retailerId'+'&status='+'couponStatus',
          retailercoupondetails:self.developmentUrl+'listCoupons?retid='+'retailerId'+'&cupid='+'couponId'+'&status='+'couponStatus',
          deleteCoupon:self.developmentUrl+'deleteCoupon?cid='+'couponId',
          DistributorBrands:self.developmentUrl+'getDistributorBrands?distid='+'distributorId',
          topsalesRegionsByBrands:self.developmentUrl+self.allretailer+'/geoSalesData?size=5',
          topstoresByBrands:self.developmentUrl+self.allretailer+'/salesData?size=5',
          geosalesDataByBrands:self.developmentUrl+self.allretailer+'/geoSalesData?size=100',
          getAllStores:self.developmentUrl +self.allretailer+'/storeList',
          getcategoriesByDistributor:self.developmentUrl +"getCategories?distid="+'distributorId',
          getitemsfordistributor:self.developmentUrl+self.allretailer+"/getItems?distid="+'distributorId',
          productsSuggestedforDistributor:self.developmentUrl+self.allretailer+'/productSuggest/'+'productsuggest'+'?brandIds='+'brandIdsList',
          ShoppingTripsfordistributor:self.developmentUrl +self.allretailer+'/basketCount',
          AvgBasketfordistributor:self.developmentUrl +self.allretailer+'/basketSize',
          topstoresByRegion:self.developmentUrl+self.allretailer+'/salesData?size=10',
          shareOfCategoryforDistributor:self.developmentUrl+'distributorId'+"/shareOfCategory?mode=dId",
          shareOfBasketforDistributor:self.developmentUrl+'distributorId'+"/shareOfBasket?mode=dId",
          dmaList:self.developmentUrl+'dmaList',
          DeptDataforRetailer:self.developmentUrl+'retailerId'+'/productSuggest/'+'selectedUpc',
          DeptDataforCPG:self.developmentUrl+self.allretailer+'/productSuggest/'+'selectedUpc',
          DeptDataforDistribiter:self.developmentUrl+self.allretailer+'/productSuggest/'+'selectedUpc',
          RetailerProductbyDepartment:self.developmentUrl+'retailerId'+'/salesData?size=1000&sort_by=name-asc',
          RetailerProductbyStore:self.developmentUrl+'retailerId'+'/'+'storeId'+'/salesData?size=1000&sort_by=name-asc',
          getRetailersBaseonUPC:self.developmentUrl+'getRetailers?upc='+'selectedUpc',
          campaignListforDistributor:self.developmentUrl+'campaignList?did=distributorId&status='+'campaignStatus',
          getManageUserforCPG:self.developmentUrl+'getLogins?role='+'userRole'+'&role_id='+'MFGID',
          getManageUserforDistributor:self.developmentUrl+'getLogins?role='+'userRole'+'&role_id='+'distributorId',
          getManageUserforRetailer:self.developmentUrl+'getLogins?role='+'userRole'+'&role_id='+'retailerId',
          updateLogin:self.developmentUrl+'updateLogin', 
          campaignDetailsforDistributor:self.developmentUrl+'campaignList?cid=cId&did=distributorId',
          productsuggested:self.developmentUrl+self.allretailer+'/productSuggest/'+'productsuggest',
          StoreListforCPG:self.developmentUrl +'retailer'+'/storeList?log_id='+'loginID',
          getAllStoresforCPG:self.developmentUrl +self.allretailer+'/storeList?log_id='+'loginID',
          dmaListforCPG:self.developmentUrl+'dmaList?log_id='+'loginID',
          getRetailersforCPG:self.developmentUrl +'getRetailers?log_id='+'loginID',
          //productsSuggestedforallreatilers:self.developmentUrl+self.allretailer+'/productSuggest/'+'productsuggest'+'?mfgIds='+'MFGID'+'&rids='+'RIDS',
          productsSuggestedforallreatilers:self.developmentUrl+self.allretailer+'/productSuggest/'+'productsuggest'+'?rids='+'RIDS',
          GetcategoriesListforallretailers:self.developmentUrl+'getCategories?mid='+'MFGID'+'&rids='+'RIDS',
          getBrandsforCPG:self.developmentUrl+'getBrands?mfgid='+'MFGID',
          getDMAforCPG:self.developmentUrl+'dmaSearch/'+'DMAsuggest'+'?log_id='+'loginID' ,
          getcategorywithDMA:self.developmentUrl+'getCategories?mid='+'MFGID'+'&dmaid='+'DmaId',
          // 
          //RetailerProductbyDepartmentforcpg:self.developmentUrl+self.allretailer+'/salesData?size=1000&sort_by=name-asc',
          //ShoppingTripsByStoreId:self.productionUrl +self.allretailer+'/'+'storeId'+'/basketCount',
          //AvgBasketByStoreId:self.productionUrl +self.allretailer+'/'+'storeId'+'/basketSize',
        },

        production: {
          authenticate: self.productionUrl + 'login',
          logout: self.productionUrl  + 'logout',
          StoreList:self.productionUrl +'retailerId'+'/storeList',
          DepartmentList:self.productionUrl +'retailerId'+'/departmentList',
          SalesPerformance:self.productionUrl +'retailerId'+'/salesData',
          ShoppingTrips:self.productionUrl +'retailerId' +'/basketCount',
          AvgBasket:self.productionUrl +'retailerId' +'/basketSize',
          TopProducts:self.productionUrl +'retailerId'+'/topPerformers',
          SalesPerformanceByStoreId:self.productionUrl +'retailerId'+'/'+'storeId'+'/salesData',
          TopProductsByStoreId:self.productionUrl +'retailerId'+'/'+'storeId'+'/topPerformers',
          ShoppingTripsByStoreId:self.productionUrl +'retailerId'+'/'+'storeId'+'/basketCount',
          AvgBasketByStoreId:self.productionUrl +'retailerId'+'/'+'storeId'+'/basketSize',
          TopTenProducts:self.productionUrl +'retailerId'+'/topPerformers?size='+'productsSize',
          TopTenProductsByStoreId:self.productionUrl +'retailerId'+'/'+'storeId'+'/topPerformers?size='+'productsSize',
          toptenDepartments:self.productionUrl +'retailerId'+'/salesData?size=10',
          toptenDepartmentsBystoreId:self.productionUrl +'retailerId'+'/'+'storeId'+'/salesData?size=10',
          getRetailers:self.productionUrl +'getRetailers',
          SalesperformanceByAllRetailers:self.productionUrl +self.allretailer+'/salesData?size=10',
          SalesperformanceByAllRetailerswithoutsize:self.productionUrl +self.allretailer+'/salesData',
          shareOfCategory:self.productionUrl +'MFGID'+'/shareOfCategory',
          shareOfBasket:self.productionUrl +'MFGID'+'/shareOfBasket',
          topPerformersByAllRetailer:self.productionUrl +self.allretailer+'/topPerformers?size='+'productsSize',
          topPerformersByAllRetailerwithoutsize:self.productionUrl +self.allretailer+'/topPerformers',
          toptenDepartmentsByAllRetailer:self.productionUrl +self.allretailer+'/salesData?size=10',
          getStoreListBasedonretailer:self.productionUrl +'retailer'+'/storeList',
          itemLocations:self.productionUrl+'itemLocations',
          createCampaign:self.productionUrl+'createCampaign',
          //RetailercampaignList:self.productionUrl+'campaignList?rid=retailerId&status='+'campaignStatus',
          geoSalesData:self.productionUrl+'retailerId'+'/geoSalesData',
          geoSalesDataforcpg:self.productionUrl+self.allretailer+'/geoSalesData',
          productsSuggested:self.productionUrl+'retailerId'+'/productSuggest/'+'productsuggest',
          //cpgcampaignList:self.productionUrl+'campaignList?mid=mfgId&status='+'campaignStatus',
          //selectedcampaign:self.productionUrl+'campaignList?cid=cId',
          //updateCampaign:self.productionUrl+'updateCampaign?cid=cId',
          //deleteCampaign:self.productionUrl+'deleteCampaign?cid=cId',
          avgSaleschange:self.productionUrl+'retailerId'+'/avgSalesChange',
          avgSaleschangeforcpg:self.productionUrl+self.allretailer+'/avgSalesChange',
          SalesPerformanceByStoreIdforallretailer:self.productionUrl +self.allretailer+'/'+'storeId'+'/salesData',
          GetHundredDepartments:self.productionUrl +'retailerId'+'/salesData?size=100',
          GetHundredDepartmentsBystoreId:self.productionUrl +'retailerId'+'/'+'storeId'+'/salesData?size=100',
          GetmanufacturerList:self.productionUrl+'retailerId'+'/getManufacturers',
          GetmanufacturerListByFilter:self.productionUrl+'retailerId'+'/getManufacturers?deptId='+'deptIdValue'+'&category='+'categoryValue',
          GetcategoriesList:self.productionUrl+'getCategories?rid='+'retailerId',
          GetcategoriesListByFilter:self.productionUrl+'getCategories?rid='+'retailerId'+'&deptId='+'deptIdValue',
          GetmanufacturerListByDepartment:self.productionUrl+'retailerId'+'/getManufacturers?deptId='+'deptIdValue',
          GetmanufacturerListByCategory:self.productionUrl+'retailerId'+'/getManufacturers?category='+'categoryValue',
          TokenRefresh:self.productionUrl+'refreshToken',
          SalesPerformanceByStoreIdbaseonsize:self.productionUrl +'retailerId'+'/'+'storeId'+'/salesData?size='+'salesdatasize'+'&sort_by='+'sortByValue',
          SalesPerformancebyretailerbasedonsize:self.productionUrl +'retailerId'+'/salesData?size='+'salesdatasize'+'&sort_by='+'sortByValue',
          GetcategoriesListforcpg:self.productionUrl+'getCategories?mid='+'MFGID',
          GetcategoriesListforcpgbasedonretailer:self.productionUrl+'getCategories?mid='+'MFGID'+'&rid='+'retailerId',
          SalesPerformancebyallretailerbasedonsize:self.productionUrl +self.allretailer+'/salesData?size='+'salesdatasize'+'&sort_by='+'sortByValue',
          getItems:self.productionUrl+'MFGID'+'/getItems',
          itemsbycategory:self.productionUrl +self.allretailer+'/salesData?size='+'itemssize'+'&sort_by=name-asc',
          getCategoriesbasedonstore:self.productionUrl +'retailerId'+'/'+'storeId'+'/salesData?size='+'categorySize',
          sellersbystore:self.productionUrl +'retailerId'+'/'+'storeId'+'/salesData?size=100'+'&sort_by='+'amt-desc',
          sellerbyretailer:self.productionUrl +'retailerId'+'/salesData?size=100'+'&sort_by='+'amt-desc',
          worstsellersbystore:self.productionUrl +'retailerId'+'/'+'storeId'+'/salesData?size=100'+'&sort_by='+'amt-asc',
          worstsellerbyretailer:self.productionUrl +'retailerId'+'/salesData?size=100'+'&sort_by='+'amt-asc',
          bestsellersbyallretailer:self.productionUrl +self.allretailer+'/salesData?size=5'+'&sort_by='+'amt-desc',
          bestsellersbyretailerforcpg:self.productionUrl +'retailerId'+'/salesData?size=5'+'&sort_by='+'amt-desc',
          bestsellersbystoreforcpg:self.productionUrl +'retailerId'+'/'+'storeId'+'/salesData?size=5'+'&sort_by='+'amt-desc',
          worstsellersbyallretailer:self.productionUrl +self.allretailer+'/salesData?size=5'+'&sort_by='+'amt-asc',
          worstsellersbyretailerforcpg:self.productionUrl +'retailerId'+'/salesData?size=5'+'&sort_by='+'amt-asc',
          worstsellersbystoreforcpg:self.productionUrl +'retailerId'+'/'+'storeId'+'/salesData?size=5'+'&sort_by='+'amt-asc',
          salesdatafilter:self.productionUrl +'retailerId'+'/salesData?size=10000'+'&sort_by='+'name-asc',
          salesdatafilterbystore:self.productionUrl +'retailerId'+'/'+'storeId'+'/salesData?size=10000'+'&sort_by='+'name-asc',
          salesdatafordepartments:self.productionUrl+'retailerId'+'/salesData?size=10000',
          salesdatafordepartmentsbystore:self.productionUrl+'retailerId'+'/'+'storeId'+'/salesData?size=10000',
          salesdatafordepartmentsforcpg:self.productionUrl+self.allretailer+'/salesData?size=10000',
          productsSuggestedforcpg:self.productionUrl+self.allretailer+'/productSuggest/'+'productsuggest'+'?mfgIds='+'MFGID',
          grant:self.productionUrl+"chat/grant?cid="+'campaignId',
          getPromotionTypes:self.productionUrl+'promotionTypes',
          createCampaignNew:self.productionUrl+'createCampaign',
          sendEmail:self.productionUrl+'sendCampaignEmail',
          addCampaignFile:self.productionUrl+'addCampaignFile',
          updateCampaignNew:self.productionUrl+'updateCampaign?cid=cId',
          getCampaignDetailsforCPG:self.productionUrl+'campaignList?cid=cId'+'&mid='+'MFGID',
          getCampaignDetails:self.productionUrl+'campaignList?cid=cId',
          RetailercampaignList:self.productionUrl+'campaignList?rid=retailerId&status='+'campaignStatus',
          cpgcampaignList:self.productionUrl+'campaignList?mid=MFGID&status='+'campaignStatus',
          selectedcampaign:self.productionUrl+'campaignList?cid=cId',
          selectedcampaignforcpg:self.productionUrl+'campaignList?cid=cId'+'&mid='+'MFGID',
          updateCampaign:self.productionUrl+'updateCampaign?cid=cId',
          deleteCampaign:self.productionUrl+'deleteCampaign?cid=cId',
          deleteCampaignFile:self.productionUrl+'deleteCampaignFile?cid=cId&fid=fileId',
          updateCampaignStatus:self.productionUrl+'updateCampaignStatus',
	     getCouponDiscountTypes:self.productionUrl+'getCouponDiscountTypes',
          getCouponExpirationTypeDetails:self.productionUrl+'getCouponExpirationTypes',
          createCoupon:self.productionUrl+'createCoupon',
          updateCoupon:self.productionUrl+'updateCoupon?cid=response_cid',
          couponList:self.productionUrl+'listCoupons?mfgid='+'MFGID'+'&status='+'couponStatus',
          updateCouponStatus:self.productionUrl+'updateCouponStatus',
          coupondetails:self.productionUrl+'listCoupons?cupid='+'couponId',
          retailercouponList:self.productionUrl+'listCoupons?retid='+'retailerId'+'&status='+'couponStatus',
          retailercoupondetails:self.productionUrl+'listCoupons?retid='+'retailerId'+'&cupid='+'couponId'+'&status='+'couponStatus',
          deleteCoupon:self.productionUrl+'deleteCoupon?cid='+'couponId',
          DistributorBrands:self.productionUrl+'getDistributorBrands?distid='+'distributorId',
          topsalesRegionsByBrands:self.productionUrl+self.allretailer+'/geoSalesData?size=5',
          topstoresByBrands:self.productionUrl+self.allretailer+'/salesData?size=5',
          geosalesDataByBrands:self.productionUrl+self.allretailer+'/geoSalesData?size=100',
          getAllStores:self.productionUrl +self.allretailer+'/storeList',
          getcategoriesByDistributor:self.productionUrl +"getCategories?distid="+'distributorId',
          getitemsfordistributor:self.productionUrl+self.allretailer+"/getItems?distid="+'distributorId',
          productsSuggestedforDistributor:self.productionUrl+self.allretailer+'/productSuggest/'+'productsuggest'+'?brandIds='+'brandIdsList',
          ShoppingTripsfordistributor:self.productionUrl +self.allretailer+'/basketCount',
          AvgBasketfordistributor:self.productionUrl +self.allretailer+'/basketSize',
          topstoresByRegion:self.productionUrl+self.allretailer+'/salesData?size=10',
          shareOfCategoryforDistributor:self.productionUrl+'distributorId'+"/shareOfCategory?mode=dId",
          shareOfBasketforDistributor:self.productionUrl+'distributorId'+"/shareOfBasket?mode=dId",
          dmaList:self.productionUrl+'dmaList',
          DeptDataforRetailer:self.productionUrl+'retailerId'+'/productSuggest/'+'selectedUpc',
          DeptDataforCPG:self.productionUrl+self.allretailer+'/productSuggest/'+'selectedUpc',
          DeptDataforDistribiter:self.productionUrl+self.allretailer+'/productSuggest/'+'selectedUpc',
          RetailerProductbyDepartment:self.productionUrl+'retailerId'+'/salesData?size=1000&sort_by=name-asc',
          getRetailersBaseonUPC:self.productionUrl+'getRetailers?upc='+'selectedUpc',
          RetailerProductbyDepartmentforcpg:self.productionUrl+self.allretailer+'/salesData?size=1000&sort_by=name-asc',
          RetailerProductbyStore:self.productionUrl+'retailerId'+'/'+'storeId'+'/salesData?size=1000&sort_by=name-asc',
          campaignListforDistributor:self.productionUrl+'campaignList?did=distributorId&status='+'campaignStatus',
          getManageUserforCPG:self.productionUrl+'getLogins?role='+'userRole'+'&role_id='+'MFGID',
          getManageUserforDistributor:self.productionUrl+'getLogins?role='+'userRole'+'&role_id='+'distributorId',
          getManageUserforRetailer:self.productionUrl+'getLogins?role='+'userRole'+'&role_id='+'retailerId',
          updateLogin:self.productionUrl+'updateLogin', 
          campaignDetailsforDistributor:self.productionUrl+'campaignList?cid=cId&did=distributorId',
          productsuggested:self.productionUrl+self.allretailer+'/productSuggest/'+'productsuggest',
          StoreListforCPG:self.productionUrl +'retailer'+'/storeList?log_id='+'loginID',
          getAllStoresforCPG:self.productionUrl +self.allretailer+'/storeList?log_id='+'loginID',
          dmaListforCPG:self.productionUrl+'dmaList?log_id='+'loginID',
          getRetailersforCPG:self.productionUrl +'getRetailers?log_id='+'loginID',
          // productsSuggestedforallreatilers:self.productionUrl+self.allretailer+'/productSuggest/'+'productsuggest'+'?mfgIds='+'MFGID'+'&rids='+'RIDS',
          productsSuggestedforallreatilers:self.productionUrl+self.allretailer+'/productSuggest/'+'productsuggest'+'?rids='+'RIDS',
          GetcategoriesListforallretailers:self.productionUrl+'getCategories?mid='+'MFGID'+'&rids='+'RIDS',
          getBrandsforCPG:self.productionUrl+'getBrands?mfgid='+'MFGID',
          getDMAforCPG:self.productionUrl+'dmaSearch/'+'DMAsuggest'+'?log_id='+'loginID' ,
          getcategorywithDMA:self.productionUrl+'getCategories?mid='+'MFGID'+'&dmaid='+'DmaId',
        }
      };

      self.getMode=function(){
          return self.mode;
      }

    self.getPacket = function (url, method, data) {

      var request = {};
     self.retailerId=sessionStorage.user;
     self.storeId=sessionStorage.storeId;
     self.mfgId=sessionStorage.mfgId;
     self.productsSize=sessionStorage.productsSize;
     self.retailer=sessionStorage.retailer;
     self.productsuggested=sessionStorage.productsuggested;
     self.cId=sessionStorage.cId;
     self.fileId=sessionStorage.fileId;
     self.campaignStatus=sessionStorage.campaignStatus;
     self.deptIdValue=sessionStorage.deptIdValue;
     self.categoryValue=sessionStorage.categoryValue;
     self.salesdatasize=sessionStorage.salesdatasize;
     self.sortByValue=sessionStorage.sortByValue;
     self.itemssize=sessionStorage.itemssize;
     self.categorySize=sessionStorage.categorySize;
     self.campaignId=sessionStorage.campaignId;
     self.response_cid = sessionStorage.response_cid;
     self.couponStatus= sessionStorage.couponStatus;
     self.couponId= sessionStorage.couponId;
     self.distributorId=sessionStorage.distributorId;
     self.brandIdsList=sessionStorage.brandIdsList;
     self.selectedUPC=sessionStorage.selectedUPC;
     self.userRole=sessionStorage.role;
     self.retailerid=sessionStorage.retailerId;
     self.loginID=sessionStorage.loginId;
     self.rids=sessionStorage.rids;
     self.dmasuggest=sessionStorage.DMAsuggest;
     self.dmaId=sessionStorage.DMAID;

     var realUrl=self.urlConfiguration[self.mode][url];
         realUrl=realUrl.replace('retailerId',self.retailerId);
         realUrl=realUrl.replace('storeId',self.storeId);
         realUrl=realUrl.replace('MFGID',self.mfgId);
         realUrl=realUrl.replace('retailer',self.retailer);
         realUrl=realUrl.replace('productsuggest',self.productsuggested);
         realUrl=realUrl.replace('productsSize',self.productsSize);
         realUrl=realUrl.replace('cId',self.cId);
         realUrl=realUrl.replace('campaignStatus',self.campaignStatus);
         realUrl=realUrl.replace('deptIdValue',self.deptIdValue);
         realUrl=realUrl.replace('categoryValue',self.categoryValue);
         realUrl=realUrl.replace('salesdatasize',self.salesdatasize);
         realUrl=realUrl.replace('sortByValue',self.sortByValue);
         realUrl=realUrl.replace('itemssize',self.itemssize);
         realUrl=realUrl.replace('categorySize',self.categorySize);
         realUrl=realUrl.replace('campaignId',self.campaignId);
         realUrl=realUrl.replace('fileId',self.fileId);
         realUrl=realUrl.replace('response_cid',self.response_cid);
         realUrl=realUrl.replace('couponStatus',self.couponStatus);
         realUrl=realUrl.replace('couponId',self.couponId);
         realUrl=realUrl.replace('distributorId',self.distributorId);
         realUrl=realUrl.replace('brandIdsList',self.brandIdsList);
         realUrl=realUrl.replace('selectedUpc',self.selectedUPC);
         realUrl=realUrl.replace('userRole',self.userRole);
         realUrl=realUrl.replace('retailerId',self.retailerid);
         realUrl=realUrl.replace('loginID',self.loginID);
         realUrl=realUrl.replace('RIDS',self.rids);
         realUrl=realUrl.replace('DMAsuggest',self.dmasuggest);
         realUrl=realUrl.replace('DmaId',self.dmaId);



      //Need to Customize for get with parameters.
      if (method == 'GET') {

        realUrl = realUrl.replace('form', data);

        /*if (url == 'getDetail') {
         realUrl = realUrl.replace('param', data);
         } else {
         realUrl = realUrl.replace('{param}', data);
         } */

        request = {
          url: realUrl,
          method: method,
          timeout: self.timeout,
           headers: { "Content-Type": "application/json",
             authToken: sessionStorage.token 
           },
          cache: false

        };

      }
      else if (method == 'DELETE') {

        realUrl = realUrl.replace('form', data);

        /*if (url == 'getDetail') {
         realUrl = realUrl.replace('param', data);
         } else {
         realUrl = realUrl.replace('{param}', data);
         } */

        request = {
          url: realUrl,
          method: method,
          timeout: self.timeout,
           headers: { "Content-Type": "application/json",
             authToken: sessionStorage.token 
           },
          cache: false

        };

      }
      else if (method == 'POST' && (data != null)) {
           // data.passport = true;
                //console.log("data coming...",data);

        request = {
          method: 'POST',
          url: realUrl,
          data: data,
          timeout: self.timeout,
           headers: { "Content-Type": "application/json",
             authToken: sessionStorage.token 
           },
          cache: false
        };
      }

      return request;
    };
    self.getUrl = function (url) {
      var realUrl = self.urlConfiguration[self.mode][url];

      return  realUrl;
    };

    self.getDetail = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request = self.getPacket('getDetail', 'GET', data);
      return $http(request);
    };

    return self;

  }]);
