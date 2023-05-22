export type Vertex = [number, number];
export type Sign = 0 | -1 | 1;
export type SignMap = Sign[][];

const alpha = "ABCDEFGHJKLMNOPQRSTUVWXYZ";

function vertexEquals([x1, y1]: number[], [x2, y2]: number[]) {
  return x1 === x2 && y1 === y2;
}

class GoBoard {
  signMap: SignMap;
  height: number;
  width: number;
  _players: [number, number];
  _captures: [number, number];
  _koInfo: { sign: Sign; vertex: Vertex };

  constructor(signMap: any[][] = []) {
    this.signMap = signMap;
    this.height = signMap.length;
    this.width = this.height === 0 ? 0 : signMap[0].length;

    if (signMap.some((row) => row.length !== this.width)) {
      throw new Error("signMap is not well-formed");
    }

    this._players = [1, -1];
    this._captures = [0, 0];
    this._koInfo = { sign: 0, vertex: [-1, -1] };
  }

  get([x, y]: [number, number]) {
    return this.signMap[y] != null ? this.signMap[y][x] : null;
  }

  set([x, y]: [number, number], sign: Sign | null) {
    if (this.has([x, y]) && sign) {
      this.signMap[y][x] = sign;
    }

    return this;
  }

  has([x, y]: [number, number]): boolean {
    return 0 <= x && x < this.width && 0 <= y && y < this.height;
  }

  clear() {
    this.signMap = this.signMap.map((row) => row.map((_) => 0));
    return this;
  }

  makeMove(
    sign: Sign,
    vertex: Vertex,
    { preventSuicide = false, preventOverwrite = false, preventKo = false } = {}
  ) {
    let move = this.clone();
    if (sign === 0 || !this.has(vertex)) return move;

    if (preventOverwrite && !!this.get(vertex)) {
      throw new Error("Overwrite prevented");
    }

    sign = sign > 0 ? 1 : -1;

    if (
      preventKo &&
      this._koInfo.sign === sign &&
      vertexEquals(this._koInfo.vertex, vertex)
    ) {
      throw new Error("Ko prevented");
    }

    move.set(vertex, sign);

    // Remove captured stones

    let neighbors = move.getNeighbors(vertex);
    let deadStones = [];
    let deadNeighbors = neighbors.filter(
      (n) => move.get(n) === -sign && !move.hasLiberties(n)
    );

    for (let n of deadNeighbors) {
      if (move.get(n) === 0) continue;

      for (let c of move.getChain(n)) {
        move.set(c, 0).setCaptures(sign, (x: number) => x + 1);
        deadStones.push(c);
      }
    }

    // Detect future ko

    let liberties = move.getLiberties(vertex);
    let hasKo =
      deadStones.length === 1 &&
      liberties.length === 1 &&
      vertexEquals(liberties[0], deadStones[0]) &&
      neighbors.every((n) => move.get(n) !== sign);

    move._koInfo = {
      sign: hasKo ? (-sign as Sign) : 0,
      vertex: hasKo ? deadStones[0] : [-1, -1],
    };

    // Detect suicide

    if (deadStones.length === 0 && liberties.length === 0) {
      if (preventSuicide) {
        throw new Error("Suicide prevented");
      }

      for (let c of move.getChain(vertex)) {
        move.set(c, 0).setCaptures(-sign as Sign, (x: number) => x + 1);
      }
    }

    return move;
  }

  analyzeMove(sign: Sign, vertex: Vertex) {
    let pass = sign === 0 || !this.has(vertex);
    let overwrite = !pass && !!this.get(vertex);
    let ko =
      this._koInfo.sign === sign && vertexEquals(this._koInfo.vertex, vertex);

    let originalSign = this.get(vertex);
    this.set(vertex, sign);

    let capturing =
      !pass &&
      this.getNeighbors(vertex).some(
        (n) => this.get(n) === -sign && !this.hasLiberties(n)
      );
    let suicide = !pass && !capturing && !this.hasLiberties(vertex);

    this.set(vertex, originalSign);

    return { pass, overwrite, capturing, suicide, ko };
  }

  getCaptures(sign: Sign) {
    let index = this._players.indexOf(sign);
    if (index < 0) return null;

    return this._captures[index];
  }

  setCaptures(sign: Sign, mutator: any) {
    let index = this._players.indexOf(sign);

    if (index >= 0) {
      this._captures[index] =
        typeof mutator === "function"
          ? mutator(this._captures[index])
          : mutator;
    }

    return this;
  }

  isSquare() {
    return this.width === this.height;
  }

  isEmpty() {
    return this.signMap.every((row) => row.every((x) => !x));
  }

