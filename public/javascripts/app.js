var app = {};

app.init = function() {
	Path.map("#/index").to(function() {
		$(".project_name").html("");
		app.loadPage("index");
	});

	Path.map("#/project/:projectId").to(function() {
		app.currentProject = app.projects[this.params['projectId']];
		$(".project_name").html(app.currentProject.name);
		app.loadPage("project", function(){
			$.each(app.currentProject.steps, function(stepId, stepObj){
				if(stepObj.status == 1){					
					$("a."+stepId).addClass("complete");
				}
			});
			app.steps.confirmSolutionScope();
		});
	});

	Path.root("/index");

	Path.listen();

	$("body").on("click", ".go_home", function() {
		window.location.href = '#/index';
	});

	$("body").on("click", ".step_tree .list-group-item.available", function() {
		if(!$(this).hasClass("active")){
			$(".step_tree .list-group-item").removeClass("active");
			$(this).addClass("active");	
		}
	});

	app.bindStepsEvent();
};

app.loadPage = function(pageName, callback) {
	var bi = new BusyIndicator($(".content"));
	bi.show();
	$.ajax({
		url: "/pages/" + pageName + ".html",
		type: 'get',
		cache: false,
		dataType: "html",
		success: function(htmlContent) {
			$(".content").html(htmlContent);
			if($.isFunction(callback)){
				callback.apply(this);
			}
		}, 
		complete: function(){
			bi.hide();
		}
	});
};

app.loadStep = function(stepName, callback) {
	var bi = new BusyIndicator($(".step_detail"));
	bi.show();
	$.ajax({
		url: "/pages/steps/" + stepName + ".html",
		type: 'get',
		cache: false,
		dataType: "html",
		success: function(htmlContent) {
			$(".step_detail").html(htmlContent);
			if($.isFunction(callback)){
				callback();
			}
		}, 
		complete: function(){
			bi.hide();
		}
	});
};

app.renderProjectList = function(){
	$.each(app.projects, function(){
		var $tr = app.createProjectRow(this);
		if(this.complete_steps.length == 10){
			$("#finished_projects").append($tr);
		} else {
			$("#ongoing_projects").append($tr);
		}
	});
};

app.createProjectRow = function(project){
	var complete_steps = _.filter(project.steps, function(step) {
		return step.status == 1;
	});
	console.log(complete_steps);
	var $tr = $("<tr></tr>");
	$tr.append("<td><a href='#/project/"+ project.id +"'>"+ project.name +"</a></td>");
	$tr.append("<td>"+ complete_steps.length/10*100 +" %</td>");
	$tr.append("<td>"+ "" +"</td>");
	$tr.append("<td>"+ project.package +"</td>");
	$tr.append("<td>"+ new Date(project.create_time).Format("yy-MM-dd hh:mm:ss") +"</td>");
	return $tr;
};

app.bindStepsEvent = function(){
	$("body").on("click", "a.confirmSolutionScope.available", function(){
		app.steps.confirmSolutionScope();
	});
	$("body").on("click", "a.businessPlan.available", function(){
		app.steps.businessPlan();
	});
	$("body").on("click", "a.onePagerOffering.available", function(){
		app.steps.onePagerOffering();
	});
	$("body").on("click", "a.proposalFramework.available", function(){
		app.steps.proposalFramework();
	});
	$("body").on("click", "a.demoScenarios.available", function(){
		app.steps.demoScenarios();
	});
	$("body").on("click", "a.solutionBrief.available", function(){
		app.steps.solutionBrief();
	});
	$("body").on("click", "a.deliveryContent.available", function(){
		app.steps.deliveryContent();
	});
	$("body").on("click", "a.ecoHubStorefront.available", function(){
		app.steps.ecoHubStorefront();
	});
	$("body").on("click", "a.customerFacingBrochure.available", function(){
		app.steps.customerFacingBrochure();
	});
	$("body").on("click", "a.marketingAsset.available", function(){
		app.steps.marketingAsset();
	});
};

