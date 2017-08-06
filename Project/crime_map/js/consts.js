/**
 *
 * Created by brian on 7/22/17.
 */
// should be first file in htmp
(function () {

	var consts = window.consts = {};
	consts.width = 500;
	consts.height = 775;

	consts.HIDE_REGIONS = [];

	consts.CRIME_TYPE_GROUPED = [
		{
			name: 'Violent Crime',
			crime: [
				'ROBBERY',
				'ASSAULTS',
				'THREATS, HARASSMENT',
				'TRESPASS',
				'DRIVE BY (NO INJURY)',
			]
		},
		{name: 'Non-Violent Crime', crime: [
			'PROSTITUTION',
			'NUISANCE, MISCHIEF',
			'LIQUOR VIOLATIONS',
			'NUISANCE, MISCHIEF ',
			'LEWD CONDUCT',
			'SHOPLIFTING',
			'CAR PROWL',
			'MISCELLANEOUS MISDEMEANORS',
			'BURGLARY',
			'AUTO THEFTS',
		]},
		{
			name: 'Reported Activity',
			crime: [
				'PROWLER',
				'PERSON DOWN/INJURY',
				'HAZARDS',
				'HARBOR CALLS',
				'SUSPICIOUS CIRCUMSTANCES',
				'DISTURBANCES',
				'NARCOTICS COMPLAINTS',
				'PROPERTY - MISSING, FOUND',
			]
		},

		{name: 'Police Activity', crime: [
			'ACCIDENT INVESTIGATION',
			'MENTAL HEALTH',
			'PERSONS - LOST, FOUND, MISSING',
			'BEHAVIORAL HEALTH',
			'MOTOR VEHICLE COLLISION INVESTIGATION',
			'PROPERTY DAMAGE',
			'ANIMAL COMPLAINTS',
			'FALSE ALARMS',
			'FALSE ALACAD',
			'OTHER PROPERTY',
			'FRAUD CALLS',
			'WEAPONS CALLS',
			'OTHER VICE',
			'TRAFFIC RELATED CALLS',
			'ARREST',
			'BIKE',
			'PUBLIC GATHERINGS',
			'FAILURE TO REGISTER (SEX OFFENDER)',
		]},
	];
	
	consts.ALL_CRIME_TYPES = [];
	consts.CRIME_TYPE_GROUPED.forEach(function (group) {
		var crimes = group.crime;
		crimes.forEach(function (c) {
			consts.ALL_CRIME_TYPES.push(c);
		});
	});
	
    consts.projection = d3.geo.mercator()
        .scale(115000)
        // Center the Map in Seattle
        .center([-122.32, 47.605])
        .translate([consts.width / 2, consts.height / 2]);

	consts.SCALING_FACTOR = 1./100000;
})();

