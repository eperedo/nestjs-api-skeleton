/**
 * Base class for typical classes with attributes. Features: create, update.
 *
 * ```
 * class Counter extends Struct<{ id: Id; value: number }>() {
 *     add(value: number): Counter {
 *         return this._update({ value: this.value + value });
 *     }
 * }
 *
 * const counter1 = Counter.create({ id: "some-counter", value: 1 });
 * const counter2 = counter1._update({ value: 2 });
 * ```
 */

export function Struct<Attrs>() {
  abstract class Base {
    constructor(_attributes: Attrs) {
      Object.assign(this, _attributes);
    }

    _getAttributes(): Attrs {
      const entries: Array<[keyof Attrs, Attrs[keyof Attrs]]> =
        Object.getOwnPropertyNames(this).map((key) => [
          key as keyof Attrs,
          (this as unknown as Attrs)[key as keyof Attrs],
        ]);
      return Object.fromEntries(entries) as Attrs;
    }

    public _update(partialAttrs: Partial<Attrs>): this {
      const ParentClass = this.constructor as new (
        values: Attrs,
      ) => typeof this;
      return new ParentClass({ ...this._getAttributes(), ...partialAttrs });
    }

    static create<U extends Base>(
      this: new (attrs: Attrs) => U,
      attrs: Attrs,
    ): U {
      return new this(attrs);
    }
  }

  return Base as {
    new (values: Attrs): Attrs & Base;
    create: (typeof Base)['create'];
  };
}

export type GenericStructInstance = InstanceType<ReturnType<typeof Struct>>;
