export const Left = <T>(error: T): Left<T> => new Either(error, 'left');
export const Right = <T>(result: T): Right<T> => new Either (result, 'right');

export type Left<A> = Either<A>;
export type Right<A> = Either<A>;

class Either<A>{

    private value: A;
    private type: 'left' | 'right';

    /**
     * Construct an instance of an Either.
     */
    constructor(value: A, type: 'left' | 'right') {
        this.value = value;
        this.type = type;
    }

    /**
     * Returns true if the instance is a Left. Returns false otherwise.
     */
    isLeft() {
        return this.type === 'left';
    }

    /**
     * Returns true if the instance is a Right. Returns true otherwise.
     */
    isRight() {
        return this.type === 'right';
    }

    /**
     *
     *
     *
     */
    exists() {

    }

    /**
     *
     *
     *
     */
    get() {
        return this.value;
    }

    /**
     * Returns the underlying value if it's a Right. Returns the
     * provided argument otherwise.
     */

    getOrElse<B>(fallback: B) {
        return this.isLeft() ?
            fallback :
            this.get();
    }

    /**
     * Returns the current instance if it's a Right. Returns the
     * provided Either argument otherwise.
     *
     * @remarks Useful for chaining successive calls to return the first
     * Right in the chain of orElses.
     *
     * @example
     * ```
     * const firstRightSidedEither = fnReturnsEither
     *     .orElse(fn2ReturnsEither())
     *     .orElse(fn3ReturnsEither())
     *     .orElse(fn4ReturnsEither())
     * ```
     */

    orElse<B>(otherEither: Either<B>): Either<A> | Either<B> {
        return this.isLeft() ?
            otherEither :
            this;
    }

    /**
     * Transforms the underlying value if the instance is a Right by
     * applying the provided function to the underlying value, returning
     * the transformed value in a Right Either.
     * Returns the instance otherwise.
     *
     * @remarks Prefer this to `flatMap` when the provided function does
     * not return an Either.
     */
    map<B>(fn: (val: A) => B): Either<A> | Either<B> {
        return this.isLeft() ?
            this :
            Right(fn(this.get()));
    }

    /**
     * A static version of map. Useful for lifting functions of type
     * (val: A) => B to be a function of type
     * (val: Either<A>) => Either<B>.
     *
     * A curried version of map. First accepts the transformation
     * function, and returns a function that accepts the Either.
     *
     * @example
     * ```
     * const appendToString = (val: string) => val + "@gmail.com";
     *
     * // Eithers (possibly returned by other functions):
     * const either = Right("johnsmith");
     * const otherEither = Left("Error: name not entered");
     *
     * // Create a version of appendToString that works on values that
     * // are Eithers
     * const appendToEitherString = Either.map(appendToString);
     *
     * const eitherEmailOrError = appendToEitherString(either);
     * // eitherEmailOrError => Right("johnsmith@gmail.com")
     *
     * const eitherEmailOrError2 = appendToEitherString(otherEither);
     * // eitherEmailOrError2 => Left("Error: name not entered");
     * ```
     */
    static map<B, A>(
        fn: (val: A) => B
    ): (
        either: Either<A>
    ) => Either<A> | Either<B> {
        return (either: Either<A>): Either<A> | Either<B> => {
            return either.map(fn);
        }
    }

    /**
     *
     *
     *
     */
    lift() {

    }

    /**
     *
     *
     *
     */
    liftN() {

    }

    /**
     *
     *
     *
     */
    ap() {

    }

    /**
     *
     *
     *
     */
    fold() {

    }

    /**
     * Transforms and returns the underlying value if the instance is a
     * Right by applying the provided function to the underlying value.
     * Returns a Left otherwise.
     *
     * @remarks Prefer this to `map` when the provided function returns
     * an Either.
     *
     * @remarks If unsure of which method to use between `map`,
     * `flatMap`, and `then`, `then` should always work.
     */
    flatMap<B>(fn: (val: A) => Either<B>): Either<A> | Either<B> {
        return this.isLeft() ?
            this :
            fn(this.get())
    }

    /**
     * A static version of flatMap. Useful for lifting functions of type
     * (val: A) => Either<B> to be a function of type
     * (val: Either<A>) => Either<B>
     *
     * A curried version of flatMap. First accepts the transformation
     * function, then the Either.
     *
     * @example
     * ```
     * const appendIfValid = (val: string): Either<string> => {
     *    if (val.length > 2) {
     *         const newVal = val + "@gmail.com";
     *         return Right(newVal);
     *     } else {
     *         return Left(
     *             new Error("value is too short to be an email")
     *         );
     *     }
     * }
     *
     * // Eithers - possibly returned by other parts of your code base.
     * const either = Right("johnsmith");
     * const otherEither = Left(new Error("invalid username"));
     *
     * // Create a version of appendIfValid that works on Either<string>
     * const appendToEitherStrIfValid = Either.flatMap(appendIfValid);
     *
     * const  = appendToEitherStrIfValid(opt);
     * // emailAddressOrError => Some("johnsmith@gmail.com")
     *
     * const emailAddressOrError2 = appendToEitherStrIfValid(otherOpt);
     * // emailAddressOrError2 => None()
     *
     * // This next line is equivalent to the above.
     * const emailAddressOrError3 = Either.flatMap(appendIfValid)(opt);
     * ```
     */
    static flatMap<B, A>(
        fn: (val: A) => Either<B>
    ): (
        either: Either<A>
    ) => Either<B> | Either<A> {
        return (either: Either<A>) => {
            return either.flatMap(fn);
        }
    }

