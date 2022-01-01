import ActivityZone from './ActivityZone';
import GridCell from './GridCell';

class AStarNode {
    previous: AStarNode | null;
    node: GridCell
    cost: number
    estimate: number
    total: number
    constructor(previous: AStarNode | null, node: GridCell, cost: number, estimate: number){
        this.previous = previous;
        this.node = node;
        this.cost = cost;
        this.estimate = estimate;
        this.total = this.cost + this.estimate;
    }
}

class AStar {
    source: GridCell
    destination: GridCell | ActivityZone
    leaves: Array<AStarNode>
    branches: Map<GridCell, AStarNode>
    router: Generator;
    finalRoute: Array<GridCell> | null;
    constructor(source: GridCell, destination: GridCell | ActivityZone){
        this.source = source;
        this.destination = destination;
        const firstLeaf = new AStarNode(
            null,
            this.source,
            0,
            source.location.vectorTo(destination.location.nearestToPoint(source.location)).length()
        );
        this.leaves = [firstLeaf];
        this.branches = new Map();
        this.branches.set(firstLeaf.node, firstLeaf);
        this.router = this.routeStepper();
        this.finalRoute = null;
    }
    sortLeaves() {
        this.leaves.sort((a, b) => (b.total - a.total));
    }
    *growNewLeaves(){
        const nextBranch = this.leaves.pop();
        if(nextBranch) {
            const potentialNewLeaves = [
                nextBranch.node.north?.west,
                nextBranch.node.north,
                nextBranch.node.north?.east,
                nextBranch.node.east,
                nextBranch.node.south?.east,
                nextBranch.node.south,
                nextBranch.node.south?.west,
                nextBranch.node.west
            ];
            let availableNewLeaves: Array<GridCell> = [];
            for(const newLeaf of potentialNewLeaves){
                if(newLeaf && newLeaf.TEMP_terrain_type === 0){
                    availableNewLeaves.push(newLeaf);
                }
            }
            for (const leaf of availableNewLeaves) {
                if(leaf){
                    const cost = nextBranch.node.location.vectorTo(leaf.location).length() + nextBranch.cost;
                    const estimate = leaf.location.vectorTo(this.destination.location.nearestToPoint(leaf.location)).length();
                    const total = cost + estimate;
                    if(this.branches.has(leaf)){
                        const leafNode = this.branches.get(leaf);
                        if(leafNode && leafNode.total > total){
                            leafNode.previous = nextBranch;
                            leafNode.cost = cost;
                            leafNode.estimate = estimate;
                            leafNode.total = total;
                        }
                    } else {
                        const newNode = new AStarNode(
                            nextBranch,
                            leaf,
                            cost,
                            estimate
                        )
                        this.leaves.push(newNode);
                        this.branches.set(leaf, newNode);
                    }
                    // console.log(this.leaves);
                    yield;
                }
            }
        }
        return;
    }
    checkLeaves(){
        this.leaves.forEach(leaf => {
            if(leaf.node === leaf.node.grid.getLocalCell(this.destination.location.nearestToPoint(leaf.node.location))){
                this.finalRoute = this.getPathBack(leaf);
                this.branches.clear();
                this.leaves = [];
                return this.finalRoute;
            }
        })
    }
    *routeStepper(){
        while(!this.finalRoute){
            this.sortLeaves();
            yield [...this.growNewLeaves()];
            this.checkLeaves();
        }
        return this.finalRoute;
    }
    getPathBack(leaf: AStarNode){
        const trace = [];
        let branch: AStarNode | null = leaf;
        while(branch) {
            trace.push(branch.node);
            if(branch.previous?.previous === branch){
                console.error('major error: infinite loop between ', branch.node.location.asArray(), branch.previous.node.location.asArray());
                return trace;
            }
            branch = branch.previous;
        }
        return trace;
    }
    getPathsBack(){
        if(this.finalRoute) {
            return [this.finalRoute]
        }
        const paths = this.leaves.map(leaf => this.getPathBack(leaf));
        return paths;
    }
}

export default AStar;
