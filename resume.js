// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   resume.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: gfielder <marvin@42.fr>                    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2019/04/14 14:56:01 by gfielder          #+#    #+#             //
//   Updated: 2025/10/12 20:35:03 by rpapagna         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

//Requires jquery

// Centralized filter configuration
const FILTER_CONFIG = {
	work: ['engineering', 'deck-operations', 'refit-maintenance', 'management'],
	project: ['computer-science', 'web-development', 'security-crypto', 'graphics-games', 'academic', 'recreational', 'technical', 'automotive', 'electronics']
};

// Helper functions for tag management
const TagUtils = {
	// Convert display text to tag format
	textToTag: function(text) {
		return text.toLowerCase().replace(/\s+/g, '-');
	},
	
	// Check if element has matching tag
	hasTag: function(tagsString, targetTag) {
		if (!tagsString) return false;
		var tagArray = tagsString.split(',').map(t => t.trim());
		return tagArray.includes(targetTag);
	},
	
	// Get all tags from filter config
	getAllTags: function() {
		return [...FILTER_CONFIG.work, ...FILTER_CONFIG.project];
	}
};

var include_educational;
var show_work_history;
var show_projects;
var current_filter;
var custom_filter;

$(document).ready(function()
{
	include_educational = true;
	show_work_history = true;
	show_projects = true;
	current_filter = 'All Items';
	custom_filter = false;
	
	// Set up event listeners
	$('.expandable-section-header').click(ExpandableClick);
	$('.expandable-section-clicktoexpand').click(ExpandableClick);
	$('.expandable-section-clicktoexpand-gallery').click(ExpandableClick);
	
	// New filter system event listeners
	$('.tagsel-vertical').click(OnFilterSelect);
	$('#toggle-work').change(function() {
		show_work_history = this.checked;
		applyFilters();
	});
	$('#toggle-projects').change(function() {
		show_projects = this.checked;
		applyFilters();
	});
	$('#toggle-educational').change(function() {
		include_educational = this.checked;
		applyFilters();
	});
	
	$('.project-manual-hide').click(OnProjectHideClick);
	$('.job-entry-manual-hide').click(OnJobEntryHideClick);
	
	// Open the Projects Section by default.
	var proj = $('#projects-section');
	proj.children("#hidden-inline").html("Click to collapse...");
	proj.children("#expanded").css('display', 'block');
	$('#javascript-disabled').remove();
	
	// Initialize with all items shown
	applyFilters();
	
	// // Mobile navigation toggle
	// $('<button class="mobile-nav-toggle">☰</button>').insertBefore('#sidebar');
	// $('.mobile-nav-toggle').click(function() {
	//     $('#sidebar').toggleClass('active');
	//     $(this).toggleClass('active');
	// });
	
	// // Close sidebar when clicking outside on mobile
	// $(document).click(function(event) {
	//     if ($(window).width() <= 767) {
	//         if (!$(event.target).closest('#sidebar, .mobile-nav-toggle').length) {
	//             $('#sidebar').removeClass('active');
	//             $('.mobile-nav-toggle').removeClass('active');
	//         }
	//     }
	// });

	// Mobile navigation toggle
	$('<button class="mobile-nav-toggle"> ☰ </button>').insertBefore('#sidebar');
	$('.mobile-nav-toggle').click(function() {
		$('#sidebar').toggleClass('active');
	});

	// Close sidebar when clicking outside on mobile
	$(document).click(function(event) {
		if ($(window).width() <= 767) {
			if (!$(event.target).closest('#sidebar, .mobile-nav-toggle').length) {
				$('#sidebar').removeClass('active');
			}
		}
	});

	// Close sidebar on link click (mobile)
	$('#sidebar a').click(function() {
		if ($(window).width() <= 767) {
			$('#sidebar').removeClass('active');
		}
	});

	// Theme toggle with prefers-color-scheme support
	const THEME_STORAGE_KEY = 'portfolio-theme';
	const themeToggle = $('#theme-toggle');
	const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

	function applyTheme(theme, shouldStore) {
		$('body').removeClass('theme-light theme-dark').addClass(`theme-${theme}`);
		if (shouldStore) {
			localStorage.setItem(THEME_STORAGE_KEY, theme);
		}
		if (themeToggle.length) {
			const isDark = theme === 'dark';
			themeToggle.attr('aria-pressed', isDark);
			themeToggle.text(isDark ? 'Light mode' : 'Dark mode');
		}
	}

	function getInitialTheme() {
		const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
		if (storedTheme) {
			return storedTheme;
		}
		return mediaQuery.matches ? 'dark' : 'light';
	}

	applyTheme(getInitialTheme(), false);

	if (themeToggle.length) {
		themeToggle.on('click', function() {
			const isDark = $('body').hasClass('theme-dark');
			applyTheme(isDark ? 'light' : 'dark', true);
		});
	}

	if (mediaQuery && typeof mediaQuery.addEventListener === 'function') {
		mediaQuery.addEventListener('change', function(event) {
			if (!localStorage.getItem(THEME_STORAGE_KEY)) {
				applyTheme(event.matches ? 'dark' : 'light', false);
			}
		});
	}
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

function OnFilterSelect(eventObject)
{
	$('.tagsel-vertical').removeClass('active');
	$(eventObject.target).addClass('active');
	
	var filterText = $(eventObject.target).text();
	var filterTag = $(eventObject.target).data('tag');
	var category = $(eventObject.target).data('category');
	
	if (filterText === 'All Items') {
		ShowAllItems();
	} else {
		ShowItemsWithFilter(filterText, filterTag, category);
	}
}

function ShowAllItems()
{
	current_filter = 'All Items';
	$('.job-entry').css('display', show_work_history ? 'block' : 'none');
	$('.project').css('display', show_projects ? 'block' : 'none');
	custom_filter = false;
	UpdateCurrentFilterText();
}

function ShowItemsWithFilter(filterText, filterTag, category)
{
	current_filter = filterText;
	
	// If filterTag not provided, convert from text
	if (!filterTag) {
		filterTag = TagUtils.textToTag(filterText);
	}
	
	// Filter work history
	if (show_work_history) {
		$('.job-entry').each(function() {
			var tags = $(this).data('tags');
			var shouldShow = TagUtils.hasTag(tags, filterTag);
			$(this).css('display', shouldShow ? 'block' : 'none');
		});
	} else {
		$('.job-entry').css('display', 'none');
	}
	
	// Filter projects
	if (show_projects) {
		$('.project').each(function() {
			var tags = $(this).data('tags');
			var shouldShow = TagUtils.hasTag(tags, filterTag);
			
			if (shouldShow) {
				// Check educational filter
				var projTags = $(this).children("#project-tags").html();
				if (projTags && projTags.includes('Educational') && !include_educational) {
					shouldShow = false;
				}
			}
			
			$(this).css('display', shouldShow ? 'block' : 'none');
		});
	} else {
		$('.project').css('display', 'none');
	}
	
	custom_filter = false;
	UpdateCurrentFilterText();
}

function applyFilters()
{
	if (current_filter === 'All Items') {
		ShowAllItems();
	} else {
		var activeFilter = $('.tagsel-vertical.active');
		if (activeFilter.length) {
			var filterText = activeFilter.text();
			var filterTag = activeFilter.data('tag');
			var category = activeFilter.data('category');
			ShowItemsWithFilter(filterText, filterTag, category);
		}
	}
	if (typeof reinitializeGalleries === 'function') {
		reinitializeGalleries();
	}
}

function UpdateCurrentFilterText()
{
	if (custom_filter) {
		$('#current-filter').html('*Custom Filter*');
	} else {
		var displayText = current_filter;
		if (!show_work_history && !show_projects) {
			displayText += ' (Nothing to show)';
		} else if (!show_work_history) {
			displayText += ' (Projects only)';
		} else if (!show_projects) {
			displayText += ' (Work only)';
		}
		if (!include_educational) {
			displayText += ', Excluding Educational';
		}
		$('#current-filter').html(displayText);
	}
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
	custom_filter = true;
	UpdateCurrentFilterText();

}
