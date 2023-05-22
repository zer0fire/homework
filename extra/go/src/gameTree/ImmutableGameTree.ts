function hasher() {
  // Simple hash function adapted from
  // https://github.com/darkskyapp/string-hash

  let result = 5381;

  return (str: string) => {
    for (let i = 0; i < str.length; i++) {
      result = (result * 33) ^ str.charCodeAt(i);
    }

    return result;
  };
}

class Draft {
  base: GameTree;
  root: any;
  _passOnNodeCache: any;
  _nodeCache: any;
  _idAliases: any;
  _heightCache: any;
  _structureHashCache: any;
  constructor(base: GameTree) {
    this.base = base;
    this.root = base.root;

    this._passOnNodeCache = true;

    this._nodeCache = {};
    this._idAliases = base._idAliases;
    this._heightCache = base._heightCache;
    this._structureHashCache = base._structureHashCache;
  }

  get(id: string) {
    if (id == null) return null;
    if (id in this._idAliases) return this.get(this._idAliases[id]);
    if (id in this._nodeCache) return this._nodeCache[id];

    let node = this.base.get(id);
    if (node == null) {
      this._nodeCache[id] = null;
      return null;
    }

    let nodeCopy = {
      ...node,
      data: { ...node.data },
      children: [...node.children],
    };

    if (node.parentId != null) {
      let parentCopy = this.get(node.parentId);
      let childIndex = parentCopy.children.findIndex(
        (child) => child.id === id
      );
      if (childIndex >= 0) parentCopy.children[childIndex] = nodeCopy;
    }

    this._nodeCache[id] = nodeCopy;
    if (this.root.id === id) this.root = nodeCopy;

    return nodeCopy;
  }

  _getLevel(id) {
    let level = -1;
    let node = this.get(id);

    while (node != null) {
      level++;
      node = this.get(node.parentId);
    }

    return level;
  }

  appendNode(parentId, data, options = {}) {
    let id = this.base.getId();
    let success = this.UNSAFE_appendNodeWithId(parentId, id, data, options);
    if (!success) return null;

    let merged = id in this._idAliases;
    if (!merged) return id;

    // If a merge occured, clean up id alias since id hasn't been exposed

    let result = this._idAliases[id];
    delete this._idAliases[id];

    return result;
  }

  UNSAFE_appendNodeWithId(parentId, id, data, { disableMerging } = {}) {
    let parent = this.get(parentId);
    if (parent == null) return false;

    let [mergeWithId, mergedData] = (() => {
      if (!disableMerging) {
        for (let child of parent.children) {
          let mergedData = this.base.merger(child, data);
          if (mergedData != null) return [child.id, mergedData];
        }
      }

      return [null, null];
    })();

    if (mergeWithId != null) {
      let node = this.get(mergeWithId);
      node.data = mergedData;

      if (id !== mergeWithId) {
        this._idAliases[id] = mergeWithId;
      }
    } else {
      let node = { id, data, parentId, children: [] };
      parent.children.push(node);

      this._nodeCache[id] = node;
      this._structureHashCache = null;

      if (
        this._heightCache != null &&
        this._getLevel(parentId) === this._heightCache - 1
      ) {
        this._heightCache++;
      }
    }

    return true;
  }

  removeNode(id) {
    let node = this.get(id);
    if (node == null) return false;

    let parentId = node.parentId;
    if (parentId == null) throw new Error("Cannot remove root node");

    let parent = this.get(parentId);
    if (parent == null) return false;

    let index = parent.children.findIndex((child) => child.id === id);
    if (index >= 0) parent.children.splice(index, 1);
    else return false;

    this._nodeCache[id] = null;
    this._structureHashCache = null;
    this._heightCache = null;

    return true;
  }

  shiftNode(id, direction) {
    if (!["left", "right", "main"].includes(direction)) {
      throw new Error(
        `Invalid value for direction, only 'left', 'right', or 'main' allowed`
      );
    }

    let node = this.get(id);
    if (node == null) return null;

    let { parentId } = node;
    let parent = this.get(parentId);
    if (parent == null) return null;

    let index = parent.children.findIndex((child) => child.id === id);
    if (index < 0) return null;

    let newIndex = {
      left: Math.max(index - 1, 0),
      right: Math.min(index + 1, parent.children.length),
      main: 0,
    }[direction];

    if (index !== newIndex) {
      let [child] = parent.children.splice(index, 1);
      parent.children.splice(newIndex, 0, child);
    }

    this._structureHashCache = null;

    return newIndex;
  }

