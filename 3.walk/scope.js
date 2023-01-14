module.exports = class Scope {
  name = "";
  parent = null;
  scopeList = [];
  constructor(options = {}) {
    this.name = options.name;
    this.parent = options.parent;
  }

  add(variable) {
    this.scopeList.push(variable);
  }

  contains(variable) {
    return !!this.findDefiningScope(variable);
  }

  findDefiningScope(variable) {
    if (this.parent && !this.scopeList.includes(variable)) {
      return this.parent.findDefiningScope(variable);
    } else if (!this.parent && !this.scopeList.includes(variable)) {
      return null;
    }
    return this;
  }
};
