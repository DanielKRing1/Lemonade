import { Loader, LoadParams } from "../Abstract/Loader";

export interface Loadable {
  _loader: Loader;

  load: (params?: LoadParams) => void;
}