  makeRoot(id) {
    if (id === this.root.id) return true;

    let node = this.get(id);
    if (node == null) return false;

    node.parentId = null;
    this.root = node;

    this._passOnNodeCache = false;
    this._heightCache = null;
    this._structureHashCache = null;

    return true;
  }

  addToProperty(id, property, value) {
    let node = this.get(id);
    if (node == null) return false;

    if (node.data[property] == null) {
      node.data[property] = [value];
    } else if (!node.data[property].includes(value)) {
      node.data[property] = [...node.data[property], value];
    }

    return true;
  }

  removeFromProperty(id, property, value) {
    let node = this.get(id);
    if (node == null || node.data[property] == null) return false;

    node.data[property] = node.data[property].filter((x) => x !== value);
    if (node.data[property].length === 0) delete node.data[property];

    return true;
  }

  updateProperty(id, property, values) {
    let node = this.get(id);
    if (node == null) return false;

    if (values == null || values.length === 0) delete node.data[property];
    else node.data[property] = values;

    return true;
  }

  removeProperty(id, property) {
    return this.updateProperty(id, property, null);
  }
}

export default class GameTree {
  root: any;
  _nodeCache: any;
  _idAliases: any;
  _heightCache: any;
  _hashCache: any;
  _structureHashCache: any;

  getId: Function;
  merger: Function;

  constructor({
    getId = (
      (id: number = 0): Function =>
      () =>
        id++
    )(),
    merger = () => null,
    root = null,
  } = {}) {
    this.getId = getId;
    this.merger = merger;

    root = {
      id: this.getId(),
      data: {},
      parentId: null,
      children: [],
      ...(root || {}),
    };

    this.root = root;
    this._nodeCache = {};
    this._idAliases = {};
    this._heightCache = null;
    this._hashCache = null;
    this._structureHashCache = null;
  }

  get(id: number) {
    let node = null;
    if (id == null) return node;
    if (id in this._idAliases) return this.get(this._idAliases[id]);

    if (id in this._nodeCache) {
      node = this._nodeCache[id];
    } else {
      let inner = (node) => {
        this._nodeCache[node.id] = node;
        if (node.id === id) return node;

        for (let child of node.children) {
          let result = inner(child);
          if (result != null) return result;
        }

        return null;
      };

      node = inner(this.root);
    }

    if (node == null) {
      this._nodeCache[id] = null;
      return null;
    }

    for (let child of node.children) {
      this._nodeCache[child.id] = child;
    }

    return node;
  }

  *getSequence(id) {
    let node = this.get(id);
    if (node == null) return;
    yield node;

    while (node.children.length === 1) {
      node = node.children[0];

      this._nodeCache[node.id] = node;
      for (let child of node.children) {
        this._nodeCache[child.id] = child;
      }

      yield node;
    }
  }

  mutate(mutator) {
    let draft = new Draft(this);

    mutator(draft);
    if (draft.root === this.root) return this;

    let tree = new GameTree({
      getId: this.getId,
      merger: this.merger,
      root: draft.root,
    });

    if (draft._passOnNodeCache) tree._nodeCache = draft._nodeCache;
    tree._idAliases = draft._idAliases;
    tree._structureHashCache = draft._structureHashCache;
    tree._heightCache = draft._heightCache;

    return tree;
  }

  navigate(id, step, currents) {
    let node = this.get(id);

    if (node == null) return null;
    if (step === 0) return node;
    if (step < 0) return this.navigate(node.parentId, step + 1);

    let nextId =
      currents[node.id] != null
        ? currents[node.id]
        : node.children.length > 0
        ? node.children[0].id
        : null;

    if (nextId == null) return null;
    return this.navigate(nextId, step - 1, currents);
  }

  *listNodes() {
    function* inner(node) {
      yield node;

      for (let child of node.children) {
        yield* inner(child);
      }
    }

    yield* inner(this.root);
  }

