export class ObjectBuilder {
  public static buildUniformObject(keys: string[], value: any) {
    const values = keys.map(() => value);
    return ObjectBuilder.buildObject(keys, values);
  }

  public static buildObject(keys: string[], values: any[]) {
    const obj: Dict<any> = {};
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = values[i];

      obj[key] = value;
    }

    return obj;
  }
}
