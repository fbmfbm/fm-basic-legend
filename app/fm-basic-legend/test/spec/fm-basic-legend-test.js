describe('fm-basic-legende units tests', function(){

	var $compile, $rootScope;
	var sldMock;

	directivTemplate = '<fm-basic-legend sld="sldMock" title="Un titre">Un test</fm-basic-legend>';

	beforeEach(module('fmBasicLegend'));

	beforeEach(inject(function(_$compile_, _$rootScope_){

		$compile = _$compile_;
		$rootScope = _$rootScope_
	}));

	beforeEach(function(){

		sldMock = '<?xmlversion="1.0"encoding="ISO-8859-1"?><StyledLayerDescriptor><NamedLayer><Name>Simplepoint</Name><UserStyle><Title>GeoServerSLDCookBook:Simplepoint</Title><FeatureTypeStyle><Rule><PointSymbolizer><Graphic><Mark><WellKnownName>circle</WellKnownName><Fill><CssParametername="fill">#FF0000</CssParameter></Fill></Mark><Size>6</Size></Graphic></PointSymbolizer></Rule></FeatureTypeStyle></UserStyle></NamedLayer></StyledLayerDescriptor>';
		//sldMock = [{title:"Un titre"}];

	})


	it('Should test the scope of the directive ', function(){

		var $scope = $rootScope.$new();
		var $element = $compile(directivTemplate)($scope);

		expect($element.html()).toContain('class="fm-basic-legend"');

		expect($element.$scope)

	});

	it('should scope sldMock to sld in $scope', function(){

		var $parent = $rootScope.$new();
		$parent.sldMock = sldMock;
		var $element = $compile(directivTemplate)($parent);
		var $directivScope = $element.scope();

		var sldJson = $.xml2json($directivScope.sld);
		expect($directivScope.sld).toBeDefined();

	});


});
