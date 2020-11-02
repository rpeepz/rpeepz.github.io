// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   resume.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: gfielder <marvin@42.fr>                    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2019/04/14 14:56:01 by gfielder          #+#    #+#             //
//   Updated: 2019/06/26 15:15:59 by gfielder         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

//Requires jquery

var include_educational;
var current_filter;
var custom_filter;

$(document).ready(function()
{
	include_educational = true;
	current_filter = 'All Projects';
	custom_filter = false;
	$('#educational-tagsel-checkbox').change(function() {
		include_educational = this.checked;
		if (current_filter == 'All Projects')
			ShowAllProjects();
		else
			ShowProjectsWithTag(current_filter);
		UpdateCurrentFilterText();
	});
	//Set up event listeners
	$('.expandable-section-header').click(ExpandableClick);
	$('.expandable-section-clicktoexpand').click(ExpandableClick);
	$('.expandable-section-clicktoexpand-gallery').click(ExpandableClick);
	$('.tagsel').not('#tagsel-all').click(OnTagSelect);
	$('.tagsel-vertical').not('#tagsel-all').click(OnTagSelect);
	$('.proj-tagsel').not('#tagsel-all').click(OnTagSelect);
	$('#tagsel-all').click(ShowAllProjects);
	$('.project-manual-hide').click(OnProjectHideClick);
	$('.job-entry-manual-hide').click(OnJobEntryHideClick);
	//$('#variable-intro-selector').change(OnVariableIntroSelect);
	//Open the Projects Section by default.
	var proj = $('#projects-section');
	proj.children("#hidden-inline").html("Click to collapse...");
	proj.children("#expanded").css('display', 'block');
	$('#javascript-disabled').remove();
});

function ExpandableClick(eventObject)
{
	var expanded = $(eventObject.target).children("#expanded");
	var hidden = $(eventObject.target).children("#hidden");
	var hiddeninline = $(eventObject.target).children("#hidden-inline");

	if (expanded.length == 0)
	{
		//Clicked an inner element
		expanded = $(eventObject.target.parentElement).children("#expanded");
		hidden = $(eventObject.target.parentElement).children("#hidden");
		hiddeninline = $(eventObject.target.parentElement).children("#hidden-inline");
	}
	if (expanded.css('display') == "none")
	{
		/*Is hidden, expand*/
		expanded.css('display', 'block');
		hidden.css('display', 'none');
		hiddeninline.html("Click to collapse...");
	}
	else
	{
		/*Is expanded, hide*/
		expanded.css('display', 'none');
		hidden.css('display', 'block');
		hiddeninline.html("Click to expand...");
	}
}

function ShowAllProjects()
{
	current_filter = 'All Projects';
	var projs = $(".project");
	var tags;
	projs.each(function(index, element) {
		tags=$(element).children("#project-tags").html();
		if (tags.includes('Media') && include_educational == false)
			$(element).css('display', 'none');
		else
			$(element).css('display', 'block');
	});
	custom_filter = false;
	UpdateCurrentFilterText();
}

function UpdateCurrentFilterText()
{
	if (custom_filter)
	{
		$('#current-filter').html('*Custom*');
	}
	else
	{
		if (include_educational)
			$('#current-filter').html(current_filter + ', Include Media');
		else
			$('#current-filter').html(current_filter);
	}
}

function OnTagSelect(eventObject)
{
	ShowProjectsWithTag($(eventObject.target).html(), eventObject.shiftKey);
}

function ShowProjectsWithTag(tag, addOnly = false)
{
	current_filter = tag;
	var projs = $(".project");
	var tags;
	projs.each(function(index, element) {
		tags=$(element).children("#project-tags").html();
		if (tags.includes(tag))
		{
			if (tags.includes('Media') && include_educational == false)
				$(element).css('display', 'none');
			else
				$(element).css('display', 'block');
		}
		else if (!addOnly)
			$(element).css('display', 'none');
	});
	custom_filter = addOnly;
	UpdateCurrentFilterText();
}

function OnProjectHideClick(eventObject)
{
	proj = $(eventObject.target.parentElement.parentElement);
	proj.css('display', 'none');
	custom_filter = true;
	UpdateCurrentFilterText();
}

function OnJobEntryHideClick(eventObject)
{
	job = $(eventObject.target.parentElement.parentElement);
	job.css('display', 'none');
	$('#job-filter-text').css('display', 'block');
}


