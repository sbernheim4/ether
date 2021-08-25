/**
 * Creates a Left Either instance using the provided argument as the
 * underlying value.
 *
 * @remarks Left is considered the failed track.
 */
export const Left = <T>(
    value: T
// @ts-ignore
): Left<T> => new Either(
    value,
    'left'
);

/**
 * Creates a Right Either instance using the provided argument as the
 * underlying value.
 *
 * @remarks Right is considered the success track.
 */
export const Right = <T>(
    value: T
// @ts-ignore
): Right<T> => new Either (
    value,
    'right'
);

export type Left<A> = Either<A>;
export type Right<A> = Either<A>;

/**
 * The Either class
 *
 * Construct instances of an Either through the provided `Left` and
 * `Right` functions or the class's static `of` method.
 */
export class Either<A>{

    private value: A;
    private type: 'left' | 'right';

    /**
     * Construct an instance of an Either.
     */
    private constructor(value: A, type: 'left' | 'right') {
        this.value = value;
        this.type = type;
    }

    /**
     * Returns true if the instance is a Left. Returns false otherwise.
     */
    isLeft(): boolean {
        return this.type === 'left';
    }

    /**
     * Returns true if the instance is a Right. Returns true otherwise.
     */
    isRight(): boolean {
        return this.type === 'right';
    }

    /**
     * Returns false if the instance is a Left or if the instance is a
     * Right but fails the predicateFn.
     * Returns true if and only if the instance is a Right and passes
     * the predicateFn.
     */
    exists(predicateFn: (val: A) => boolean): boolean {
        return this.isLeft() || predicateFn(this.get());
    }

    /**
     * Returns the underlying value regardless of whether the instance
     * is a Left or a Right.
     */
    get(): A {
        return this.value;
    }

