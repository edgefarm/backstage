export type ConstructorArgs = {
  nodes: {
    name: string;
    status: boolean;
  }[];
};

export type RolloutStatusItem = {
  target: string;
  status: boolean;
};

export class RolloutStatus {
  items: RolloutStatusItem[];

  constructor(args: ConstructorArgs) {
    this.items = args.nodes.map(node => ({
      target: node.name,
      status: node.status,
    }));
  }
}