  *listNodesHorizontally(startId, step) {
    if (Math.abs(step) !== 1)
      throw new Error("Invalid value for step, only -1 or 1 allowed");

    let level = this.getLevel(startId);
    let section = [...this.getSection(level)];
    let index = section.findIndex((node) => node.id === startId);

    while (section[index] != null) {
      while (0 <= index && index < section.length) {
        yield section[index];
        index += step;
      }

      level += step;
      section =
        step > 0
          ? [].concat(...section.map((node) => node.children))
          : [...this.getSection(level)];
      index = step > 0 ? 0 : section.length - 1;
    }
  }

  *listNodesVertically(startId, step, currents) {
    if (Math.abs(step) !== 1)
      throw new Error("Invalid value for step, only -1 or 1 allowed");

    let id = startId;
    let node = this.get(id);

    while (node != null) {
      yield node;
      node = this.navigate(node.id, step, currents);
    }
  }

  *listCurrentNodes(currents) {
    yield* this.listNodesVertically(this.root.id, 1, currents);
  }

  *listMainNodes() {
    yield* this.listCurrentNodes({});
  }

  getLevel(id) {
    let result = -1;

    for (let node of this.listNodesVertically(id, -1, {})) {
      result++;
    }

    return result < 0 ? null : result;
  }

  *getSection(level) {
    if (level < 0) return;
    if (level === 0) {
      yield this.root;
      return;
    }

    for (let parent of this.getSection(level - 1)) {
      yield* parent.children;
    }
  }

  getCurrentHeight(currents) {
    let result = 0;
    let node = this.root;

    while (node != null) {
      result++;
      node =
        currents[node.id] == null
          ? node.children[0]
          : node.children.find((child) => child.id === currents[node.id]);
    }

    return result;
  }

  getHeight() {
    if (this._heightCache == null) {
      let inner = (node) => {
        let max = 0;

        for (let child of node.children) {
          max = Math.max(max, inner(child));
        }

        return max + 1;
      };

      this._heightCache = inner(this.root);
    }

    return this._heightCache;
  }

  getStructureHash() {
    if (this._structureHashCache == null) {
      let hash = hasher.new();

      let inner = (node) => {
        hash("[" + JSON.stringify(node.id) + ",");
        node.children.forEach(inner);
        return hash("]");
      };

      this._structureHashCache = inner(this.root);
    }

    return (this._structureHashCache >>> 0) + "";
  }

  getHash() {
    if (this._hashCache == null) {
      let hash = hasher.new();

      let inner = (node) => {
        hash("[" + JSON.stringify(node.data) + ",");
        node.children.forEach(inner);
        return hash("]");
      };

      this._hashCache = inner(this.root);
    }

    return (this._hashCache >>> 0) + "";
  }

  onCurrentLine(id, currents) {
    for (let node of this.listNodesVertically(id, -1, {})) {
      let { parentId } = node;

      if (
        parentId != null &&
        currents[parentId] !== node.id &&
        (currents[parentId] != null || this.get(parentId).children[0] !== node)
      )
        return false;
    }

    return true;
  }

  onMainLine(id) {
    return this.onCurrentLine(id, {});
  }

  toJSON() {
    return this.root;
  }
}
class GameTree {
  constructor({ getId = null, merger = null, root = null } = {}) {
    this.getId =
      getId ||
      (
        (id = 0) =>
        () =>
          id++
      )();
    this.merger = merger || (() => null);

    root = {
      id: this.getId(),
      data: {},
      parentId: null,
      children: [],
      ...(root || {}),
    };

    this.root = root;
    this._nodeCache = {};
    this._idAliases = {};
    this._heightCache = null;
    this._hashCache = null;
    this._structureHashCache = null;
  }

  get(id) {
    let node = null;
    if (id == null) return node;
    if (id in this._idAliases) return this.get(this._idAliases[id]);

    if (id in this._nodeCache) {
      node = this._nodeCache[id];
    } else {
      let inner = (node) => {
        this._nodeCache[node.id] = node;
        if (node.id === id) return node;

        for (let child of node.children) {
          let result = inner(child);
          if (result != null) return result;
        }

        return null;
      };

      node = inner(this.root);
    }

    if (node == null) {
      this._nodeCache[id] = null;
      return null;
    }

    for (let child of node.children) {
      this._nodeCache[child.id] = child;
    }

    return node;
  }

  *getSequence(id) {
    let node = this.get(id);
    if (node == null) return;
    yield node;

    while (node.children.length === 1) {
      node = node.children[0];

      this._nodeCache[node.id] = node;
      for (let child of node.children) {
        this._nodeCache[child.id] = child;
      }

      yield node;
    }
  }

