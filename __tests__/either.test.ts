import { Left } from './../src/index';

describe("Either", () => {

    test("map", () => {
        expect(Left(42).map(val => val * 5)).toStrictEqual(Left(42));
    });

});
