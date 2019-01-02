import { Graph, Node } from ".";

export function createDummies(dag: Graph) {
  const layers: Node[][] = [];
  dag.forEach(node => {
    const layer = layers[node.value.layer] || (layers[node.value.layer] = []);
    layer.push(node);
    node.children = node.children.map(childId => {
      const child = dag.get(childId);
      if (child.value.layer > node.value.layer + 1) {
        let last = child;
        for (let l = child.value.layer - 1; l > node.value.layer; l--) {
          const dummy: Node = {
            id: `${node.id}"->"${child.id} (${l})`,
            children: [last.id],
            value: {
              dummy: true
            }
          };
          (layers[l] || (layers[l] = [])).push(dummy);
          last = dummy;
        }
        return last.id;
      } else {
        return child.id;
      }
    });
  });
  return layers;
}
