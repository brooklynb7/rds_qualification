var app = {};

app.init = function() {
	Path.map("#/index").to(function() {
		$(".project_name").html("");
		app.loadPage("index");
	});

	Path.map("#/project/:projectId").to(function() {
		try{
			app.currentProject = app.projects[this.params['projectId']];
			$(".project_name").html(app.currentProject.name);
			app.loadPage("project", function(){
				$.each(app.currentProject.steps, function(stepId, stepObj){
					if(stepObj.status == 1){					
						$("a."+stepId).addClass("complete");
					}
				});
				app.steps.confirmSolutionScope();
				app.q_gates.check_q_gates_status();
			});
		} catch(e){
			window.location.href = '/';
		}
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

	app.bindCreateProjectEvent();
	app.bindQGatesEvent();
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
		var complete_steps = _.filter(this.steps, function(step) {
			return step.status == 1;
		});
		if(complete_steps.length == 10){
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
	var $tr = $("<tr></tr>");
	$tr.append("<td><a href='#/project/"+ project.id +"'>"+ project.name +"</a></td>");
	$tr.append("<td>"+ complete_steps.length/10*100 +" %</td>");
	$tr.append("<td>"+ "" +"</td>");
	$tr.append("<td>"+ project.package +"</td>");
	$tr.append("<td>"+ new Date(project.create_time).Format("yyyy-MM-dd hh:mm:ss") +"</td>");
	return $tr;
};

app.bindCreateProjectEvent = function(){
	$("body").on("click", "button#createBtn", function(){
		if($("#inputProjectName").val()){
			app.createProject($("#inputProjectName").val(), $("#inputProjectDesc").val());
			$("#inputProjectName").val("") && $("#inputProjectDesc").val("");
			$('#myModal').modal('hide');
		} else {
			alert("Please fill the name");
		}
	});
	
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
			if($("#uploadFile").val()){				
				var fileObj = {
					name: getFileName($("#uploadFile").val()),
					create_time: new Date().valueOf()
				};
				app.currentProject[fileField].push(fileObj);
				createFileDiv(fileObj);
			}
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
			if(_.contains(["confirmSolutionScope", "businessPlan", "onePagerOffering"], stepId)){
				app.q_gates.check_business_plan_steps_status();
			} else if(_.contains(["proposalFramework", "demoScenarios", "solutionBrief", "deliveryContent"], stepId)){
				app.q_gates.check_evaluate_offering_steps_status();
			} else if(_.contains(["ecoHubStorefront", "customerFacingBrochure", "marketingAsset"], stepId)){
				app.q_gates.check_quality_gtm_asset_steps_status();
			}
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

app.bindQGatesEvent = function(){
	$("body").on("click", ".q_gate_business_plan .q_gate_stat .review .apply", function(){
		app.q_gates.apply_business_plan_review();
	});
	$("body").on("click", ".q_gate_business_plan .q_gate_stat span.approve a.approve", function(){
		app.q_gates.approve_business_plan();
	});
	$("body").on("click", ".q_gate_business_plan .q_gate_stat span.approve a.reject", function(){
		app.q_gates.reject_business_plan();
	});

	$("body").on("click", ".q_gate_evaluate_offering .q_gate_stat .review .apply", function(){
		app.q_gates.apply_evaluate_offering_review();
	});
	$("body").on("click", ".q_gate_evaluate_offering .q_gate_stat span.approve a.approve", function(){
		app.q_gates.approve_evaluate_offering();
	});
	$("body").on("click", ".q_gate_evaluate_offering .q_gate_stat span.approve a.reject", function(){
		app.q_gates.reject_evaluate_offering();
	});

	$("body").on("click", ".q_gate_quality_gtm_asset .q_gate_stat .review .apply", function(){
		app.q_gates.apply_quality_gtm_asset_review();
	});
	$("body").on("click", ".q_gate_quality_gtm_asset .q_gate_stat span.approve a.approve", function(){
		app.q_gates.approve_quality_gtm_asset();
	});
	$("body").on("click", ".q_gate_quality_gtm_asset .q_gate_stat span.approve a.reject", function(){
		app.q_gates.reject_quality_gtm_asset();
	});
};

app.q_gates = {
	check_business_plan_steps_status: function() {
		var steps = app.currentProject.steps;
		if (steps.confirmSolutionScope.status == 1 &&
			steps.businessPlan.status == 1 &&
			steps.onePagerOffering.status == 1) {
			app.q_gates.set_business_plan_stat(2);
		} else {
			app.q_gates.set_business_plan_stat(1);
		}
	},
	check_evaluate_offering_steps_status: function() {
		var steps = app.currentProject.steps;
		if (steps.proposalFramework.status == 1 &&
			steps.demoScenarios.status == 1 &&
			steps.solutionBrief.status == 1 && 
			steps.deliveryContent.status == 1) {
			app.q_gates.set_evaluate_offering_stat(2);
		} else {
			app.q_gates.set_evaluate_offering_stat(1);
		}
	},
	check_quality_gtm_asset_steps_status: function() {
		var steps = app.currentProject.steps;
		if (steps.ecoHubStorefront.status == 1 &&
			steps.customerFacingBrochure.status == 1 &&
			steps.marketingAsset.status == 1) {
			app.q_gates.set_quality_gtm_asset_stat(2);
		} else {
			app.q_gates.set_quality_gtm_asset_stat(1);
		}
	},
	check_q_gates_status: function(stat){
		var q_gates = app.currentProject.q_gates;
		app.q_gates._change_business_plan_ui_by_status(q_gates.businessPlan.status);
		app.q_gates._change_evaluate_offering_ui_by_status(q_gates.evaluateOffering.status);
		app.q_gates._change_quality_gtm_asset_ui_by_status(q_gates.qualityGTMAsset.status);
	},

	apply_business_plan_review: function(){
		app.q_gates.set_business_plan_stat(3);
	},
	approve_business_plan: function(){
		app.q_gates.set_business_plan_stat(4);
		app.q_gates.set_evaluate_offering_stat(1);
	},
	reject_business_plan: function(){		
		app.q_gates.set_business_plan_stat(2);
	},

	apply_evaluate_offering_review: function(){
		app.q_gates.set_evaluate_offering_stat(3);
	},
	approve_evaluate_offering: function(){
		app.q_gates.set_evaluate_offering_stat(4);
		app.q_gates.set_quality_gtm_asset_stat(1);
	},
	reject_evaluate_offering: function(){		
		app.q_gates.set_evaluate_offering_stat(2);
	},

	apply_quality_gtm_asset_review: function(){
		app.q_gates.set_quality_gtm_asset_stat(3);
	},
	approve_quality_gtm_asset: function(){
		app.q_gates.set_quality_gtm_asset_stat(4);
	},
	reject_quality_gtm_asset: function(){		
		app.q_gates.set_quality_gtm_asset_stat(2);
	},

	set_business_plan_stat: function(stat) {
		app.currentProject.q_gates.businessPlan.status = stat;
		app.q_gates._change_business_plan_ui_by_status(stat);
	},
	set_evaluate_offering_stat: function(stat) {
		app.currentProject.q_gates.evaluateOffering.status = stat;
		app.q_gates._change_evaluate_offering_ui_by_status(stat);
	},
	set_quality_gtm_asset_stat: function(stat) {
		app.currentProject.q_gates.qualityGTMAsset.status = stat;
		app.q_gates._change_quality_gtm_asset_ui_by_status(stat);
	},
	_change_business_plan_ui_by_status: function(stat){
		app.q_gates._change_ui_by_status("business_plan", stat);
	},
	_change_evaluate_offering_ui_by_status: function(stat){
		app.q_gates._change_ui_by_status("evaluate_offering", stat);
		if(stat != 0){
			app.q_gates._set_steps_available("evaluate_offering");
		}
	},
	_change_quality_gtm_asset_ui_by_status: function(stat){
		app.q_gates._change_ui_by_status("quality_gtm_asset", stat);
		if(stat != 0){
			app.q_gates._set_steps_available("quality_gtm_asset");
		}
	},
	_change_ui_by_status: function(q_gate,stat){		
		$(".q_gate_"+ q_gate +" .q_gate_stat>span").addClass("hide");
		$(".q_gate_"+ q_gate +" .q_gate_stat>span." + app.q_gates._convent_status_code(stat)).removeClass("hide");
	},
	_set_steps_available: function(q_gate){
		$(".q_gate_"+ q_gate +" a.list-group-item").addClass("available");
	},
	_convent_status_code: function(code) {
		var status = "";
		switch (code) {
			case 0:
				status = 'unavailable';
				break;
			case 1:
				status = 'available';
				break;
			case 2:
				status = 'review';
				break;
			case 3:
				status = 'approve';
				break;
			case 4:
				status = 'pass';
				break;
			default:
				break;
		}

		return status;
	}
};

app.createProject = function(name, desc){
	var create_time = new Date().valueOf();
	var id = "new_qualification_" + create_time;
	var projectJson = {
		"id": id,
		"name": name,
		"description": desc,
		"complete_steps": [],
		"current_step": 1,
		"package": "rds",
		"templates": [],
		"business_plan_file": [],
		"one_pager_offering_file": [],
		"proposal_framework_file": [],
		"demo_scenarios_file": [],
		"delivery_content_file": [],
		"customer_facing_brochure_file": [],
		"q_gates": {
			"businessPlan": {
				"status": 1
			},
			"evaluateOffering": {
				"status": 0
			},
			"qualityGTMAsset": {
				"status": 0
			}
		},
		"steps": {
			"confirmSolutionScope": {
				"status": 0
			},
			"businessPlan": {
				"status": 0
			},
			"onePagerOffering": {
				"status": 0
			},
			"proposalFramework": {
				"status": 0
			},
			"demoScenarios": {
				"status": 0
			},
			"solutionBrief": {
				"status": 0
			},
			"deliveryContent": {
				"status": 0
			},
			"ecoHubStorefront": {
				"status": 0
			},
			"customerFacingBrochure": {
				"status": 0
			},
			"marketingAsset": {
				"status": 0
			}
		},
		"create_time": create_time
	};
	app.projects[id] = projectJson;
	var $tr = app.createProjectRow(app.projects[id]);
	$("#ongoing_projects").append($tr);
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