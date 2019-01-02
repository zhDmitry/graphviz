import { Node } from ".";
// Compute x coordinates for nodes that maximizes the spread of nodes in [0, 1]
export function coordSpread(layers: Node[][], separation) {
  layers.forEach(layer => {
    if (layer.length === 1) {
      const [node] = layer;
      node.value.x = 1 / 2;
    } else {
      layer.reduce((last, node) => {
        node.value.x =
          last === undefined ? 0 : last.value.x + separation(last, node);
        return node;
      }, undefined);
      const width = layer[layer.length - 1].value.x;
      layer.forEach(n => (n.value.x /= width));
    }
  });
  return layers;
}
