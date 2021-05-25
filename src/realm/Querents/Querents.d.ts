declare enum QuerentType {
  Node,
  Edge,
}

type EntityWeight<T> = {
  entity: T;
  weight: number;
};
