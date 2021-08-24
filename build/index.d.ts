export declare const Left: <T>(error: T) => Left<T>;
export declare const Right: <T>(result: T) => Right<T>;
export declare type Left<A> = Either<A>;
export declare type Right<A> = Either<A>;
declare class Either<A> {
    private value;
    private type;
    /**
     * Construct an instance of an Either.
     */
    private constructor();
    /**
     * Returns true if the instance is a Left. Returns false otherwise.
     */
    isLeft(): boolean;
    /**
     * Returns true if the instance is a Right. Returns true otherwise.
     */
    isRight(): boolean;
    /**
     * Returns the underlying value regardless of whether the instance
     * is a Left or a Right.
     */
    get(): A;
    /**
     * Returns the underlying value if it's a Right. Returns the
     * provided argument otherwise.
     */
    getOrElse<B>(fallback: B): A | B;
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
    orElse<B>(otherEither: Either<B>): Either<A | B>;
    /**
     * Transforms the underlying value if the instance is a Right by
     * applying the provided function to the underlying value, returning
     * the transformed value in a Right Either.
     * Returns the instance otherwise.
     *
     * @remarks Prefer this to `flatMap` when the provided function does
     * not return an Either.
     */
    map<B>(fn: (val: A) => B): Either<A | B>;
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
     * // Eithers (possibly returned by other functions)
     * const either = Right("johnsmith");
     * const otherEither = Left("Error: name not entered");
     *
     * // Create a version of appendToString that works on values that
     * // are Eithers.
     * const appendToEitherString = Either.map(appendToString);
     *
     * const eitherEmailOrError = appendToEitherString(either);
     * // eitherEmailOrError => Right("johnsmith@gmail.com")
     *
     * const eitherEmailOrError2 = appendToEitherString(otherEither);
     * // eitherEmailOrError2 => Left("Error: name not entered");
     * ```
     */
    static map<B, A>(fn: (val: A) => B): (either: Either<A>) => Either<A | B>;
    /**
     * An alias for Option.map. Perhaps a more accurate or descriptive
     * name.
     *
     * Lifts a function of type (val: A) => B
     * to be a function of type (val: Either<A>) => Either<B>.
     *
     * @example
     * // Working with number
     * const addFive = (val: number) => val + 5;
     * const eight = addFive(3);
     *
     * // Working with Either<number>
     * const addFiveToEither = Either.lift(addFive);
     * const eightOrError = addFiveToEither(Right(3));
     */
    static lift<B, A>(fn: (val: A) => B): (either: Either<A>) => Either<A | B>;
    liftN(): void;
    /**
     * Applies the function wrapped in the current instance (as a Right)
     * to the provided Either argument.
     *
     * If the instance is a Left, the instance is returned.
     *
     * If the instance is a Right, and the argument a Left, the argument
     * is returned.
     *
     * If the instance is a Right, and the argument is a Right, the
     * result of applying the function to the argument's underlying
     * value is returned (wrapped in an Either as a Right).
     *
     * @remarks An Either is always returned.
     * @remarks The Either's Right underlying value must be a function
     * of the type (val: A) => B.
     * @remarks Useful when the function to apply to another Either is
     * itself wrapped in an Either.
     *
     * @example
     * ```
     * const double = (val: number): number => val * 2;
     *
     * // These next two lines could be a single value returned by a
     * // function that either succeeds (and so returns the function in
     * // a Right) or fails (and returns the error in a Left).
     * const myRightEither = Right(double);
     * const myLeftEither = Left("uh oh, something broke");
     *
     * // Everything works out nicely if all Eithers are Rights
     * const resOne = myRight.ap(Right(42)); // => Right(84)
     *
     * // If the Either (containing the function or error) is a Left,
     * // that instance (containing the error) is returned.
     * const resTwo = myLeftEither.ap(Right(42));
     * // => Left("uh oh, something "broke)
     *
     * // If the argument to ap is a Left, and the instance is a Right,
     * // the argument is returned.
     * const resThree = myRightEither.ap(Left(42)); // => Left(42)
     * ```
     */
    ap<B, C>(either: Either<B>): Either<A | B | C>;
    /**
     * Applies one of the provided functions to the instance's
     * underlying value, returning the result of applying the function.
     *
     * If the instance is a Left, fnA is applied.
     * If the instance is a Right, fnB is applied.
     *
     * @remarks Regardless of whether the instance is a Left or Right,
     * the result of applying the function to the underlying value is
     * returned.
     *
     * @example
     * const double = val => val * 2;
     * const triple = val => val * 3;
     *
     * ```
     * Left(7).fold(double, triple); // => 14
     * Right(7).fold(double, triple); // => 21
     * ```
     */
    fold<B>(fnA: (val: A) => B, fnB: (val: A) => B): B;
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
    flatMap<B>(fn: (val: A) => Either<B>): Either<A | B>;
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
    static flatMap<B, A>(fn: (val: A) => Either<B>): (either: Either<A>) => Either<A | B>;
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
    then<B>(fn: (val: A) => B | Either<B>): Either<A | B>;
    /**
     * Flattens a wrapped Either.
     *
     * If the instance is a Left, the instance is returned.
     * If the instance is a Right and the underlying value is an Either,
     * the underlying value is returned.
     * If the instance is a Right but the undnerlying value is not an
     * Either, the instance is returned.
     *
     * @remarks In all cases, an Either is returned.
     */
    flatten<B>(): Either<A | B>;
    /**
     * Returns the instance if the instance is a Left.
     * Returns the instance if the instance is a Right and passes the
     * provided filter function.
     * Returns the otherEither if the instance is a Right and fails the
     * provided filter function.
     *
     * @example
     * ```
     * Right(42).filterOrElse(
     *     val => val > 20,
     *     Left("not bigger than 20")
     * ); // => Right(42)
     *
     * Left("uh oh, something broke").filterOrElse(
     *     val => val > 20,
     *     Left("not bigger than 20")
     * ); // => Left("uh oh, something broke")
     *
     * Right(19).filterOrElse(
     *     val => val > 20,
     *     Left("not bigger than 20")
     * ); // => Left("not bigger than 20")
     * ```
     */
    filterOrElse<B>(filterFn: (either: A) => boolean, otherEither: Left<B>): Either<A> | Left<B>;
    /**
     * Returns true if the instance's underlying value equals the
     * provided argument. Returns false otherwise.
     *
     * @remarks Accepts an optional equality function for comparing two
     * values for when the underlying value is not a primitive. By
     * default this equality function is JavaScript's ===.
     */
    contains(value: A, equalityFn?: (valOne: A, valTwo: A) => boolean): boolean;
    /**
     * Swaps the type of the instance and returns the now
     * swapped instance.
     * If it's a Left, it becomes a Right.
     * If it's Right, it becomes a Left.
     */
    swap(): this;
    /**
     * Returns an Array with the underlying value when the instance is a
     * Right. Returns an empty Array otherwise.
     */
    toArray(): [] | [A];
    /**
     * Returns a Set containing the underlying value when the instance
     * is a Right. Returns an empty Set otherwise.
     */
    toSet(): Set<unknown>;
    toString(): string;
    /**
     * An alias for toString();
     */
    toStr(): string;
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
    log(): void;
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
    logAndContinue(): this;
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
    static of<T>(val: T, type: 'left' | 'right'): Left<T> | Right<T>;
}
export {};
