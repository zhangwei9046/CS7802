/**
 * 
 * Created by brian on 7/22/17.
 */
(function () {

	// "Imports"
	var CRIME_KEY = 'Event Clearance Group';
	var consts = window.consts;
	var CRIME_TYPE_GROUPED = consts.CRIME_TYPE_GROUPED;
	var projection = consts.projection;
	var crimeUI = window.sharedData.crimeUI;
	
	function crimeTypeToClass(crimeType) {
		var r = crimeType.replace(/[^a-zA-Z]/g, '')

		return r
	}

	function processDots(data) {
		return data.map(function (item) {
			return {
				crimeType: item[CRIME_KEY],
				loc: [item['Longitude'], item['Latitude']],
			};
		})
	}

	function getGroupCrimeCount(crimeCounts, crimeTypes) {
		var count = 0;
		crimeTypes.forEach(function (crimeType) {
			count += crimeCounts[crimeType];
		});
		return count;
	}

	var renderPoliceDots = null;
	
	// set on init
	var dotLayer;

	function renderFilterPoliceDotsUI(data) {
		var crimeCounts = {};
		consts.ALL_CRIME_TYPES.forEach(function (crimeType) {
			crimeCounts[crimeType] = 0;
		});
		data.forEach(function (d) {
			var crime = d[CRIME_KEY];
			crimeCounts[crime] += 1;
		});

		var rootEl = document.getElementById('crime-accordion');

		CRIME_TYPE_GROUPED.forEach(function (crimeCategory) {
			var categoryName = crimeCategory.name;
			var crimeTypes = crimeCategory.crime;
			var crimeGroupContainer = document.createElement('div');
			crimeGroupContainer.className += ' card';
			var crimeGroupHeader = document.createElement('div');
			var groupCrimeCount = getGroupCrimeCount(crimeCounts, crimeTypes);
			// crimeGroupHeader.innerText = categoryName + ' (' + groupCrimeCount + ')';
			var crimeGroupHeaderCategoryId = crimeTypeToClass(categoryName);
			crimeGroupHeader.innerHTML =
				`<h5 class="mb-0">
					<a data-toggle="collapse" data-parent="#crime-accordion" 
					   href="#${crimeGroupHeaderCategoryId}" 
					   aria-expanded="true" aria-controls="${crimeGroupHeaderCategoryId}">
						${categoryName} (${groupCrimeCount})
					</a>
				</h5>`;
			crimeGroupHeader.className += ' card-header';
			crimeGroupHeader.setAttribute('role', 'tab');
			crimeGroupContainer.appendChild(crimeGroupHeader);
			// var crimeGroupTypesContainer = document.createElement('div');
			// crimeGroupTypesContainer.className += ' crime-group-types';
			var options = [];

			var groupOptions = document.createElement('small');
			var displaySpan = document.createElement('span')
			displaySpan.innerText = 'Display:';
			groupOptions.appendChild(displaySpan);

			var checkAllLink = document.createElement('a');
			checkAllLink.innerText = '(all)';
			checkAllLink.setAttribute('href', '#');
			checkAllLink.className += ' check-all-link';

			var uncheckAllLink = document.createElement('a');
			uncheckAllLink.innerText = '(none)';
			uncheckAllLink.setAttribute('href', '#');

			checkAllLink.addEventListener('click', function () {
				options.forEach(function (option) {
					if (!option.checked) {
						option.dispatchEvent(new MouseEvent('click', {}));
					}
				});
			});
			uncheckAllLink.addEventListener('click', function () {
				options.forEach(function (option) {
					if (option.checked) {
						option.dispatchEvent(new MouseEvent('click', {}));
					}
				});
			});

			groupOptions.appendChild(checkAllLink);
			groupOptions.appendChild(uncheckAllLink);

			// crimeGroupContainer.appendChild(groupOptions);
            //
			var crimeTypeListContainer = document.createElement('div');
			crimeTypeListContainer.className += ' collapse';
			crimeTypeListContainer.id = crimeGroupHeaderCategoryId;
			crimeTypeListContainer.setAttribute('role', 'tabpanel');
			var crimeTypeListContainerCardBlock = document.createElement('div');
			crimeTypeListContainerCardBlock.className += ' card-block';
			crimeTypeListContainerCardBlock.appendChild(groupOptions);
			crimeTypeListContainer.appendChild(crimeTypeListContainerCardBlock);

			crimeTypes.forEach(function(crime_type) {
				if (crime_type == '') {
				}
				var option = document.createElement('input');
				options.push(option);
				var label = document.createElement('label');
				var crimeTypeContainer = document.createElement('div');

				crimeTypeContainer.appendChild(option);
				crimeTypeContainer.appendChild(label);
				var crimeCount = crimeCounts[crime_type];
				label.innerText = crime_type + ' (' + crimeCount + ')';
				option.setAttribute('type', 'checkbox');
				option.checked = true;
				option.addEventListener('click', function () {
					var className = crimeTypeToClass(crime_type);
					var isChecked = option.checked;
					crimeUI.showCrimes[crime_type] = isChecked;
					var dotsToManipulate = document.getElementsByClassName(className);
					var el;
					for(var i = 0; i < dotsToManipulate.length; i++) {
						el = dotsToManipulate[i];
						if (isChecked) { // then display them
							el.style.display = 'block'
						} else { // else don't
							el.style.display = 'none';
						}
					}
					crimeHousingScatter.drawScatter();

				});
				crimeTypeListContainerCardBlock.appendChild(crimeTypeContainer);
			});

			crimeGroupContainer.appendChild(crimeTypeListContainer);
			// crimeGroupContainer.appendChild(crimeGroupTypesContainer);
			rootEl.appendChild(crimeGroupContainer);
			
		});
	}

	function init(g) {
		dotLayer = g.append('g')
			.classed('dot-layer', true);
	}
	
	
	renderPoliceDots = function (data) {
		var dots = processDots(data);
		dotLayer.selectAll('circle')
			.data(dots)
			.enter()
			.append('circle')
			.attr('class', function (d) {
				return 'crime-dot dot ' + crimeTypeToClass(d.crimeType);
			})
			.attr('cx', function (d) {
				var loc = d.loc;
				return projection(loc)[0];
			})
			.attr('cy', function (d) {
				var loc = d.loc;
				return projection(loc)[1];
			})
			.attr('r', '1px')
			.attr('fill', 'red')
	};


	
	// "exports"
	var p911 = window.p911 = {};
	p911.init = init;
	p911.renderFilterPoliceDotsUI = renderFilterPoliceDotsUI;
	p911.renderPoliceDots = renderPoliceDots;


})();