    /**
     * Returns the underlying value if it's a Right. Returns the
     * provided argument otherwise.
     */
    getOrElse<B>(fallback: B): A | B {
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
    orElse<B>(otherEither: Either<B>): Either<A | B> {
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
    map<B>(fn: (val: A) => B): Either<A | B> {
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
    static map<B, A>(
        fn: (val: A) => B
    ): (
        either: Either<A>
    ) => Either<A | B> {
        return (either: Either<A>): Either<A | B> => {
            return either.map(fn);
        }
    }

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
    static lift<B, A>(
        fn: (val: A) => B
    ): (
        either: Either<A>
    ) => Either<A | B> {
        return (either: Either<A>): Either<A | B> => {
            return either.map(fn);
        }
    }

    /**
     * Like Either.lift but for functions with an arbitrary number of
     * arguments instead of just one.
     *
     * Lifts a function, with an arbitrary number of arguments, where
     * each argument is not an Either, to be a function that works on
     * Either versions of those arguments.
     *
     * @remarks This function has very weak type support and strict
     * requirements to work correctly. Use with caution.
     * @remarks The provided function **must** be completely curried.
     * @remarks If any of the provided Either arguments are a Left, the
     * Left will be returned.
     * @remarks Each argument in the provided curried function must have
     * the same type as its corresponding Either type. See the 2nd
     * example below.
     * @remarks All of the Either arguments for the provided function
     * must be passed when liftN is invoked.
     *
     * @example
     * ```
     * Either.liftN<number>(
     *     (a: number) => (b: number) => (c: number) => a + b + c,
     *     Right(18),
     *     Right(4),
     *     Right(6)
     * ); // => Right(28)
     *
     * // Since the 2nd argument (b) is defined as an object with a
     * // property age whose type is a number, the 2nd Either must be
     * // an Either whose underlying value is an Object with a property
     * // called age whose value is a number. This required relationship
     * // is **not** enforced by the type system.
     * Either.liftN<number>(
     *     (a: number) => (b: { age: number }) => a + b.age,
     *     Right(78),
     *     Right({ age: 22 })
     * ); // => Right(100)
     * ```
     */
    static liftN<A>(
        // @ts-ignore
        fn,
        ...args: [Either<unknown>, ...Either<unknown>[]]
    ): Either<A> {

        const recurse = (
            either: Either<unknown | A>,
            shadowArgs: Either<unknown>[]
        ): Either<A> => {

            if(shadowArgs.length === 0) {
                return either as Either<A>
            }

            const updatedValue = either.ap(
                shadowArgs.at(0) as Either<unknown>
            );

            return recurse(
                updatedValue,
                shadowArgs.slice(1)
            );

        }

        const initialValue = args[0].map(() => fn);

        return recurse(initialValue, args);
    }

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
     * const getFunctionOrError = () => {
     *     return Math.random() > .5 ?
     *         Right(val => val * 2) :
     *         Left("bad luck today");
     * }
     * // These next two constants could be retrieved by calling
     * // getFunctionOrError. Imagine it's been called twice and
     * // returned the following two Eithers.
     * const myRightEither = Right(val => val * 2);
     * const myLeftEither = Left("bad luck today");
     *
     * // Everything works nicely if all the Eithers are Rights
     * const resOne = myRightEither.ap(Right(42)); // => Right(84)
     *
     * // If the Either (containing the function or error) is a Left,
     * // that instance (containing the error) is returned.
     * const resTwo = myLeftEither.ap(Right(42));
     * // => Left("bad luck today")
     *
     * // If the argument to ap is a Left, and the instance is a Right,
     * // the argument is returned with no modification.
     * const resThree = myRightEither.ap(Left(42)); // => Left(42)
     * ```
     */
    ap<B, C>(either: Either<B>): Either<A | B | C> {
        if (this.isLeft()) {
            return this;
        }

        if (typeof this.get() !== 'function') {
            return this;
        }

        // The instance's generic, A, must be a function
        // whose type is B => C.
        const underlyingFunc = this.get() as unknown as (val: B) => C;

        return either.map(underlyingFunc);
    }

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
    fold<B>(fnA: (val: A) => B, fnB: (val: A) => B): B {
        return this.isLeft() ?
            fnA(this.get()) :
            fnB(this.get());
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
    flatMap<B>(fn: (val: A) => Either<B>): Either<A | B> {
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
     * // Create a version of appendIfValid that works on
     * // Either<string>
     * const appendToEitherStrIfValid = Either.flatMap(appendIfValid);
     *
     * const emailAddressOrError = appendToEitherStrIfValid(opt);
     * // emailAddressOrError => Right("johnsmith@gmail.com")
     *
     * const emailAddressOrError2 = appendToEitherStrIfValid(otherOpt);
     * // emailAddressOrError2 => Left(new Error("invalid username"))
     *
     * // This next line is equivalent to the above and just avoids
     * // storing the intermeidate constants.
     * const emailAddressOrError3 = Either.flatMap(appendIfValid)(opt);
     * ```
     */
    static flatMap<B, A>(
        fn: (val: A) => Either<B>
    ): (either: Either<A>) => Either<A | B> {
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
     * If the instance is a Left, the Either is returned as is.
     * If the provided function returns an Either, the result of
     * applying the function to the underlying value is returned.
     * If the provided function returns a non Either, the result of
     * applying the function to the underlying value is lifted into an
     * Either and returned.
     *
     * @example
     * ```
     * const myEither = Right(10);
     *
     * const doubleOrError = (val: number): Either<number> => {
     *     Math.random() > .5 ?
     *         Right(val * 2) :
     *         Left("Just not your day :(. Try again next time");
     * }
     *
     * const alwaysDouble = (val: number): number => val * 2;
     *
     * // function calls can be chained with .then regarless if the
     * // functions passed to then return an Either or non Either value.
     * const eitherErrorOrValue = myEither.then(doubleOrError)
     *                                    .then(alwaysDouble);
     * ```
     */
    then<B>(fn: (val: A) => B | Either<B>): Either<A | B> {
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
    flatten<B>(): Either<A | B> {

        if (this.isLeft()) {
            return this;
        }

        // The instance must be a Right

        const underlyingValue = this.get();

        if (underlyingValue instanceof Either) {
            return underlyingValue
        }

        return this;
    }

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
    filterOrElse<B>(
        filterFn: (either: A) => boolean,
        otherEither: Left<B>
    ): Either<A> | Left<B> {
        if (this.isLeft()) {
            return this;
        }

        if (filterFn(this.get())) {
            return this;
        } else {
            return otherEither;
        }
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
     * Swaps the type of the instance and returns the now
     * swapped instance.
     * If the instance is a Left, it becomes a Right.
     * If the instance is a Right, it becomes a Left.
     *
     * @remarks The underlying value is not modified.
     */
    swap(): Either<A> {
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
    toSet(): Set<A> {
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
    logAndContinue(): Either<A> {
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
     * const myLeftEither = Either.of(42, 'left');
     * // The above is equivalent to => Left(42);
     * ```
     */
    static of<T>(val: T, type: 'left' | 'right'): Left<T> | Right<T> {
        if (type === 'left') {
            return new Either(val, type) as Left<T>;
        } else {
            return new Either(val, type) as Right<T>;
        }
    }

}
