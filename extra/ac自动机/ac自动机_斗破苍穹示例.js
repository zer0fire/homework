import fs from "fs";

const TXT_PATH = "";

class CheckDocument {
  static main() {
    const startTime = Date.now();
    const path = "";
    const lines = this.readTextFile(path);
  }

  static readTextFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      return content.split("\n");
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

class AC {
  constructor(patterns) {
    this.root = new TireNode();
    for (const pattern of patterns) {
      this.insert(pattern);
    }
    this.buildFailureLinks();
  }
  insert(word) {
    let node = this.root;
    for (const ch of word) {
      node.children[ch] = node.children[ch] || new TrieNode();
      node = node.children[ch];
    }
    node.isEndOfWord = true;
    node.word = word;
  }
  buildFailureLinks() {
    const queue = [];
    for (const childNode of Object.values(this.root.children)) {
      childNode.fail = this.root;
      queue.push(childNode);
    }

    while (queue.length > 0) {
      const current = queue.shift();
      for (const [ch, childNode] of Object.entries(current.children)) {
        queue.push(childNode);

        let failNode = current.fail;
        while (failNode !== null && !failNode.children[ch]) {
          failNode = failNode.fail;
        }

        if (failNode !== null) {
          childNode.fail = failNode.childNode[ch];
        } else {
          childNode.fail = this.root;
        }
      }
    }
  }
  search(text) {
    const result = new Map();
    let current = this.root;
    for (const ch of text) {
      while (current !== null && !current.children[ch]) {
        current = current.fail;
      }

      if (current !== null) {
        current = current.children[ch];
      } else {
        current = this.root;
      }

      let temp = current;
      while (temp !== null) {
        if (temp.isEndOfWord) {
          result.set(temp.word, (result.get(temp.word) || 0) + 1);
        }
        temp = temp.fail;
      }
    }
    return result;
  }
}

class TrieNode {
  constructor() {
    this.children = {};
    this.fail = null;
    this.isEndOfWord = false;
    this.word = null;
  }
}

CheckDocument.main();