  mutate(mutator) {
    let draft = new Draft(this);

    mutator(draft);
    if (draft.root === this.root) return this;

    let tree = new GameTree({
      getId: this.getId,
      merger: this.merger,
      root: draft.root,
    });

    if (draft._passOnNodeCache) tree._nodeCache = draft._nodeCache;
    tree._idAliases = draft._idAliases;
    tree._structureHashCache = draft._structureHashCache;
    tree._heightCache = draft._heightCache;

    return tree;
  }

  navigate(id, step, currents) {
    let node = this.get(id);

    if (node == null) return null;
    if (step === 0) return node;
    if (step < 0) return this.navigate(node.parentId, step + 1);

    let nextId =
      currents[node.id] != null
        ? currents[node.id]
        : node.children.length > 0
        ? node.children[0].id
        : null;

    if (nextId == null) return null;
    return this.navigate(nextId, step - 1, currents);
  }

  *listNodes() {
    function* inner(node) {
      yield node;

      for (let child of node.children) {
        yield* inner(child);
      }
    }

    yield* inner(this.root);
  }

  *listNodesHorizontally(startId, step) {
    if (Math.abs(step) !== 1)
      throw new Error("Invalid value for step, only -1 or 1 allowed");

    let level = this.getLevel(startId);
    let section = [...this.getSection(level)];
    let index = section.findIndex((node) => node.id === startId);

    while (section[index] != null) {
      while (0 <= index && index < section.length) {
        yield section[index];
        index += step;
      }

      level += step;
      section =
        step > 0
          ? [].concat(...section.map((node) => node.children))
          : [...this.getSection(level)];
      index = step > 0 ? 0 : section.length - 1;
    }
  }

  *listNodesVertically(startId, step, currents) {
    if (Math.abs(step) !== 1)
      throw new Error("Invalid value for step, only -1 or 1 allowed");

    let id = startId;
    let node = this.get(id);

    while (node != null) {
      yield node;
      node = this.navigate(node.id, step, currents);
    }
  }

  *listCurrentNodes(currents) {
    yield* this.listNodesVertically(this.root.id, 1, currents);
  }

  *listMainNodes() {
    yield* this.listCurrentNodes({});
  }

  getLevel(id) {
    let result = -1;

    for (let node of this.listNodesVertically(id, -1, {})) {
      result++;
    }

    return result < 0 ? null : result;
  }

  *getSection(level) {
    if (level < 0) return;
    if (level === 0) {
      yield this.root;
      return;
    }

    for (let parent of this.getSection(level - 1)) {
      yield* parent.children;
    }
  }

  getCurrentHeight(currents) {
    let result = 0;
    let node = this.root;

    while (node != null) {
      result++;
      node =
        currents[node.id] == null
          ? node.children[0]
          : node.children.find((child) => child.id === currents[node.id]);
    }

    return result;
  }

  getHeight() {
    if (this._heightCache == null) {
      let inner = (node) => {
        let max = 0;

        for (let child of node.children) {
          max = Math.max(max, inner(child));
        }

        return max + 1;
      };

      this._heightCache = inner(this.root);
    }

    return this._heightCache;
  }

  getStructureHash() {
    if (this._structureHashCache == null) {
      let hash = hasher.new();

      let inner = (node) => {
        hash("[" + JSON.stringify(node.id) + ",");
        node.children.forEach(inner);
        return hash("]");
      };

      this._structureHashCache = inner(this.root);
    }

    return (this._structureHashCache >>> 0) + "";
  }

  getHash() {
    if (this._hashCache == null) {
      let hash = hasher.new();

      let inner = (node) => {
        hash("[" + JSON.stringify(node.data) + ",");
        node.children.forEach(inner);
        return hash("]");
      };

      this._hashCache = inner(this.root);
    }

    return (this._hashCache >>> 0) + "";
  }

  onCurrentLine(id, currents) {
    for (let node of this.listNodesVertically(id, -1, {})) {
      let { parentId } = node;

      if (
        parentId != null &&
        currents[parentId] !== node.id &&
        (currents[parentId] != null || this.get(parentId).children[0] !== node)
      )
        return false;
    }

    return true;
  }

  onMainLine(id) {
    return this.onCurrentLine(id, {});
  }

  toJSON() {
    return this.root;
  }
}