  isValid() {
    let liberties: Map<Vertex, boolean> = new Map();

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        let vertex: [number, number] = [x, y];
        if (this.get(vertex) === 0 || liberties.has(vertex)) continue;
        if (!this.hasLiberties(vertex)) return false;

        this.getChain(vertex).forEach((v) => liberties.set(v, true));
      }
    }

    return true;
  }

  getDistance([x1, y1]: [number, number], [x2, y2]: [number, number]) {
    return Math.abs(x2 - x1) + Math.abs(y2 - y1);
  }

  getNeighbors(vertex: Vertex): [number, number][] {
    if (!this.has(vertex)) return [];

    let [x, y] = vertex;

    const left: Vertex = [x - 1, y];
    const right: Vertex = [x + 1, y];
    const bottom: Vertex = [x, y - 1];
    const top: Vertex = [x, y + 1];

    return [left, right, bottom, top].filter((v) => this.has(v));
  }

  getConnectedComponent(
    vertex: [number, number],
    predicate: Function,
    result: [number, number][] | null = null
  ) {
    if (!this.has(vertex)) return [];
    if (!result) result = [vertex];

    // Recursive depth-first search

    for (let v of this.getNeighbors(vertex)) {
      if (!predicate(v)) continue;
      if (result.some((w) => vertexEquals(w, v))) continue;

      result.push(v);
      this.getConnectedComponent(v, predicate, result);
    }

    return result;
  }

  getChain(vertex: [number, number]) {
    let sign: Sign | null = this.get(vertex);
    return this.getConnectedComponent(
      vertex,
      (v: Vertex) => this.get(v) === sign
    );
  }

  getRelatedChains(vertex: Vertex) {
    if (!this.has(vertex) || this.get(vertex) === 0) return [];

    let signs = [this.get(vertex), 0];
    let area = this.getConnectedComponent(vertex, (v: Vertex) =>
      signs.includes(this.get(v))
    );

    return area.filter((v) => this.get(v) === this.get(vertex));
  }

  getLiberties(vertex: Vertex) {
    if (!this.has(vertex) || this.get(vertex) === 0) return [];

    let chain = this.getChain(vertex);
    let liberties = [];
    let added: Map<Vertex, boolean> = new Map();

    for (let c of chain) {
      let freeNeighbors = this.getNeighbors(c).filter((n) => this.get(n) === 0);

      liberties.push(...freeNeighbors.filter((n: Vertex) => !added.has(n)));
      freeNeighbors.forEach((n) => added.set(n, true));
    }

    return liberties;
  }

  hasLiberties(
    vertex: Vertex,
    visited: Map<Vertex, boolean> = new Map()
  ): boolean {
    let sign = this.get(vertex);
    if (!this.has(vertex) || sign === 0) return false;

    if (visited.has(vertex)) return false;
    let neighbors = this.getNeighbors(vertex);

    if (neighbors.some((n) => this.get(n) === 0)) return true;

    visited.set(vertex, true);

    return neighbors
      .filter((n: Vertex) => this.get(n) === sign)
      .some((n: Vertex) => this.hasLiberties(n, visited));
  }

  clone() {
    let result = new GoBoard(this.signMap.map((row) => [...row]))
      .setCaptures(1, this.getCaptures(1))
      .setCaptures(-1, this.getCaptures(-1));

    result._koInfo = this._koInfo;

    return result;
  }

  diff(board: GoBoard) {
    if (board.width !== this.width || board.height !== this.height) {
      return null;
    }

    let result = [];

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        let sign = board.get([x, y]);
        if (this.get([x, y]) === sign) continue;

        result.push([x, y]);
      }
    }

    return result;
  }

  stringifyVertex(vertex: Vertex) {
    if (!this.has(vertex)) return "";
    return alpha[vertex[0]] + (this.height - vertex[1]);
  }

  parseVertex(coord: string[]) {
    if (coord.length < 2) return [-1, -1];

    let x = alpha.indexOf(coord[0].toUpperCase());
    let y = this.height - +coord.slice(1);
    let v: Vertex = [x, y];

    return this.has(v) ? v : [-1, -1];
  }

  getHandicapPlacement(count: number, { tygem = false } = {}) {
    if (Math.min(this.width, this.height) <= 6 || count < 2) return [];

    let [nearX, nearY] = [this.width, this.height].map((x) =>
      x >= 13 ? 3 : 2
    );
    let [farX, farY] = [this.width - nearX - 1, this.height - nearY - 1];
    let [middleX, middleY] = [this.width, this.height].map((x) => (x - 1) / 2);

    let result = !tygem
      ? [
          [nearX, farY],
          [farX, nearY],
          [farX, farY],
          [nearX, nearY],
        ]
      : [
          [nearX, farY],
          [farX, nearY],
          [nearX, nearY],
          [farX, farY],
        ];

    if (
      this.width % 2 !== 0 &&
      this.height % 2 !== 0 &&
      this.width !== 7 &&
      this.height !== 7
    ) {
      if (count === 5) result.push([middleX, middleY]);
      result.push([nearX, middleY], [farX, middleY]);

      if (count === 7) result.push([middleX, middleY]);
      result.push([middleX, nearY], [middleX, farY], [middleX, middleY]);
    } else if (this.width % 2 !== 0 && this.width !== 7) {
      result.push([middleX, nearY], [middleX, farY]);
    } else if (this.height % 2 !== 0 && this.height !== 7) {
      result.push([nearX, middleY], [farX, middleY]);
    }

    return result.slice(0, count);
  }
  static fromDimensions = (width: number, height: number | null = null) => {
    if (height == null) height = width;

    let signMap = [...Array(height)].map((_) => Array(width).fill(0));

    return new GoBoard(signMap);
  };
}
export default GoBoard;
