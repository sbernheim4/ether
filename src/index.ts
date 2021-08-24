export const Left = <T>(error: T) => new Either(error, 'left');
export const Right = <T>(result: T) => new Either (result, 'right');

class Either<A>{

    private value: A;
    private type: 'left' | 'right';

    constructor(value: A, type: 'left' | 'right') {
        this.value = value;
        this.type = type;
    }

    /**
     *
     *
     *
     */
    isLeft() {
        return this.type === 'left';
    }

    /**
     *
     *
     *
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
     *
     *
     *
     */
    getOrElse<B>(fallback: B) {
        return this.isLeft() ?
            fallback :
            this.get();
    }

    /**
     *
     *
     *
     */
    orElse<B>(otherEither: Either<B>): Either<A> | Either<B> {
        return this.isLeft() ?
            otherEither :
            this;
    }

    /**
     *
     *
     *
     */
    map<B>(fn: (val: A) => B): Either<A> | Either<B> {
        return this.isLeft() ?
            this :
            Right(fn(this.get()));
    }

    /**
     *
     *
     *
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
     *
     *
     *
     */
    flatMap<B>(fn: (val: A) => Either<B>): Either<A> | Either<B> {
        return this.isLeft() ?
            this :
            fn(this.get())
    }

    /**
     *
     *
     *
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
     *
     *
     *
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
     *
     *
     *
     */
    contains() {

    }

    /**
     *
     *
     *
     */
    swap() {
        const newType = this.isLeft() ?
            'right' :
            'left';

        this.type = newType;
    }

    /**
     *
     *
     *
     */
    toArray(): [] | [A] {
        return this.isLeft() ?
            [] :
            [this.get()];
    }

    /**
     *
     *
     *
     */
    toSet() {
        return this.isLeft() ?
            new Set() :
            new Set<A>().add(this.get());
    }

    /**
     *
     *
     *
     */
    toString(): string {
        return this.isLeft() ?
            `Left(${this.get()})` :
            `Right(${this.get()})`;
    }

    /**
     *
     *
     *
     */
    toStr(): string {
        return this.toString();
    }

    /**
     *
     *
     *
     */
    log(): void {
        console.log(this.toStr());
    }

    /**
     *
     *
     *
     */
    logAndContinue() {
        console.log(this.toStr());

        return this;
    }

    /**
     *
     *
     *
     */
    static of<T>(val: T, type: 'left' | 'right') {
        return new Either(val, type)
    }

}
