'use strict';

var expect = chai.expect;

describe('px', function() {

    describe('#init', function() {
        it('should throw an error when apiKey isn\'t provided', function() {

            expect(function() {
                px.init({ userId: 'test' })
            }).to.throw('6px: apiKey is required!');

        });
        it('should throw an error when userId isn\'t provided', function() {

            expect(function() {
                px.init({ apiKey: 'test' })
            }).to.throw('6px: userId is required!');

        });
        it('should throw an error called more than once', function() {

            px.init({ userId: 'userId', apiKey: 'apiKey' }); // call it once

            expect(function() { // call it twice
                px.init({ userId: 'userId', apiKey: 'apiKey' });
            }).to.throw('6px: Init must only be called once!');

        });
    });
});
