describe('fm-basic-legende units tests', function(){

	var $compile, $rootScope;

	beforeEach(module('fmBasicLegend'));

	beforeEach(inject(function(_$compile_, _$rootScope_){

		$compile = _$compile_;
		$rootScope = _$rootScope_
	}));

	var directivTemplate = '<fm-basic-legend sld="sldStyle"></fm-basic-legend>';

	it('Should test the scope of the directive ', function(){

		var $scope = $rootScope.$new();
		var $element = $compile(directivTemplate)($scope);


		expect($element.html()).toContain('class="fm-basic-legend"');



	});


});