        /**
     * Usable in place of both map and flatMap.
     * Accepts a function that returns either an Either or non Either
     * value.
     *
     * Always returns an Either.
     *
     * Makes the Either class into a thenable.
     *
     * If the instance is a None, a None is returned.
     * If the provided function returns an Either, the result of
     * applying the function to the underlying value is returned.
     * If the provided function returns a non Either, the result of
     * applying the function to the underlying value is lifted into an
     * Either and returned.
     *
     * @example
     * ```
     * const myEither = Some(10);
     *
     * const maybeDouble = (val: number): Either<number> => {
     *     Math.random() > .5 ?
     *         Right(val * 2) :
     *         Left("Just not your day :(. Try again next time");
     * }
     *
     * const alwaysDouble = (val: number): number => val * 2;
     *
     * // function calls can be chained with .then regarless if the
     * // functions passed to then return an Either or non Either value.
     * const eitherErrorOrValue = myEither.then(maybeDouble)
     *                                    .then(alwaysDouble);
     * ```
     */
    then<B>(fn: (val: A) => B | Either<B>): Either<A> | Either<B> {
        if (this.isLeft()) {
            return this;
        }

        const result = fn(this.get())

        if (result instanceof Either) {
            return result;
        }

        return Right(result);
    }

    /**
     *
     *
     *
     */
    flatten() {

    }

    /**
     *
     *
     *
     */
    filter() {

    }

    /**
     *
     *
     *
     */
    filterNot() {

    }

    /**
     * Returns true if the instance's underlying value equals the
     * provided argument. Returns false otherwise.
     *
     * @remarks Accepts an optional equality function for comparing two
     * values for when the underlying value is not a primitive. By
     * default this equality function is JavaScript's ===.
     */
    contains(
        value: A,
        equalityFn: (
            valOne: A,
            valTwo: A
        ) => boolean = (
            valOne,
            valTwo
        ) => valOne === valTwo
    ): boolean {
        return equalityFn(this.get(), value);
    }

    /**
     * Swaps the type of the instance and returns the now swapped instance.
     * If it's a Left, it becomes a Right.
     * If it's Right, it becomes a Left.
     */
    swap() {
        const newType = this.isLeft() ?
            'right' :
            'left';

        this.type = newType;

        return this;
    }

    /**
     * Returns an Array with the underlying value when the instance is a
     * Right. Returns an empty Array otherwise.
     */
    toArray(): [] | [A] {
        return this.isLeft() ?
            [] :
            [this.get()];
    }

    /**
     * Returns a Set containing the underlying value when the instance
     * is a Right. Returns an empty Set otherwise.
     */
    toSet() {
        return this.isLeft() ?
            new Set() :
            new Set<A>().add(this.get());
    }

    /*
     * Returns a string representation of the Either.
     * Useful for console logging an instance.
     *
     * @example
     * ```
     * console.log(Left(-1)); // => "Left(-1)"
     * console.log(Right(42)); // => "Right(42)"
     * ```
     */
    toString(): string {
        return this.isLeft() ?
            `Left(${this.get()})` :
            `Right(${this.get()})`;
    }

    /**
     * An alias for toString();
     */
    toStr(): string {
        return this.toString();
    }

    /**
     * Logs the Either to the console invoking both console.log and
     * toString for you.
     *
     * Accepts an optional function (customToString) as an argument.
     * customToString is a function you implement that returns a string.
     * The string returned by customToString will be used in place of
     * the string returned by toString method.
     * customToString will have access to the Either instance as well
     * but should **not** mutate the instance in any way (by calling
     * map, flatMap, then, filter, etc).
     *
     * @example
     * ```
     * Right(3).log(); // => "Right(3)"
     * Left('uh oh').log(); // => "Left('Uh oh')"
     *
     * const customLogger = (either: Either<number>): string => {
     *     return ~~~~~~~~~~~ " + either.toStr() + " ~~~~~~~~~~";
     * }
     *
     * Left(-1).log(customLogger) // => "~~~~~~~~~~ Left(-1) ~~~~~~~~~~"
     * // Or defined inline and not even using the instance
     * Right(3).log(() => "-- I AM HERE --"); // => "-- I AM HERE --"
     * ```
     */
    log(): void {
        console.log(this.toStr());
    }

    /**
     * Returns the instance after logging it to the console.
     *
     * Convenient to see the value of the Either in a sequence of method
     * calls for debugging without having to split up the method calls.
     *
     * Accepts an optional function (customToString) as an argument.
     * customToString is a function you implement that returns a string.
     * The string returned by customToString will be used in place of
     * the string returned by toString method.
     * customToString will have access to the either instance as well
     * but should **not** mutate the instance in any way (by calling
     * map, flatMap, then, filter, etc).
     *
     * @example
     * const customLogger = <T>(either: Either<T>): string => {
     *     return "!!!!!!! " + either.toStr() + " !!!!!!!";
     * }
     * Right(3)
     *     .map(val => val + 5)
     *     .logAndContinue() // => "Right(8)"
     *     .map(val => val + 2)
     *     .filter(val => val > 10)
     *     .logAndContinue(customLogger) // => "!!!!!!! Left() !!!!!!!"
     *     .getOrElse(-1);
     * ```
     */
    logAndContinue() {
        console.log(this.toStr());

        return this;
    }

    /**
     * Returns an instance of an Either using the value passed to it.
     * When invoking this function, the caller must specify whether the
     * instance is a Left or Right using the 2nd argument.
     *
     * Equivalent to using the Left() or Right() functions.
     *
     * @example
     * ```
     * const myRightEither = Either.of(42, 'right');
     * // The above is equivalent to => Right(42)
     *
     * const myLeftEither = Either.of("Something broke", 'left');
     * // The above is equivalent to => Left("Something broke");
     * ```
     */
    static of<T>(val: T, type: 'left' | 'right') {
        return new Either(val, type)
    }

}
