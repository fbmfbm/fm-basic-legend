'use strict';

describe('Service: Sdl', function () {

  // load the service's module
  beforeEach(module('fmBasicLegendApp'));

  // instantiate service
  var Sdl;
  beforeEach(inject(function (_Sdl_) {
    Sdl = _Sdl_;
  }));

  it('should do something', function () {
    expect(!!Sdl).toBe(true);
  });

});
