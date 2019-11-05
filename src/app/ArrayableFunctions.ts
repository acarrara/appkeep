export abstract class ArrayableFunctions<Arrayable> {

  toArray(): Arrayable[] {
    return Object.keys(this).map(field => this[field]).filter(candidate => typeof candidate === 'function');
  }
}
