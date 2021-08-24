export declare const Left: <T>(error: T) => Either<T>;
export declare const Right: <T>(result: T) => Either<T>;
declare class Either<A> {
    private value;
    private type;
    constructor(value: A, type: 'left' | 'right');
    /**
     *
     *
     *
     */
    isLeft(): boolean;
    /**
     *
     *
     *
     */
    isRight(): boolean;
    /**
     *
     *
     *
     */
    exists(): void;
    /**
     *
     *
     *
     */
    get(): A;
    /**
     *
     *
     *
     */
    getOrElse<B>(fallback: B): A | B;
    /**
     *
     *
     *
     */
    orElse<B>(otherEither: Either<B>): Either<A> | Either<B>;
    /**
     *
     *
     *
     */
    map<B>(fn: (val: A) => B): Either<A> | Either<B>;
    /**
     *
     *
     *
     */
    static map<B, A>(fn: (val: A) => B): (either: Either<A>) => Either<A> | Either<B>;
    /**
     *
     *
     *
     */
    lift(): void;
    /**
     *
     *
     *
     */
    liftN(): void;
    /**
     *
     *
     *
     */
    ap(): void;
    /**
     *
     *
     *
     */
    fold(): void;
    /**
     *
     *
     *
     */
    flatMap<B>(fn: (val: A) => Either<B>): Either<A> | Either<B>;
    /**
     *
     *
     *
     */
    static flatMap<B, A>(fn: (val: A) => Either<B>): (either: Either<A>) => Either<B> | Either<A>;
    /**
     *
     *
     *
     */
    then<B>(fn: (val: A) => B | Either<B>): Either<A> | Either<B>;
    /**
     *
     *
     *
     */
    flatten(): void;
    /**
     *
     *
     *
     */
    filter(): void;
    /**
     *
     *
     *
     */
    filterNot(): void;
    /**
     *
     *
     *
     */
    contains(): void;
    /**
     *
     *
     *
     */
    swap(): void;
    /**
     *
     *
     *
     */
    toArray(): [] | [A];
    /**
     *
     *
     *
     */
    toSet(): Set<unknown>;
    /**
     *
     *
     *
     */
    toString(): string;
    /**
     *
     *
     *
     */
    toStr(): string;
    /**
     *
     *
     *
     */
    log(): void;
    /**
     *
     *
     *
     */
    logAndContinue(): this;
    /**
     *
     *
     *
     */
    static of<T>(val: T, type: 'left' | 'right'): Either<T>;
}
export {};
