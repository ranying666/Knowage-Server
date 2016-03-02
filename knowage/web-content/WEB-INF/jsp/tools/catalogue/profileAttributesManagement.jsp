<%--
Knowage, Open Source Business Intelligence suite
Copyright (C) 2016 Engineering Ingegneria Informatica S.p.A.

Knowage is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

Knowage is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
--%>


<%@ page language="java" pageEncoding="utf-8" session="true"%>


<%-- ---------------------------------------------------------------------- --%>
<%-- JAVA IMPORTS															--%>
<%-- ---------------------------------------------------------------------- --%>


<%@include file="/WEB-INF/jsp/commons/angular/angularResource.jspf"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html ng-app="profileAttributesManagementModule">
<head>
<%@include file="/WEB-INF/jsp/commons/angular/angularImport.jsp"%>

<!-- Styles -->
<link rel="stylesheet" type="text/css"	href="/knowage/themes/glossary/css/generalStyle.css">
<link rel="stylesheet" type="text/css"	href="/knowage/themes/catalogue/css/catalogue.css">
<script type="text/javascript" src="/knowage/js/src/angular_1.4/tools/commons/angular-table/AngularTable.js"></script>

<script type="text/javascript" src="/knowage/js/src/angular_1.4/tools/catalogues/profileAttributesManagement.js"></script>


</head>
<body class="bodyStyle" ng-controller="profileAttributesManagementController as ctrl" >
	<angular_2_col>
		<left-col>
			<div class="leftBox">
				<md-toolbar class="header" >
					<div class="md-toolbar-tools" >
						<div style="font-size : 24px;">{{translate.load("sbi.attributes.title");}}</div>
                       
						<md-button 
							class="md-fab md-ExtraMini addButton"
							style="position:absolute; right:11px; top:0px;"
							aria-label="create"
							ng-click="createProfileAttribute()"> 
							<md-icon
								md-font-icon="fa fa-plus" 
								style=" margin-top: 6px ; color: white;">
							</md-icon> 
						</md-button>
					</div>
				</md-toolbar>
				<md-content layout-padding style="background-color: rgb(236, 236, 236);" class="ToolbarBox miniToolbar noBorder leftListbox">
					<angular-table 
						layout-fill
						id="profileAttributesList"
						ng-model="attributeList"
						columns='[
						         {"label":"Name","name":"attributeName"},
						         {"label":"Description","name":"attributeDescription"}
						         ]'
						columns-search='["attributeName","attributeDescription"]'
						show-search-bar=true
						highlights-selected-item=true
						speed-menu-option="paSpeedMenu"
						
						click-function="loadAttribute(item)"
										
					>						
					</angular-table>
				</md-content>
			</div>
		</left-col>
		<right-col>
			<form name="attributeForm" layout-fill ng-submit="attributeForm.$valid && saveProfileAttribute()" class="detailBody md-whiteframe-z1">
				<div ng-show="showMe">
					<md-toolbar class="header">
						<div class="md-toolbar-tools h100">
							<div style="text-align: center; font-size: 24px;">{{translate.load("sbi.attributes.title");}}</div>
							<div style="position: absolute; right: 0px" class="h100">
								
								<md-button id="cancel" type="button"
								aria-label="cancel" class="md-raised md-ExtraMini rightHeaderButtonBackground"
								style=" margin-top: 2px;"
								ng-click="cancel()">
								{{translate.load("sbi.generic.cancel");}} 
								</md-button>
								
								<md-button type="submit"
								aria-label="save atrribute" class="md-raised md-ExtraMini rightHeaderButtonBackground"
								style=" margin-top: 2px;"
								ng-disabled="!attributeForm.$valid"
								>
								{{translate.load("sbi.attributes.update");}} </md-button>
								
							</div>
							</div>
					</md-toolbar>
					<md-content flex style="margin-left:20px;" class="ToolbarBox miniToolbar noBorder">
						<div layout="row" layout-wrap>
      						<div flex=100>
       							<md-input-container class="small counter">
       								<label>{{translate.load("sbi.attributes.headerName")}}</label>
       								<input ng-model="selectedAttribute.attributeName" required
        							ng-change="setDirty()"  ng-maxlength="100">
        							
        							<div ng-messages="attributeForm.Name.$error" ng-show="!selectedAttribute.attributeName">
          <div ng-message="required">{{translate.load("sbi.catalogues.generic.reqired")}}</div>
        </div>
        							 </md-input-container>
      						</div>
    					</div>
    					<div layout="row" layout-wrap>
      						<div flex=100>
       							<md-input-container class="small counter">
       								<label>{{translate.load("sbi.attributes.headerDescr")}}</label>
       								<input ng-model="selectedAttribute.attributeDescription"
        							ng-change="setDirty()"  ng-maxlength="100"> </md-input-container>
      						</div>
    					</div>			
					</md-content>
				
				</div>
			</form>
		</right-col>
	
	</angular_2_col>
</body>
</html>