app.steps = {
	"confirmSolutionScope": function() {
		var stepId = "confirmSolutionScope";
		app.loadStep(stepId, function() {
			app.steps._set_stat(stepId);
			var $confirmSolutionScope = $("#" + stepId);
			$confirmSolutionScope.find("#project_id").append(app.currentProject.id);
			$confirmSolutionScope.find("#project_name").append(app.currentProject.name);
			$confirmSolutionScope.find("#project_desc").append(app.currentProject.description);
			$confirmSolutionScope.find("#project_package").append(app.currentProject.package);
			$confirmSolutionScope.find("#project_create_time").append(new Date(app.currentProject.create_time).Format("yyyy-MM-dd hh:mm:ss"));
		});
	},
	"businessPlan": function() {
		var stepId = "businessPlan";
		app.loadStep(stepId, function() {
			app.steps._set_stat(stepId);
			app.steps._upload_file(stepId, "business_plan_file");
		});
	},
	"onePagerOffering": function() {		
		var stepId = "onePagerOffering";
		app.loadStep(stepId, function() {
			app.steps._set_stat(stepId);
			app.steps._upload_file(stepId, "one_pager_offering_file");
		});
	},
	"proposalFramework": function(){
		var stepId = "proposalFramework";
		app.loadStep(stepId, function() {
			app.steps._set_stat(stepId);
			app.steps._upload_file(stepId, "proposal_framework_file");
		});
	},
	"demoScenarios": function(){
		var stepId = "demoScenarios";
		app.loadStep(stepId, function() {
			app.steps._set_stat(stepId);
			app.steps._upload_file(stepId, "demo_scenarios_file");
		});
	},
	"solutionBrief": function(){
		var stepId = "solutionBrief";
		app.loadStep(stepId, function() {			
			app.steps._set_stat(stepId);
		});
	},
	"deliveryContent": function(){
		var stepId = "deliveryContent";
		app.loadStep(stepId, function() {
			app.steps._set_stat(stepId);
			app.steps._upload_file(stepId, "delivery_content_file");
		});
	},
	"ecoHubStorefront": function(){
		var stepId = "ecoHubStorefront";
		app.loadStep(stepId, function() {
			app.steps._set_stat(stepId);
		});
	},
	"customerFacingBrochure": function(){
		var stepId = "customerFacingBrochure";
		app.loadStep(stepId, function() {
			app.steps._set_stat(stepId);
			app.steps._upload_file(stepId, "customer_facing_brochure_file");
		});
	},
	"marketingAsset": function(){
		var stepId = "marketingAsset";
		app.loadStep(stepId, function() {
			app.steps._set_stat(stepId);
		});
	},
	_upload_file: function(pageId, fileField) {
		var createFileDiv = function(file) {
			$("div#" + pageId + " .fileList").prepend(createUploadedFileDiv(file));
		};

		$.each(app.currentProject[fileField], function() {
			createFileDiv(this);
		});

		$("#submitFile").on("click", function(event) {
			if (!$("#uploadFile").val()) {
				alert("Please select a file first!")
				return false;
			}
		});

		$("#fileFrame").on("load", function() {
			var fileObj = {
				name: getFileName($("#uploadFile").val()),
				create_time: new Date().valueOf()
			};
			app.currentProject[fileField].push(fileObj);
			createFileDiv(fileObj);
		});
	},
	_set_stat: function(stepId) {
		var $select = $("<select style='font-size:12px;float:right;margin-top: 10px;'></select>");
		var status = app.currentProject.steps[stepId].status;
		$select.append("<option value='0' "+ (status==0?"selected":"") +">open</option>");
		$select.append("<option value='1' "+ (status==1?"selected":"") +">complete</option>");

		$select.on('change', function() {
			app.currentProject.steps[stepId].status = parseInt($select.val());
			app.steps._change_step_tree_complete_stat(stepId);
		});
		$("div#" + stepId + " h2").append($select);
	},
	_change_step_tree_complete_stat: function(stepId){
		if(app.currentProject.steps[stepId].status){
			$("a."+stepId).addClass("complete");
		} else {
			$("a."+stepId).removeClass("complete");
		}
	}
};

$(document).ready(function() {
	var bi = new BusyIndicator($(".content"));
	bi.show();
	$.ajax({
		url: "/data/projects.json",
		type: 'GET',
		dataType: "JSON",
		success: function(projects){
			app.projects = projects;
			app.init();
		}, 
		complete: function(){
			bi.hide();
		}
	});
});