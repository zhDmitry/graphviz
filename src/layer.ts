// Assign a layer value for each node that minimizes the number of dummy nodes that need to be added
import solver from "javascript-lp-solver";
import graphib from "graphlib";
import { Graph } from ".";

export default function() {
  let debug = false;

  function layeringSimplex(dag: Graph) {
    // use null prefixes to prevent clash
    const prefix = debug ? "" : "\0";
    const delim = debug ? " -> " : "\0";

    const variables = {};
    const ints = {};
    const constraints = {};
    dag.forEach(({ id: nodeId, children }) => {
      const nid = `${prefix}${nodeId}`;
      ints[nid] = 1;

      const variable = (variables[nid] = { opt: children.length });
      children.forEach(childId => {
        const edge = `${nodeId}${delim}${childId}`;
        constraints[edge] = { min: 1 };
        variable[edge] = -1;
      });
    });

    dag.forEach(({ id: nodeId, children }) => {
      children.forEach(childId => {
        const variable = variables[`${prefix}${childId}`];
        variable.opt--;
        variable[`${nodeId}${delim}${childId}`] = 1;
      });
    });

    const assignment = solver.Solve({
      optimize: "opt",
      opType: "max",
      constraints: constraints,

      variables: variables,
      ints: ints
    });

    // lp solver doesn't assign some zeros
    dag.forEach(node => {
      node.value = node.value || {};
      node.value.layer = assignment[`${prefix}${node.id}`] || 0;
    });
    return dag;
  }

  layeringSimplex.debug = function(x) {
    return arguments.length ? ((debug = x), layeringSimplex) : debug;
  };

  return layeringSimplex;
}
