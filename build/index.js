"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Right = exports.Left = void 0;
var Left = function (error) { return new Either(error, 'left'); };
exports.Left = Left;
var Right = function (result) { return new Either(result, 'right'); };
exports.Right = Right;
var Either = /** @class */ (function () {
    function Either(value, type) {
        this.value = value;
        this.type = type;
    }
    /**
     *
     *
     *
     */
    Either.prototype.isLeft = function () {
        return this.type === 'left';
    };
    /**
     *
     *
     *
     */
    Either.prototype.isRight = function () {
        return this.type === 'right';
    };
    /**
     *
     *
     *
     */
    Either.prototype.exists = function () {
    };
    /**
     *
     *
     *
     */
    Either.prototype.get = function () {
        return this.value;
    };
    /**
     *
     *
     *
     */
    Either.prototype.getOrElse = function (fallback) {
        return this.isLeft() ?
            fallback :
            this.get();
    };
    /**
     *
     *
     *
     */
    Either.prototype.orElse = function (otherEither) {
        return this.isLeft() ?
            otherEither :
            this;
    };
    /**
     *
     *
     *
     */
    Either.prototype.map = function (fn) {
        return this.isLeft() ?
            this :
            exports.Right(fn(this.get()));
    };
    /**
     *
     *
     *
     */
    Either.map = function (fn) {
        return function (either) {
            return either.map(fn);
        };
    };
    /**
     *
     *
     *
     */
    Either.prototype.lift = function () {
    };
    /**
     *
     *
     *
     */
    Either.prototype.liftN = function () {
    };
    /**
     *
     *
     *
     */
    Either.prototype.ap = function () {
    };
    /**
     *
     *
     *
     */
    Either.prototype.fold = function () {
    };
    /**
     *
     *
     *
     */
    Either.prototype.flatMap = function (fn) {
        return this.isLeft() ?
            this :
            fn(this.get());
    };
    /**
     *
     *
     *
     */
    Either.flatMap = function (fn) {
        return function (either) {
            return either.flatMap(fn);
        };
    };
    /**
     *
     *
     *
     */
    Either.prototype.then = function (fn) {
        if (this.isLeft()) {
            return this;
        }
        var result = fn(this.get());
        if (result instanceof Either) {
            return result;
        }
        return exports.Right(result);
    };
    /**
     *
     *
     *
     */
    Either.prototype.flatten = function () {
    };
    /**
     *
     *
     *
     */
    Either.prototype.filter = function () {
    };
    /**
     *
     *
     *
     */
    Either.prototype.filterNot = function () {
    };
    /**
     *
     *
     *
     */
    Either.prototype.contains = function () {
    };
    /**
     *
     *
     *
     */
    Either.prototype.swap = function () {
        var newType = this.isLeft() ?
            'right' :
            'left';
        this.type = newType;
    };
    /**
     *
     *
     *
     */
    Either.prototype.toArray = function () {
        return this.isLeft() ?
            [] :
            [this.get()];
    };
    /**
     *
     *
     *
     */
    Either.prototype.toSet = function () {
        return this.isLeft() ?
            new Set() :
            new Set().add(this.get());
    };
    /**
     *
     *
     *
     */
    Either.prototype.toString = function () {
        return this.isLeft() ?
            "Left(" + this.get() + ")" :
            "Right(" + this.get() + ")";
    };
    /**
     *
     *
     *
     */
    Either.prototype.toStr = function () {
        return this.toString();
    };
    /**
     *
     *
     *
     */
    Either.prototype.log = function () {
        console.log(this.toStr());
    };
    /**
     *
     *
     *
     */
    Either.prototype.logAndContinue = function () {
        console.log(this.toStr());
        return this;
    };
    /**
     *
     *
     *
     */
    Either.of = function (val, type) {
        return new Either(val, type);
    };
    return Either;
}());
