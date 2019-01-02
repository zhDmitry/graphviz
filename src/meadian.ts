import { Node } from ".";

// TODO Add number of passes, with 0 being keep passing up and down until no changes (is this guaranteed to never change?, maybe always terminate if no changes, so this can be set very high to almost achieve that effect)
// TODO Add optional greedy swapping of nodes after assignment
// TODO Add two layer noop. This only makes sense if there's a greedy swapping ability

function twolayerMean(topLayer: Node[], bottomLayer: Node[]) {
  const metaM = new Map<string, number>();
  const metaC = new Map<string, number>();

  const mean = (k: string) => metaM.get(k) || 0.0;
  const count = (k: string) => metaC.get(k) || 0;

  topLayer.forEach((n, i) =>
    n.children.forEach(c => {
      const newC = count(c) + 1;
      metaC.set(c, newC);
      const newMean = mean(c) + (i - mean(c)) / newC;
      metaC.set(c, newMean);
    })
  );
  bottomLayer.sort((a, b) => mean(a.id) - mean(b.id));
}

export function decrossTwoLayer(layers) {
  layers.forEach((layer, i) => {
    if (layers[i + 1]) {
      twolayerMean(layer, layers[i + 1]);
    }
  });
  return layers;
}
