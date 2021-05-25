class KDSearchTree {
    private dimensions;

    constructor(dimensions: number) {
        this.dimensions = dimensions;
    }

    public add(vectors: number[][], parent: Path, depth: number = 0) {
        const dim: number = depth % this.dimensions;

        vectors.sort((a: number[], b: number[]) => {
            return a[dim] - b[dim];
        });

        const midPoint: number = Math.floor(vectors.length / 2);
        const median: Path = new Path()

        // Left
        this.add(vectors.slice(0, midPoint), )

        // Right
    }
}

class Path {
    private left: Path;
    private right: Path;
    private vectors: number[][];

    constructor() {
        this.vectors = [];
    }


}