import { NotImplementedError } from "../../Errors";

export type LoadParams = Record<string, any>;
export class Loader {
  constructor() {}

  load(param?: LoadParams): void {
    throw NotImplementedError();
  }
}
