"use strict";

const fs = require("fs");
const path = require("path");

/**
 * @license
 * Copyright (c) 2023, Jeff Hlywa (jhlywa@gmail.com)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
var _a;
exports.__esModule = true;
exports.Chess =
  exports.validateFen =
  exports.swapColor =
  exports.algebraic =
  exports.isDigit =
  exports.PROMOTIONS =
  exports.Ox88 =
  exports.SQUARES =
  exports.FLAGS =
  exports.EMPTY =
  exports.DEFAULT_POSITION =
  exports.KING =
  exports.QUEEN =
  exports.ROOK =
  exports.BISHOP =
  exports.KNIGHT =
  exports.PAWN =
  exports.BLACK =
  exports.WHITE =
    void 0;
exports.WHITE = "w";
exports.BLACK = "b";
exports.PAWN = "p";
exports.KNIGHT = "n";
exports.BISHOP = "b";
exports.ROOK = "r";
exports.QUEEN = "q";
exports.KING = "k";
exports.DEFAULT_POSITION =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
exports.EMPTY = -1;
exports.FLAGS = {
  NORMAL: "n",
  CAPTURE: "c",
  BIG_PAWN: "b",
  EP_CAPTURE: "e",
  PROMOTION: "p",
  KSIDE_CASTLE: "k",
  QSIDE_CASTLE: "q",
};
// prettier-ignore
exports.SQUARES = [
    'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8',
    'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7',
    'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6',
    'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5',
    'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4',
    'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3',
    'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2',
    'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'
];
var BITS = {
  NORMAL: 1,
  CAPTURE: 2,
  BIG_PAWN: 4,
  EP_CAPTURE: 8,
  PROMOTION: 16,
  KSIDE_CASTLE: 32,
  QSIDE_CASTLE: 64,
};
/*
 * NOTES ABOUT 0x88 MOVE GENERATION ALGORITHM
 * ----------------------------------------------------------------------------
 * From https://github.com/jhlywa/chess.js/issues/230
 *
 * A lot of people are confused when they first see the internal representation
 * of chess.js. It uses the 0x88 Move Generation Algorithm which internally
 * stores the board as an 8x16 array. This is purely for efficiency but has a
 * couple of interesting benefits:
 *
 * 1. 0x88 offers a very inexpensive "off the board" check. Bitwise AND (&) any
 *    square with 0x88, if the result is non-zero then the square is off the
 *    board. For example, assuming a knight square A8 (0 in 0x88 notation),
 *    there are 8 possible directions in which the knight can move. These
 *    directions are relative to the 8x16 board and are stored in the
 *    PIECE_OFFSETS map. One possible move is A8 - 18 (up one square, and two
 *    squares to the left - which is off the board). 0 - 18 = -18 & 0x88 = 0x88
 *    (because of two-complement representation of -18). The non-zero result
 *    means the square is off the board and the move is illegal. Take the
 *    opposite move (from A8 to C7), 0 + 18 = 18 & 0x88 = 0. A result of zero
 *    means the square is on the board.
 *
 * 2. The relative distance (or difference) between two squares on a 8x16 board
 *    is unique and can be used to inexpensively determine if a piece on a
 *    square can attack any other arbitrary square. For example, let's see if a
 *    pawn on E7 can attack E2. The difference between E7 (20) - E2 (100) is
 *    -80. We add 119 to make the ATTACKS array index non-negative (because the
 *    worst case difference is A8 - H1 = -119). The ATTACKS array contains a
 *    bitmask of pieces that can attack from that distance and direction.
 *    ATTACKS[-80 + 119=39] gives us 24 or 0b11000 in binary. Look at the
 *    PIECE_MASKS map to determine the mask for a given piece type. In our pawn
 *    example, we would check to see if 24 & 0x1 is non-zero, which it is
 *    not. So, naturally, a pawn on E7 can't attack a piece on E2. However, a
 *    rook can since 24 & 0x8 is non-zero. The only thing left to check is that
 *    there are no blocking pieces between E7 and E2. That's where the RAYS
 *    array comes in. It provides an offset (in this case 16) to add to E7 (20)
 *    to check for blocking pieces. E7 (20) + 16 = E6 (36) + 16 = E5 (52) etc.
 */
// prettier-ignore
// eslint-disable-next-line
exports.Ox88 = {
    a8: 0, b8: 1, c8: 2, d8: 3, e8: 4, f8: 5, g8: 6, h8: 7,
    a7: 16, b7: 17, c7: 18, d7: 19, e7: 20, f7: 21, g7: 22, h7: 23,
    a6: 32, b6: 33, c6: 34, d6: 35, e6: 36, f6: 37, g6: 38, h6: 39,
    a5: 48, b5: 49, c5: 50, d5: 51, e5: 52, f5: 53, g5: 54, h5: 55,
    a4: 64, b4: 65, c4: 66, d4: 67, e4: 68, f4: 69, g4: 70, h4: 71,
    a3: 80, b3: 81, c3: 82, d3: 83, e3: 84, f3: 85, g3: 86, h3: 87,
    a2: 96, b2: 97, c2: 98, d2: 99, e2: 100, f2: 101, g2: 102, h2: 103,
    a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
};
var PAWN_OFFSETS = {
  b: [16, 32, 17, 15],
  w: [-16, -32, -17, -15],
};
var PIECE_OFFSETS = {
  n: [-18, -33, -31, -14, 18, 33, 31, 14],
  b: [-17, -15, 17, 15],
  r: [-16, 1, 16, -1],
  q: [-17, -16, -15, 1, 17, 16, 15, -1],
  k: [-17, -16, -15, 1, 17, 16, 15, -1],
};
// prettier-ignore
var ATTACKS = [
    20, 0, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 20, 0,
    0, 20, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 20, 0, 0,
    0, 0, 20, 0, 0, 0, 0, 24, 0, 0, 0, 0, 20, 0, 0, 0,
    0, 0, 0, 20, 0, 0, 0, 24, 0, 0, 0, 20, 0, 0, 0, 0,
    0, 0, 0, 0, 20, 0, 0, 24, 0, 0, 20, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 20, 2, 24, 2, 20, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 2, 53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
    24, 24, 24, 24, 24, 24, 56, 0, 56, 24, 24, 24, 24, 24, 24, 0,
    0, 0, 0, 0, 0, 2, 53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 20, 2, 24, 2, 20, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 20, 0, 0, 24, 0, 0, 20, 0, 0, 0, 0, 0,
    0, 0, 0, 20, 0, 0, 0, 24, 0, 0, 0, 20, 0, 0, 0, 0,
    0, 0, 20, 0, 0, 0, 0, 24, 0, 0, 0, 0, 20, 0, 0, 0,
    0, 20, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 20, 0, 0,
    20, 0, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 20
];
// prettier-ignore
var RAYS = [
    17, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 15, 0,
    0, 17, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 15, 0, 0,
    0, 0, 17, 0, 0, 0, 0, 16, 0, 0, 0, 0, 15, 0, 0, 0,
    0, 0, 0, 17, 0, 0, 0, 16, 0, 0, 0, 15, 0, 0, 0, 0,
    0, 0, 0, 0, 17, 0, 0, 16, 0, 0, 15, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 17, 0, 16, 0, 15, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 17, 16, 15, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 0, -1, -1, -1, -1, -1, -1, -1, 0,
    0, 0, 0, 0, 0, 0, -15, -16, -17, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, -15, 0, -16, 0, -17, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, -15, 0, 0, -16, 0, 0, -17, 0, 0, 0, 0, 0,
    0, 0, 0, -15, 0, 0, 0, -16, 0, 0, 0, -17, 0, 0, 0, 0,
    0, 0, -15, 0, 0, 0, 0, -16, 0, 0, 0, 0, -17, 0, 0, 0,
    0, -15, 0, 0, 0, 0, 0, -16, 0, 0, 0, 0, 0, -17, 0, 0,
    -15, 0, 0, 0, 0, 0, 0, -16, 0, 0, 0, 0, 0, 0, -17
];
var PIECE_MASKS = { p: 0x1, n: 0x2, b: 0x4, r: 0x8, q: 0x10, k: 0x20 };
var SYMBOLS = "pnbrqkPNBRQK";
exports.PROMOTIONS = [
  exports.KNIGHT,
  exports.BISHOP,
  exports.ROOK,
  exports.QUEEN,
];
var RANK_1 = 7;
var RANK_2 = 6;
/*
 * const RANK_3 = 5
 * const RANK_4 = 4
 * const RANK_5 = 3
 * const RANK_6 = 2
 */
var RANK_7 = 1;
var RANK_8 = 0;
var SIDES =
  ((_a = {}),
  (_a[exports.KING] = BITS.KSIDE_CASTLE),
  (_a[exports.QUEEN] = BITS.QSIDE_CASTLE),
  _a);
var ROOKS = {
  w: [
    { square: exports.Ox88.a1, flag: BITS.QSIDE_CASTLE },
    { square: exports.Ox88.h1, flag: BITS.KSIDE_CASTLE },
  ],
  b: [
    { square: exports.Ox88.a8, flag: BITS.QSIDE_CASTLE },
    { square: exports.Ox88.h8, flag: BITS.KSIDE_CASTLE },
  ],
};
var SECOND_RANK = { b: RANK_7, w: RANK_2 };
var TERMINATION_MARKERS = ["1-0", "0-1", "1/2-1/2", "*"];
// Extracts the zero-based rank of an 0x88 square.
function rank(square) {
  return square >> 4;
}
// Extracts the zero-based file of an 0x88 square.
function file(square) {
  return square & 0xf;
}
function isDigit(c) {
  return "0123456789".indexOf(c) !== -1;
}
exports.isDigit = isDigit;
// Converts a 0x88 square to algebraic notation.
function algebraic(square) {
  var f = file(square);
  var r = rank(square);
  return "abcdefgh".substring(f, f + 1) + "87654321".substring(r, r + 1);
}
exports.algebraic = algebraic;
function swapColor(color) {
  return color === exports.WHITE ? exports.BLACK : exports.WHITE;
}
exports.swapColor = swapColor;
function validateFen(fen) {
  // 1st criterion: 6 space-seperated fields?
  var tokens = fen.split(/\s+/);
  if (tokens.length !== 6) {
    return {
      ok: false,
      error: "Invalid FEN: must contain six space-delimited fields",
    };
  }
  // 2nd criterion: move number field is a integer value > 0?
  var moveNumber = parseInt(tokens[5], 10);
  if (isNaN(moveNumber) || moveNumber <= 0) {
    return {
      ok: false,
      error: "Invalid FEN: move number must be a positive integer",
    };
  }
  // 3rd criterion: half move counter is an integer >= 0?
  var halfMoves = parseInt(tokens[4], 10);
  if (isNaN(halfMoves) || halfMoves < 0) {
    return {
      ok: false,
      error:
        "Invalid FEN: half move counter number must be a non-negative integer",
    };
  }
  // 4th criterion: 4th field is a valid e.p.-string?
  if (!/^(-|[abcdefgh][36])$/.test(tokens[3])) {
    return {
      ok: false,
      error: "Invalid FEN: en-passant square is invalid",
    };
  }
  // 5th criterion: 3th field is a valid castle-string?
  if (/[^kKqQ-]/.test(tokens[2])) {
    return {
      ok: false,
      error: "Invalid FEN: castling availability is invalid",
    };
  }
  // 6th criterion: 2nd field is "w" (white) or "b" (black)?
  if (!/^(w|b)$/.test(tokens[1])) {
    return { ok: false, error: "Invalid FEN: side-to-move is invalid" };
  }
  // 7th criterion: 1st field contains 8 rows?
  var rows = tokens[0].split("/");
  if (rows.length !== 8) {
    return {
      ok: false,
      error: "Invalid FEN: piece data does not contain 8 '/'-delimited rows",
    };
  }
  // 8th criterion: every row is valid?
  for (var i = 0; i < rows.length; i++) {
    // check for right sum of fields AND not two numbers in succession
    var sumFields = 0;
    var previousWasNumber = false;
    for (var k = 0; k < rows[i].length; k++) {
      if (isDigit(rows[i][k])) {
        if (previousWasNumber) {
          return {
            ok: false,
            error: "Invalid FEN: piece data is invalid (consecutive number)",
          };
        }
        sumFields += parseInt(rows[i][k], 10);
        previousWasNumber = true;
      } else {
        if (!/^[prnbqkPRNBQK]$/.test(rows[i][k])) {
          return {
            ok: false,
            error: "Invalid FEN: piece data is invalid (invalid piece)",
          };
        }
        sumFields += 1;
        previousWasNumber = false;
      }
    }
    if (sumFields !== 8) {
      return {
        ok: false,
        error: "Invalid FEN: piece data is invalid (too many squares in rank)",
      };
    }
  }
  if (
    (tokens[3][1] == "3" && tokens[1] == "w") ||
    (tokens[3][1] == "6" && tokens[1] == "b")
  ) {
    return { ok: false, error: "Invalid FEN: illegal en-passant square" };
  }
  var kings = [
    { color: "white", regex: /K/g },
    { color: "black", regex: /k/g },
  ];
  for (var _i = 0, kings_1 = kings; _i < kings_1.length; _i++) {
    var _a = kings_1[_i],
      color = _a.color,
      regex = _a.regex;
    // if (!regex.test(tokens[0])) {
    //     return { ok: false, error: `Invalid FEN: missing ${color} king` };
    // }
    if ((tokens[0].match(regex) || []).length > 1) {
      return {
        ok: false,
        error: "Invalid FEN: too many ".concat(color, " kings"),
      };
    }
  }
  return { ok: true };
}
exports.validateFen = validateFen;
// this function is used to uniquely identify ambiguous moves
function getDisambiguator(move, moves) {
  var from = move.from;
  var to = move.to;
  var piece = move.piece;
  var ambiguities = 0;
  var sameRank = 0;
  var sameFile = 0;
  for (var i = 0, len = moves.length; i < len; i++) {
    var ambigFrom = moves[i].from;
    var ambigTo = moves[i].to;
    var ambigPiece = moves[i].piece;
    /*
     * if a move of the same piece type ends on the same to square, we'll need
     * to add a disambiguator to the algebraic notation
     */
    if (piece === ambigPiece && from !== ambigFrom && to === ambigTo) {
      ambiguities++;
      if (rank(from) === rank(ambigFrom)) {
        sameRank++;
      }
      if (file(from) === file(ambigFrom)) {
        sameFile++;
      }
    }
  }
  if (ambiguities > 0) {
    if (sameRank > 0 && sameFile > 0) {
      /*
       * if there exists a similar moving piece on the same rank and file as
       * the move in question, use the square as the disambiguator
       */
      return algebraic(from);
    } else if (sameFile > 0) {
      /*
       * if the moving piece rests on the same file, use the rank symbol as the
       * disambiguator
       */
      return algebraic(from).charAt(1);
    } else {
      // else use the file symbol
      return algebraic(from).charAt(0);
    }
  }
  return "";
}
function addMove(
  moves,
  color,
  from,
  to,
  piece,
  captured,
  flags,
  promotionType
) {
  if (captured === void 0) {
    captured = undefined;
  }
  if (flags === void 0) {
    flags = BITS.NORMAL;
  }
  if (promotionType === void 0) {
    promotionType = 0;
  }
  var r = rank(to);
  if (
    piece === exports.PAWN &&
    (r === RANK_1 || r === RANK_8) &&
    exports.PROMOTIONS[promotionType]
  ) {
    // fixed promotion
    var promotion = exports.PROMOTIONS[promotionType];
    moves.push({
      color: color,
      from: from,
      to: to,
      piece: piece,
      captured: captured,
      promotion: promotion,
      flags: flags | BITS.PROMOTION,
    });
  } else if (promotionType === 4) {
    // no promotion
    moves.push({
      color: color,
      from: from,
      to: to,
      piece: piece,
      captured: captured,
      flags: flags,
    });
  } else if (promotionType === 5) {
    // select promotion
    for (var i = 0; i < exports.PROMOTIONS.length; i++) {
      var promotion = exports.PROMOTIONS[i];
      moves.push({
        color: color,
        from: from,
        to: to,
        piece: piece,
        captured: captured,
        promotion: promotion,
        flags: flags | BITS.PROMOTION,
      });
    }
  } else {
    moves.push({
      color: color,
      from: from,
      to: to,
      piece: piece,
      captured: captured,
      flags: flags,
    });
  }
}
function inferPieceType(san) {
  var pieceType = san.charAt(0);
  if (pieceType >= "a" && pieceType <= "h") {
    var matches = san.match(/[a-h]\d.*[a-h]\d/);
    if (matches) {
      return undefined;
    }
    return exports.PAWN;
  }
  pieceType = pieceType.toLowerCase();
  if (pieceType === "o") {
    return exports.KING;
  }
  return pieceType;
}
// parses all of the decorators out of a SAN string
function strippedSan(move) {
  return move.replace(/=/, "").replace(/[+#]?[?!]*$/, "");
}
var Chess = /** @class */ (function () {
  function Chess(rule, fen) {
    if (rule === void 0) {
      rule = {
        // QUEEN
        promotionType: 3,
        pawnRule: true,
        pawnAttackRule: true,
        kingSwapRule: true,
        turnRule: true,
      };
    }
    if (fen === void 0) {
      fen = exports.DEFAULT_POSITION;
    }
    this._board = new Array(128);
    this._turn = exports.WHITE;
    this._header = {};
    this._kings = { w: exports.EMPTY, b: exports.EMPTY };
    this._epSquare = -1;
    this._halfMoves = 0;
    this._moveNumber = 0;
    this._history = [];
    this._comments = {};
    this._castling = { w: 0, b: 0 };
    this.rule = {
      promotionType: 3,
      pawnRule: false,
      pawnAttackRule: true,
      kingSwapRule: true,
      turnRule: true,
    };
    this.rule = rule;
    this.load(fen);
  }
  Chess.prototype.clear = function (keepHeaders) {
    if (keepHeaders === void 0) {
      keepHeaders = false;
    }
    this._board = new Array(128);
    this._kings = { w: exports.EMPTY, b: exports.EMPTY };
    this._turn = exports.WHITE;
    this._castling = { w: 0, b: 0 };
    this._epSquare = exports.EMPTY;
    this._halfMoves = 0;
    this._moveNumber = 1;
    this._history = [];
    this._comments = {};
    this._header = keepHeaders ? this._header : {};
    this._updateSetup(this.fen());
  };
  Chess.prototype.removeHeader = function (key) {
    if (key in this._header) {
      delete this._header[key];
    }
  };
  Chess.prototype.load = function (fen, keepHeaders) {
    if (keepHeaders === void 0) {
      keepHeaders = false;
    }
    var tokens = fen.split(/\s+/);
    // append commonly omitted fen tokens
    if (tokens.length >= 2 && tokens.length < 6) {
      var adjustments = ["-", "-", "0", "1"];
      fen = tokens.concat(adjustments.slice(-(6 - tokens.length))).join(" ");
    }
    tokens = fen.split(/\s+/);
    var _a = validateFen(fen),
      ok = _a.ok,
      error = _a.error;
    if (!ok) {
      throw new Error(error);
    }
    var position = tokens[0];
    var square = 0;
    this.clear(keepHeaders);
    for (var i = 0; i < position.length; i++) {
      var piece = position.charAt(i);
      if (piece === "/") {
        square += 8;
      } else if (isDigit(piece)) {
        square += parseInt(piece, 10);
      } else {
        var color = piece < "a" ? exports.WHITE : exports.BLACK;
        this.put(
          { type: piece.toLowerCase(), color: color },
          algebraic(square)
        );
        square++;
      }
    }
    this._turn = tokens[1];
    if (tokens[2].indexOf("K") > -1) {
      this._castling.w |= BITS.KSIDE_CASTLE;
    }
    if (tokens[2].indexOf("Q") > -1) {
      this._castling.w |= BITS.QSIDE_CASTLE;
    }
    if (tokens[2].indexOf("k") > -1) {
      this._castling.b |= BITS.KSIDE_CASTLE;
    }
    if (tokens[2].indexOf("q") > -1) {
      this._castling.b |= BITS.QSIDE_CASTLE;
    }
    this._epSquare =
      tokens[3] === "-" ? exports.EMPTY : exports.Ox88[tokens[3]];
    this._halfMoves = parseInt(tokens[4], 10);
    this._moveNumber = parseInt(tokens[5], 10);
    this._updateSetup(this.fen());
  };
  Chess.prototype.fen = function () {
    var empty = 0;
    var fen = "";
    for (var i = exports.Ox88.a8; i <= exports.Ox88.h1; i++) {
      if (this._board[i]) {
        if (empty > 0) {
          fen += empty;
          empty = 0;
        }
        var _a = this._board[i],
          color = _a.color,
          piece = _a.type;
        fen +=
          color === exports.WHITE ? piece.toUpperCase() : piece.toLowerCase();
      } else {
        empty++;
      }
      if ((i + 1) & 0x88) {
        if (empty > 0) {
          fen += empty;
        }
        if (i !== exports.Ox88.h1) {
          fen += "/";
        }
        empty = 0;
        i += 8;
      }
    }
    var castling = "";
    if (this._castling[exports.WHITE] & BITS.KSIDE_CASTLE) {
      castling += "K";
    }
    if (this._castling[exports.WHITE] & BITS.QSIDE_CASTLE) {
      castling += "Q";
    }
    if (this._castling[exports.BLACK] & BITS.KSIDE_CASTLE) {
      castling += "k";
    }
    if (this._castling[exports.BLACK] & BITS.QSIDE_CASTLE) {
      castling += "q";
    }
    // do we have an empty castling flag?
    castling = castling || "-";
    var epSquare = "-";
    /*
     * only print the ep square if en passant is a valid move (pawn is present
     * and ep capture is not pinned)
     */
    if (this._epSquare !== exports.EMPTY) {
      var bigPawnSquare =
        this._epSquare + (this._turn === exports.WHITE ? 16 : -16);
      var squares = [bigPawnSquare + 1, bigPawnSquare - 1];
      for (var _i = 0, squares_1 = squares; _i < squares_1.length; _i++) {
        var square = squares_1[_i];
        // is the square off the board?
        if (square & 0x88) {
          continue;
        }
        var color = this._turn;
        // is there a pawn that can capture the epSquare?
        if (
          this._board[square] &&
          this._board[square].color === color &&
          this._board[square] &&
          this._board[square].type === exports.PAWN
        ) {
          // if the pawn makes an ep capture, does it leave it's king in check?
          this._makeMove({
            color: color,
            from: square,
            to: this._epSquare,
            piece: exports.PAWN,
            captured: exports.PAWN,
            flags: BITS.EP_CAPTURE,
          });
          var isLegal = !this._isKingAttacked(color);
          this._undoMove();
          // if ep is legal, break and set the ep square in the FEN output
          if (isLegal) {
            epSquare = algebraic(this._epSquare);
            break;
          }
        }
      }
    }
    return [
      fen,
      this._turn,
      castling,
      epSquare,
      this._halfMoves,
      this._moveNumber,
    ].join(" ");
  };
  /*
   * Called when the initial board setup is changed with put() or remove().
   * modifies the SetUp and FEN properties of the header object. If the FEN
   * is equal to the default position, the SetUp and FEN are deleted the setup
   * is only updated if history.length is zero, ie moves haven't been made.
   */
  Chess.prototype._updateSetup = function (fen) {
    if (this._history.length > 0) return;
    if (fen !== exports.DEFAULT_POSITION) {
      this._header["SetUp"] = "1";
      this._header["FEN"] = fen;
    } else {
      delete this._header["SetUp"];
      delete this._header["FEN"];
    }
  };
  Chess.prototype.reset = function () {
    this.load(exports.DEFAULT_POSITION);
  };
  Chess.prototype.get = function (square) {
    return this._board[exports.Ox88[square]] || false;
  };
  Chess.prototype.put = function (_a, square) {
    var type = _a.type,
      color = _a.color;
    // check for piece
    if (SYMBOLS.indexOf(type.toLowerCase()) === -1) {
      return false;
    }
    // check for valid square
    if (!(square in exports.Ox88)) {
      return false;
    }
    var sq = exports.Ox88[square];
    // don't let the user place more than one king
    if (
      type == exports.KING &&
      !(this._kings[color] == exports.EMPTY || this._kings[color] == sq)
    ) {
      return false;
    }
    this._board[sq] = { type: type, color: color };
    if (type === exports.KING) {
      this._kings[color] = sq;
    }
    this._updateCastlingRights();
    this._updateEnPassantSquare();
    this._updateSetup(this.fen());
    return true;
  };
  Chess.prototype.remove = function (square) {
    var piece = this.get(square);
    delete this._board[exports.Ox88[square]];
    if (piece && piece.type === exports.KING) {
      this._kings[piece.color] = exports.EMPTY;
    }
    this._updateCastlingRights();
    this._updateEnPassantSquare();
    this._updateSetup(this.fen());
    return piece;
  };
  Chess.prototype._updateCastlingRights = function () {
    var whiteKingInPlace =
      this._board[exports.Ox88.e1] &&
      this._board[exports.Ox88.e1].type === exports.KING &&
      this._board[exports.Ox88.e1] &&
      this._board[exports.Ox88.e1].color === exports.WHITE;
    var blackKingInPlace =
      this._board[exports.Ox88.e8] &&
      this._board[exports.Ox88.e8].type === exports.KING &&
      this._board[exports.Ox88.e8] &&
      this._board[exports.Ox88.e8].color === exports.BLACK;
    if (
      !whiteKingInPlace ||
      (this._board[exports.Ox88.a1] &&
        this._board[exports.Ox88.a1].type !== exports.ROOK) ||
      (this._board[exports.Ox88.a1] &&
        this._board[exports.Ox88.a1].color !== exports.WHITE)
    ) {
      this._castling.w &= ~BITS.QSIDE_CASTLE;
    }
    if (
      !whiteKingInPlace ||
      (this._board[exports.Ox88.h1] &&
        this._board[exports.Ox88.h1].type !== exports.ROOK) ||
      (this._board[exports.Ox88.h1] &&
        this._board[exports.Ox88.h1].color !== exports.WHITE)
    ) {
      this._castling.w &= ~BITS.KSIDE_CASTLE;
    }
    if (
      !blackKingInPlace ||
      (this._board[exports.Ox88.a8] &&
        this._board[exports.Ox88.a8].type !== exports.ROOK) ||
      (this._board[exports.Ox88.a8] &&
        this._board[exports.Ox88.a8].color !== exports.BLACK)
    ) {
      this._castling.b &= ~BITS.QSIDE_CASTLE;
    }
    if (
      !blackKingInPlace ||
      (this._board[exports.Ox88.h8] &&
        this._board[exports.Ox88.h8].type !== exports.ROOK) ||
      (this._board[exports.Ox88.h8] &&
        this._board[exports.Ox88.h8].color !== exports.BLACK)
    ) {
      this._castling.b &= ~BITS.KSIDE_CASTLE;
    }
  };
  Chess.prototype._updateEnPassantSquare = function () {
    var _this = this;
    if (this._epSquare === exports.EMPTY) {
      return;
    }
    var startSquare =
      this._epSquare + (this._turn === exports.WHITE ? -16 : 16);
    var currentSquare =
      this._epSquare + (this._turn === exports.WHITE ? 16 : -16);
    var attackers = [currentSquare + 1, currentSquare - 1];
    if (
      this._board[startSquare] !== null ||
      this._board[this._epSquare] !== null ||
      (this._board[currentSquare] &&
        this._board[currentSquare].color !== swapColor(this._turn)) ||
      (this._board[currentSquare] &&
        this._board[currentSquare].type !== exports.PAWN)
    ) {
      this._epSquare = exports.EMPTY;
      return;
    }
    var canCapture = function (square) {
      return (
        !(square & 0x88) &&
        _this._board[square] &&
        _this._board[square].color === _this._turn &&
        _this._board[square] &&
        _this._board[square].type === exports.PAWN
      );
    };
    if (!attackers.some(canCapture)) {
      this._epSquare = exports.EMPTY;
    }
  };
  Chess.prototype._attacked = function (color, square) {
    for (var i = exports.Ox88.a8; i <= exports.Ox88.h1; i++) {
      // did we run off the end of the board
      if (i & 0x88) {
        i += 7;
        continue;
      }
      // if empty square or wrong color
      if (this._board[i] === undefined || this._board[i].color !== color) {
        continue;
      }
      var piece = this._board[i];
      var difference = i - square;
      // skip - to/from square are the same
      if (difference === 0) {
        continue;
      }
      var index = difference + 119;
      if (ATTACKS[index] & PIECE_MASKS[piece.type]) {
        if (piece.type === exports.PAWN) {
          if (difference > 0) {
            if (piece.color === exports.WHITE) return true;
          } else {
            if (piece.color === exports.BLACK) return true;
          }
          continue;
        }
        // if the piece is a knight or a king
        if (piece.type === "n" || piece.type === "k") return true;
        var offset = RAYS[index];
        var j = i + offset;
        var blocked = false;
        while (j !== square) {
          if (this._board[j] != null) {
            blocked = true;
            break;
          }
          j += offset;
        }
        if (!blocked) return true;
      }
    }
    return false;
  };
  Chess.prototype._isKingAttacked = function (color) {
    var square = this._kings[color];
    return square === -1 ? false : this._attacked(swapColor(color), square);
  };
  Chess.prototype.isAttacked = function (square, attackedBy) {
    return this._attacked(attackedBy, exports.Ox88[square]);
  };
  Chess.prototype.isCheck = function () {
    return this._isKingAttacked(this._turn);
  };
  Chess.prototype.inCheck = function () {
    return this.isCheck();
  };
  Chess.prototype.isCheckmate = function () {
    return this.isCheck() && this._moves().length === 0;
  };
  Chess.prototype.isStalemate = function () {
    return !this.isCheck() && this._moves().length === 0;
  };
  Chess.prototype.isInsufficientMaterial = function () {
    /*
     * k.b. vs k.b. (of opposite colors) with mate in 1:
     * 8/8/8/8/1b6/8/B1k5/K7 b - - 0 1
     *
     * k.b. vs k.n. with mate in 1:
     * 8/8/8/8/1n6/8/B7/K1k5 b - - 2 1
     */
    var pieces = {
      b: 0,
      n: 0,
      r: 0,
      q: 0,
      k: 0,
      p: 0,
    };
    var bishops = [];
    var numPieces = 0;
    var squareColor = 0;
    for (var i = exports.Ox88.a8; i <= exports.Ox88.h1; i++) {
      squareColor = (squareColor + 1) % 2;
      if (i & 0x88) {
        i += 7;
        continue;
      }
      var piece = this._board[i];
      if (piece) {
        pieces[piece.type] = piece.type in pieces ? pieces[piece.type] + 1 : 1;
        if (piece.type === exports.BISHOP) {
          bishops.push(squareColor);
        }
        numPieces++;
      }
    }
    // k vs. k
    if (numPieces === 2) {
      return true;
    } else if (
      // k vs. kn .... or .... k vs. kb
      numPieces === 3 &&
      (pieces[exports.BISHOP] === 1 || pieces[exports.KNIGHT] === 1)
    ) {
      return true;
    } else if (numPieces === pieces[exports.BISHOP] + 2) {
      // kb vs. kb where any number of bishops are all on the same color
      var sum = 0;
      var len = bishops.length;
      for (var i = 0; i < len; i++) {
        sum += bishops[i];
      }
      if (sum === 0 || sum === len) {
        return true;
      }
    }
    return false;
  };
  Chess.prototype.removeChess = function (square) {
    delete this._board[exports.Ox88[square]];
  };
  Chess.prototype.isThreefoldRepetition = function () {
    var moves = [];
    var positions = {};
    var repetition = false;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      var move = this._undoMove();
      if (!move) break;
      moves.push(move);
    }
    // eslint-disable-next-line no-constant-condition
    while (true) {
      /*
       * remove the last two fields in the FEN string, they're not needed when
       * checking for draw by rep
       */
      var fen = this.fen().split(" ").slice(0, 4).join(" ");
      // has the position occurred three or move times
      positions[fen] = fen in positions ? positions[fen] + 1 : 1;
      if (positions[fen] >= 3) {
        repetition = true;
      }
      var move = moves.pop();
      if (!move) {
        break;
      } else {
        this._makeMove(move);
      }
    }
    return repetition;
  };
  Chess.prototype.isDraw = function () {
    return (
      this._halfMoves >= 100 || // 50 moves per side = 100 half moves
      this.isStalemate() ||
      this.isInsufficientMaterial() ||
      this.isThreefoldRepetition()
    );
  };
  Chess.prototype.isGameOver = function () {
    return this.isCheckmate() || this.isStalemate() || this.isDraw();
  };
  Chess.prototype.moves = function (_a) {
    var _this = this;
    var _b = _a === void 0 ? {} : _a,
      _c = _b.verbose,
      verbose = _c === void 0 ? false : _c,
      _d = _b.square,
      square = _d === void 0 ? undefined : _d,
      _e = _b.piece,
      piece = _e === void 0 ? undefined : _e;
    var moves = this._moves({ square: square, piece: piece });
    if (verbose) {
      return moves.map(function (move) {
        return _this._makePretty(move);
      });
    } else {
      return moves.map(function (move) {
        return _this._moveToSan(move, moves);
      });
    }
  };
  Chess.prototype._moves = function (_a) {
    var _b = _a === void 0 ? {} : _a,
      _c = _b.legal,
      legal = _c === void 0 ? true : _c,
      _d = _b.piece,
      piece = _d === void 0 ? undefined : _d,
      _e = _b.square,
      square = _e === void 0 ? undefined : _e;
    var forSquare = square ? square.toLowerCase() : undefined;
    var forPiece = piece && piece.toLowerCase();
    var moves = [];
    var us = this._turn;
    var them = swapColor(us);
    var firstSquare = exports.Ox88.a8;
    var lastSquare = exports.Ox88.h1;
    var singleSquare = false;
    // are we generating moves for a single square?
    if (forSquare) {
      // illegal square, return empty moves
      if (!(forSquare in exports.Ox88)) {
        return [];
      } else {
        firstSquare = lastSquare = exports.Ox88[forSquare];
        singleSquare = true;
      }
    }
    for (var from = firstSquare; from <= lastSquare; from++) {
      // did we run off the end of the board
      if (from & 0x88) {
        from += 7;
        continue;
      }
      // empty square or opponent, skip
      if (!this._board[from] || this._board[from].color === them) {
        continue;
      }
      var type = this._board[from].type;
      var to = void 0;
      if (type === exports.PAWN) {
        if (forPiece && forPiece !== type) continue;
        // single square, non-capturing
        to = from + PAWN_OFFSETS[us][0];
        if (!this._board[to]) {
          addMove(
            moves,
            us,
            from,
            to,
            exports.PAWN,
            undefined,
            BITS.NORMAL,
            this.rule.promotionType
          );
          // double square
          to = from + PAWN_OFFSETS[us][1];
          if (SECOND_RANK[us] === rank(from) && !this._board[to]) {
            addMove(
              moves,
              us,
              from,
              to,
              exports.PAWN,
              undefined,
              BITS.BIG_PAWN,
              this.rule.promotionType
            );
          }
        }
        // pawn captures
        for (var j = 2; j < 4; j++) {
          to = from + PAWN_OFFSETS[us][j];
          if (to & 0x88) continue;
          if (this._board[to] && this._board[to].color === them) {
            addMove(
              moves,
              us,
              from,
              to,
              exports.PAWN,
              this._board[to].type,
              BITS.CAPTURE,
              this.rule.promotionType
            );
          } else if (to === this._epSquare) {
            addMove(
              moves,
              us,
              from,
              to,
              exports.PAWN,
              exports.PAWN,
              BITS.EP_CAPTURE,
              this.rule.promotionType
            );
          }
        }
      } else {
        if (forPiece && forPiece !== type) continue;
        for (var j = 0, len = PIECE_OFFSETS[type].length; j < len; j++) {
          var offset = PIECE_OFFSETS[type][j];
          to = from;
          // eslint-disable-next-line no-constant-condition
          while (true) {
            to += offset;
            if (to & 0x88) break;
            if (!this._board[to]) {
              addMove(
                moves,
                us,
                from,
                to,
                type,
                undefined,
                BITS.NORMAL,
                this.rule.promotionType
              );
            } else {
              // own color, stop loop
              if (this._board[to].color === us) break;
              addMove(
                moves,
                us,
                from,
                to,
                type,
                this._board[to].type,
                BITS.CAPTURE,
                this.rule.promotionType
              );
              break;
            }
            /* break, if knight or king */
            if (type === exports.KNIGHT || type === exports.KING) break;
          }
        }
      }
    }
    /*
     * check for castling if we're:
     *   a) generating all moves, or
     *   b) doing single square move generation on the king's square
     */
    if (forPiece === undefined || forPiece === exports.KING) {
      if (!singleSquare || lastSquare === this._kings[us]) {
        // king-side castling
        if (this._castling[us] & BITS.KSIDE_CASTLE) {
          var castlingFrom = this._kings[us];
          var castlingTo = castlingFrom + 2;
          if (
            !this._board[castlingFrom + 1] &&
            !this._board[castlingTo] &&
            !this._attacked(them, this._kings[us]) &&
            !this._attacked(them, castlingFrom + 1) &&
            !this._attacked(them, castlingTo)
          ) {
            addMove(
              moves,
              us,
              this._kings[us],
              castlingTo,
              exports.KING,
              undefined,
              BITS.KSIDE_CASTLE,
              this.rule.promotionType
            );
          }
        }
        // queen-side castling
        if (this._castling[us] & BITS.QSIDE_CASTLE) {
          var castlingFrom = this._kings[us];
          var castlingTo = castlingFrom - 2;
          if (
            !this._board[castlingFrom - 1] &&
            !this._board[castlingFrom - 2] &&
            !this._board[castlingFrom - 3] &&
            !this._attacked(them, this._kings[us]) &&
            !this._attacked(them, castlingFrom - 1) &&
            !this._attacked(them, castlingTo)
          ) {
            addMove(
              moves,
              us,
              this._kings[us],
              castlingTo,
              exports.KING,
              undefined,
              BITS.QSIDE_CASTLE,
              this.rule.promotionType
            );
          }
        }
      }
    }
    /*
     * return all pseudo-legal moves (this includes moves that allow the king
     * to be captured)
     */
    if (!legal || this._kings[us] === -1) {
      return moves;
    }
    // filter out illegal moves
    var legalMoves = [];
    for (var i = 0, len = moves.length; i < len; i++) {
      this._makeMove(moves[i]);
      if (!this._isKingAttacked(us)) {
        legalMoves.push(moves[i]);
      }
      this._undoMove();
    }
    return legalMoves;
  };
  Chess.prototype.move = function (move, _a) {
    /*
     * The move function can be called with in the following parameters:
     *
     * .move('Nxb7')       <- argument is a case-sensitive SAN string
     *
     * .move({ from: 'h7', <- argument is a move object
     *         to :'h8',
     *         promotion: 'q' })
     *
     *
     * An optional strict argument may be supplied to tell chess.js to
     * strictly follow the SAN specification.
     */
    var _b = _a === void 0 ? {} : _a,
      _c = _b.strict,
      strict = _c === void 0 ? false : _c;
    var moveObj = null;
    if (typeof move === "string") {
      moveObj = this._moveFromSan(move, strict);
    } else if (typeof move === "object") {
      var moves = this._moves();
      // convert the pretty move object to an ugly move object
      for (var i = 0, len = moves.length; i < len; i++) {
        if (
          move.from === algebraic(moves[i].from) &&
          move.to === algebraic(moves[i].to) &&
          (!("promotion" in moves[i]) || move.promotion === moves[i].promotion)
        ) {
          moveObj = moves[i];
          break;
        }
      }
    }
    // failed to find move
    if (!moveObj) {
      if (typeof move === "string") {
        throw new Error("Invalid move: ".concat(move));
      } else {
        throw new Error("Invalid move: ".concat(JSON.stringify(move)));
      }
    }
    /*
     * need to make a copy of move because we can't generate SAN after the move
     * is made
     */
    var prettyMove = this._makePretty(moveObj);
    this._makeMove(moveObj);
    return prettyMove;
  };
  Chess.prototype.pushHistory = function (m) {
    var move = this.convertToMove(m);
    this._push(move);
  };
  Chess.prototype._push = function (move) {
    this._history.push({
      move: move,
      kings: { b: this._kings.b, w: this._kings.w },
      turn: this._turn,
      castling: { b: this._castling.b, w: this._castling.w },
      epSquare: this._epSquare,
      halfMoves: this._halfMoves,
      moveNumber: this._moveNumber,
    });
  };
  Chess.prototype._makeMove = function (move) {
    var us = this._turn;
    var them = swapColor(us);
    this._push(move);
    this._board[move.to] = this._board[move.from];
    delete this._board[move.from];
    // if ep capture, remove the captured pawn
    if (move.flags & BITS.EP_CAPTURE && this.rule.pawnAttackRule) {
      if (this._turn === exports.BLACK) {
        delete this._board[move.to - 16];
      } else {
        delete this._board[move.to + 16];
      }
    }
    // if pawn promotion, replace with new piece
    if (move.promotion) {
      this._board[move.to] = { type: move.promotion, color: us };
    }
    // if we moved the king
    if (this._board[move.to].type === exports.KING) {
      this._kings[us] = move.to;
      // if we castled, move the rook next to the king
      if (this.rule.kingSwapRule) {
        if (move.flags & BITS.KSIDE_CASTLE) {
          var castlingTo = move.to - 1;
          var castlingFrom = move.to + 1;
          this._board[castlingTo] = this._board[castlingFrom];
          delete this._board[castlingFrom];
        } else if (move.flags & BITS.QSIDE_CASTLE) {
          var castlingTo = move.to + 1;
          var castlingFrom = move.to - 2;
          this._board[castlingTo] = this._board[castlingFrom];
          delete this._board[castlingFrom];
        }
      }
      // turn off castling
      this._castling[us] = 0;
    }
    // turn off castling if we move a rook
    if (this._castling[us]) {
      for (var i = 0, len = ROOKS[us].length; i < len; i++) {
        if (
          move.from === ROOKS[us][i].square &&
          this._castling[us] & ROOKS[us][i].flag
        ) {
          this._castling[us] ^= ROOKS[us][i].flag;
          break;
        }
      }
    }
    // turn off castling if we capture a rook
    if (this._castling[them]) {
      for (var i = 0, len = ROOKS[them].length; i < len; i++) {
        if (
          move.to === ROOKS[them][i].square &&
          this._castling[them] & ROOKS[them][i].flag
        ) {
          this._castling[them] ^= ROOKS[them][i].flag;
          break;
        }
      }
    }
    // if big pawn move, update the en passant square
    if (move.flags & BITS.BIG_PAWN && this.rule.pawnRule) {
      if (us === exports.BLACK) {
        this._epSquare = move.to - 16;
      } else {
        this._epSquare = move.to + 16;
      }
    } else {
      this._epSquare = exports.EMPTY;
    }
    // reset the 50 move counter if a pawn is moved or a piece is captured
    if (move.piece === exports.PAWN) {
      this._halfMoves = 0;
    } else if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
      this._halfMoves = 0;
    } else {
      this._halfMoves++;
    }
    if (us === exports.BLACK) {
      this._moveNumber++;
    }
    if (this.rule.turnRule) {
      this._turn = them;
    }
  };
  Chess.prototype.undo = function () {
    var move = this._undoMove();
    return move ? this._makePretty(move) : null;
  };
  Chess.prototype._undoMove = function () {
    var old = this._history.pop();
    if (old === undefined) {
      return null;
    }
    var move = old.move;
    this._kings = old.kings;
    this._turn = old.turn;
    this._castling = old.castling;
    this._epSquare = old.epSquare;
    this._halfMoves = old.halfMoves;
    this._moveNumber = old.moveNumber;
    var us = this._turn;
    var them = swapColor(us);
    this._board[move.from] = this._board[move.to];
    this._board[move.from].type = move.piece; // to undo any promotions
    delete this._board[move.to];
    if (move.captured) {
      if (move.flags & BITS.EP_CAPTURE) {
        // en passant capture
        var index = void 0;
        if (us === exports.BLACK) {
          index = move.to - 16;
        } else {
          index = move.to + 16;
        }
        this._board[index] = { type: exports.PAWN, color: them };
      } else {
        // regular capture
        this._board[move.to] = { type: move.captured, color: them };
      }
    }
    if (move.flags & (BITS.KSIDE_CASTLE | BITS.QSIDE_CASTLE)) {
      var castlingTo = void 0,
        castlingFrom = void 0;
      if (move.flags & BITS.KSIDE_CASTLE) {
        castlingTo = move.to + 1;
        castlingFrom = move.to - 1;
      } else {
        castlingTo = move.to - 2;
        castlingFrom = move.to + 1;
      }
      this._board[castlingTo] = this._board[castlingFrom];
      delete this._board[castlingFrom];
    }
    return move;
  };
  Chess.prototype.pgn = function (_a) {
    /*
     * using the specification from http://www.chessclub.com/help/PGN-spec
     * example for html usage: .pgn({ max_width: 72, newline_char: "<br />" })
     */
    var _this = this;
    var _b = _a === void 0 ? {} : _a,
      _c = _b.newline,
      newline = _c === void 0 ? "\n" : _c,
      _d = _b.maxWidth,
      maxWidth = _d === void 0 ? 0 : _d;
    var result = [];
    var headerExists = false;
    /* add the PGN header information */
    for (var i in this._header) {
      /*
       * TODO: order of enumerated properties in header object is not
       * guaranteed, see ECMA-262 spec (section 12.6.4)
       */
      result.push("[" + i + ' "' + this._header[i] + '"]' + newline);
      headerExists = true;
    }
    if (headerExists && this._history.length) {
      result.push(newline);
    }
    var appendComment = function (moveString) {
      var comment = _this._comments[_this.fen()];
      if (typeof comment !== "undefined") {
        var delimiter = moveString.length > 0 ? " " : "";
        moveString = ""
          .concat(moveString)
          .concat(delimiter, "{")
          .concat(comment, "}");
      }
      return moveString;
    };
    // pop all of history onto reversed_history
    var reversedHistory = [];
    while (this._history.length > 0) {
      reversedHistory.push(this._undoMove());
    }
    var moves = [];
    var moveString = "";
    // special case of a commented starting position with no moves
    if (reversedHistory.length === 0) {
      moves.push(appendComment(""));
    }
    // build the list of moves.  a move_string looks like: "3. e3 e6"
    while (reversedHistory.length > 0) {
      moveString = appendComment(moveString);
      var move = reversedHistory.pop();
      // make TypeScript stop complaining about move being undefined
      if (!move) {
        break;
      }
      // if the position started with black to move, start PGN with #. ...
      if (!this._history.length && move.color === "b") {
        var prefix = "".concat(this._moveNumber, ". ...");
        // is there a comment preceding the first move?
        moveString = moveString
          ? "".concat(moveString, " ").concat(prefix)
          : prefix;
      } else if (move.color === "w") {
        // store the previous generated move_string if we have one
        if (moveString.length) {
          moves.push(moveString);
        }
        moveString = this._moveNumber + ".";
      }
      moveString =
        moveString + " " + this._moveToSan(move, this._moves({ legal: true }));
      this._makeMove(move);
    }
    // are there any other leftover moves?
    if (moveString.length) {
      moves.push(appendComment(moveString));
    }
    // is there a result?
    if (typeof this._header.Result !== "undefined") {
      moves.push(this._header.Result);
    }
    /*
     * history should be back to what it was before we started generating PGN,
     * so join together moves
     */
    if (maxWidth === 0) {
      return result.join("") + moves.join(" ");
    }
    // TODO (jah): huh?
    var strip = function () {
      if (result.length > 0 && result[result.length - 1] === " ") {
        result.pop();
        return true;
      }
      return false;
    };
    // NB: this does not preserve comment whitespace.
    var wrapComment = function (width, move) {
      for (var _i = 0, _a = move.split(" "); _i < _a.length; _i++) {
        var token = _a[_i];
        if (!token) {
          continue;
        }
        if (width + token.length > maxWidth) {
          while (strip()) {
            width--;
          }
          result.push(newline);
          width = 0;
        }
        result.push(token);
        width += token.length;
        result.push(" ");
        width++;
      }
      if (strip()) {
        width--;
      }
      return width;
    };
    // wrap the PGN output at max_width
    var currentWidth = 0;
    for (var i = 0; i < moves.length; i++) {
      if (currentWidth + moves[i].length > maxWidth) {
        if (moves[i].includes("{")) {
          currentWidth = wrapComment(currentWidth, moves[i]);
          continue;
        }
      }
      // if the current move will push past max_width
      if (currentWidth + moves[i].length > maxWidth && i !== 0) {
        // don't end the line with whitespace
        if (result[result.length - 1] === " ") {
          result.pop();
        }
        result.push(newline);
        currentWidth = 0;
      } else if (i !== 0) {
        result.push(" ");
        currentWidth++;
      }
      result.push(moves[i]);
      currentWidth += moves[i].length;
    }
    return result.join("");
  };
  Chess.prototype.header = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    for (var i = 0; i < args.length; i += 2) {
      if (typeof args[i] === "string" && typeof args[i + 1] === "string") {
        this._header[args[i]] = args[i + 1];
      }
    }
    return this._header;
  };
  Chess.prototype.loadPgn = function (pgn, _a) {
    var _b = _a === void 0 ? {} : _a,
      _c = _b.strict,
      strict = _c === void 0 ? false : _c,
      _d = _b.newlineChar,
      newlineChar = _d === void 0 ? "\r?\n" : _d;
    function mask(str) {
      return str.replace(/\\/g, "\\");
    }
    function parsePgnHeader(header) {
      var headerObj = {};
      var headers = header.split(new RegExp(mask(newlineChar)));
      var key = "";
      var value = "";
      for (var i = 0; i < headers.length; i++) {
        var regex = /^\s*\[\s*([A-Za-z]+)\s*"(.*)"\s*\]\s*$/;
        key = headers[i].replace(regex, "$1");
        value = headers[i].replace(regex, "$2");
        if (key.trim().length > 0) {
          headerObj[key] = value;
        }
      }
      return headerObj;
    }
    // strip whitespace from head/tail of PGN block
    pgn = pgn.trim();
    /*
     * RegExp to split header. Takes advantage of the fact that header and movetext
     * will always have a blank line between them (ie, two newline_char's). Handles
     * case where movetext is empty by matching newlineChar until end of string is
     * matched - effectively trimming from the end extra newlineChar.
     *
     * With default newline_char, will equal:
     * /^(\[((?:\r?\n)|.)*\])((?:\s*\r?\n){2}|(?:\s*\r?\n)*$)/
     */
    var headerRegex = new RegExp(
      "^(\\[((?:" +
        mask(newlineChar) +
        ")|.)*\\])" +
        "((?:\\s*" +
        mask(newlineChar) +
        "){2}|(?:\\s*" +
        mask(newlineChar) +
        ")*$)"
    );
    // If no header given, begin with moves.
    var headerRegexResults = headerRegex.exec(pgn);
    var headerString = headerRegexResults
      ? headerRegexResults.length >= 2
        ? headerRegexResults[1]
        : ""
      : "";
    // Put the board in the starting position
    this.reset();
    // parse PGN header
    var headers = parsePgnHeader(headerString);
    var fen = "";
    for (var key in headers) {
      // check to see user is including fen (possibly with wrong tag case)
      if (key.toLowerCase() === "fen") {
        fen = headers[key];
      }
      this.header(key, headers[key]);
    }
    /*
     * the permissive parser should attempt to load a fen tag, even if it's the
     * wrong case and doesn't include a corresponding [SetUp "1"] tag
     */
    if (!strict) {
      if (fen) {
        this.load(fen, true);
      }
    } else {
      /*
       * strict parser - load the starting position indicated by [Setup '1']
       * and [FEN position]
       */
      if (headers["SetUp"] === "1") {
        if (!("FEN" in headers)) {
          throw new Error(
            "Invalid PGN: FEN tag must be supplied with SetUp tag"
          );
        }
        // second argument to load: don't clear the headers
        this.load(headers["FEN"], true);
      }
    }
    /*
     * NB: the regexes below that delete move numbers, recursive annotations,
     * and numeric annotation glyphs may also match text in comments. To
     * prevent this, we transform comments by hex-encoding them in place and
     * decoding them again after the other tokens have been deleted.
     *
     * While the spec states that PGN files should be ASCII encoded, we use
     * {en,de}codeURIComponent here to support arbitrary UTF8 as a convenience
     * for modern users
     */
    function toHex(s) {
      return Array.from(s)
        .map(function (c) {
          /*
           * encodeURI doesn't transform most ASCII characters, so we handle
           * these ourselves
           */
          return c.charCodeAt(0) < 128
            ? c.charCodeAt(0).toString(16)
            : encodeURIComponent(c).replace(/%/g, "").toLowerCase();
        })
        .join("");
    }
    function fromHex(s) {
      return s.length == 0
        ? ""
        : decodeURIComponent("%" + (s.match(/.{1,2}/g) || []).join("%"));
    }
    var encodeComment = function (s) {
      s = s.replace(new RegExp(mask(newlineChar), "g"), " ");
      return "{".concat(toHex(s.slice(1, s.length - 1)), "}");
    };
    var decodeComment = function (s) {
      if (s.startsWith("{") && s.endsWith("}")) {
        return fromHex(s.slice(1, s.length - 1));
      }
    };
    // delete header to get the moves
    var ms = pgn
      .replace(headerString, "")
      .replace(
        // encode comments so they don't get deleted below
        new RegExp("({[^}]*})+?|;([^".concat(mask(newlineChar), "]*)"), "g"),
        function (_match, bracket, semicolon) {
          return bracket !== undefined
            ? encodeComment(bracket)
            : " " + encodeComment("{".concat(semicolon.slice(1), "}"));
        }
      )
      .replace(new RegExp(mask(newlineChar), "g"), " ");
    // delete recursive annotation variations
    var ravRegex = /(\([^()]+\))+?/g;
    while (ravRegex.test(ms)) {
      ms = ms.replace(ravRegex, "");
    }
    // delete move numbers
    ms = ms.replace(/\d+\.(\.\.)?/g, "");
    // delete ... indicating black to move
    ms = ms.replace(/\.\.\./g, "");
    /* delete numeric annotation glyphs */
    ms = ms.replace(/\$\d+/g, "");
    // trim and get array of moves
    var moves = ms.trim().split(new RegExp(/\s+/));
    // delete empty entries
    moves = moves.filter(function (move) {
      return move !== "";
    });
    var result = "";
    for (var halfMove = 0; halfMove < moves.length; halfMove++) {
      var comment = decodeComment(moves[halfMove]);
      if (comment !== undefined && comment !== null) {
        this._comments[this.fen()] = comment;
        continue;
      }
      var move = this._moveFromSan(moves[halfMove], strict);
      // invalid move
      if (move == null) {
        // was the move an end of game marker
        if (TERMINATION_MARKERS.indexOf(moves[halfMove]) > -1) {
          result = moves[halfMove];
        } else {
          throw new Error("Invalid move in PGN: ".concat(moves[halfMove]));
        }
      } else {
        // reset the end of game marker if making a valid move
        result = "";
        this._makeMove(move);
      }
    }
    /*
     * Per section 8.2.6 of the PGN spec, the Result tag pair must match match
     * the termination marker. Only do this when headers are present, but the
     * result tag is missing
     */
    if (result && Object.keys(this._header).length && !this._header["Result"]) {
      this.header("Result", result);
    }
    console.log({
      result,
      history: JSON.stringify(this._history, " ", 4),
    });
  };
  /*
   * Convert a move from 0x88 coordinates to Standard Algebraic Notation
   * (SAN)
   *
   * @param {boolean} strict Use the strict SAN parser. It will throw errors
   * on overly disambiguated moves (see below):
   *
   * r1bqkbnr/ppp2ppp/2n5/1B1pP3/4P3/8/PPPP2PP/RNBQK1NR b KQkq - 2 4
   * 4. ... Nge7 is overly disambiguated because the knight on c6 is pinned
   * 4. ... Ne7 is technically the valid SAN
   */
  Chess.prototype._moveToSan = function (move, moves) {
    var output = "";
    if (move.flags & BITS.KSIDE_CASTLE) {
      output = "O-O";
    } else if (move.flags & BITS.QSIDE_CASTLE) {
      output = "O-O-O";
    } else {
      if (move.piece !== exports.PAWN) {
        var disambiguator = getDisambiguator(move, moves);
        output += move.piece.toUpperCase() + disambiguator;
      }
      if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
        if (move.piece === exports.PAWN) {
          output += algebraic(move.from)[0];
        }
        output += "x";
      }
      output += algebraic(move.to);
      if (move.promotion) {
        output += "=" + move.promotion.toUpperCase();
      }
    }
    this._makeMove(move);
    if (this.isCheck()) {
      if (this.isCheckmate()) {
        output += "#";
      } else {
        output += "+";
      }
    }
    this._undoMove();
    return output;
  };
  // convert a move from Standard Algebraic Notation (SAN) to 0x88 coordinates
  Chess.prototype._moveFromSan = function (move, strict) {
    if (strict === void 0) {
      strict = false;
    }
    // strip off any move decorations: e.g Nf3+?! becomes Nf3
    var cleanMove = strippedSan(move);
    var pieceType = inferPieceType(cleanMove);
    var moves = this._moves({ legal: true, piece: pieceType });
    // strict parser
    for (var i = 0, len = moves.length; i < len; i++) {
      if (cleanMove === strippedSan(this._moveToSan(moves[i], moves))) {
        return moves[i];
      }
    }
    // the strict parser failed
    if (strict) {
      return null;
    }
    var piece = undefined;
    var matches = undefined;
    var from = undefined;
    var to = undefined;
    var promotion = undefined;
    /*
     * The default permissive (non-strict) parser allows the user to parse
     * non-standard chess notations. This parser is only run after the strict
     * Standard Algebraic Notation (SAN) parser has failed.
     *
     * When running the permissive parser, we'll run a regex to grab the piece, the
     * to/from square, and an optional promotion piece. This regex will
     * parse common non-standard notation like: Pe2-e4, Rc1c4, Qf3xf7,
     * f7f8q, b1c3
     *
     * NOTE: Some positions and moves may be ambiguous when using the permissive
     * parser. For example, in this position: 6k1/8/8/B7/8/8/8/BN4K1 w - - 0 1,
     * the move b1c3 may be interpreted as Nc3 or B1c3 (a disambiguated bishop
     * move). In these cases, the permissive parser will default to the most
     * basic interpretation (which is b1c3 parsing to Nc3).
     */
    var overlyDisambiguated = false;
    matches = cleanMove.match(
      /([pnbrqkPNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([qrbnQRBN])?/
      //     piece         from              to       promotion
    );
    if (matches) {
      piece = matches[1];
      from = matches[2];
      to = matches[3];
      promotion = matches[4];
      if (from.length == 1) {
        overlyDisambiguated = true;
      }
    } else {
      /*
       * The [a-h]?[1-8]? portion of the regex below handles moves that may be
       * overly disambiguated (e.g. Nge7 is unnecessary and non-standard when
       * there is one legal knight move to e7). In this case, the value of
       * 'from' variable will be a rank or file, not a square.
       */
      matches = cleanMove.match(
        /([pnbrqkPNBRQK])?([a-h]?[1-8]?)x?-?([a-h][1-8])([qrbnQRBN])?/
      );
      if (matches) {
        piece = matches[1];
        from = matches[2];
        to = matches[3];
        promotion = matches[4];
        if (from.length == 1) {
          overlyDisambiguated = true;
        }
      }
    }
    pieceType = inferPieceType(cleanMove);
    moves = this._moves({
      legal: true,
      piece: piece ? piece : pieceType,
    });
    if (!to) {
      return null;
    }
    for (var i = 0, len = moves.length; i < len; i++) {
      if (!from) {
        // if there is no from square, it could be just 'x' missing from a capture
        if (
          cleanMove ===
          strippedSan(this._moveToSan(moves[i], moves)).replace("x", "")
        ) {
          return moves[i];
        }
        // hand-compare move properties with the results from our permissive regex
      } else if (
        (!piece || piece.toLowerCase() == moves[i].piece) &&
        exports.Ox88[from] == moves[i].from &&
        exports.Ox88[to] == moves[i].to &&
        (!promotion || promotion.toLowerCase() == moves[i].promotion)
      ) {
        return moves[i];
      } else if (overlyDisambiguated) {
        /*
         * SPECIAL CASE: we parsed a move string that may have an unneeded
         * rank/file disambiguator (e.g. Nge7).  The 'from' variable will
         */
        var square = algebraic(moves[i].from);
        if (
          (!piece || piece.toLowerCase() == moves[i].piece) &&
          exports.Ox88[to] == moves[i].to &&
          (from == square[0] || from == square[1]) &&
          (!promotion || promotion.toLowerCase() == moves[i].promotion)
        ) {
          return moves[i];
        }
      }
    }
    return null;
  };
  Chess.prototype.ascii = function () {
    var s = "   +------------------------+\n";
    for (var i = exports.Ox88.a8; i <= exports.Ox88.h1; i++) {
      // display the rank
      if (file(i) === 0) {
        s += " " + "87654321"[rank(i)] + " |";
      }
      if (this._board[i]) {
        var piece = this._board[i].type;
        var color = this._board[i].color;
        var symbol =
          color === exports.WHITE ? piece.toUpperCase() : piece.toLowerCase();
        s += " " + symbol + " ";
      } else {
        s += " . ";
      }
      if ((i + 1) & 0x88) {
        s += "|\n";
        i += 8;
      }
    }
    s += "   +------------------------+\n";
    s += "     a  b  c  d  e  f  g  h";
    return s;
  };
  Chess.prototype.perft = function (depth) {
    var moves = this._moves({ legal: false });
    var nodes = 0;
    var color = this._turn;
    for (var i = 0, len = moves.length; i < len; i++) {
      this._makeMove(moves[i]);
      if (!this._isKingAttacked(color)) {
        if (depth - 1 > 0) {
          nodes += this.perft(depth - 1);
        } else {
          nodes++;
        }
      }
      this._undoMove();
    }
    return nodes;
  };
  // pretty = external move object
  Chess.prototype._makePretty = function (uglyMove) {
    var color = uglyMove.color,
      piece = uglyMove.piece,
      from = uglyMove.from,
      to = uglyMove.to,
      flags = uglyMove.flags,
      captured = uglyMove.captured,
      promotion = uglyMove.promotion;
    var prettyFlags = "";
    for (var flag in BITS) {
      if (BITS[flag] & flags) {
        prettyFlags += exports.FLAGS[flag];
      }
    }
    var fromAlgebraic = algebraic(from);
    var toAlgebraic = algebraic(to);
    var move = {
      color: color,
      piece: piece,
      from: fromAlgebraic,
      to: toAlgebraic,
      san: this._moveToSan(uglyMove, this._moves({ legal: true })),
      flags: prettyFlags,
      lan: fromAlgebraic + toAlgebraic,
      before: this.fen(),
      after: "",
    };
    // generate the FEN for the 'after' key
    this._makeMove(uglyMove);
    move.after = this.fen();
    this._undoMove();
    if (captured) {
      move.captured = captured;
      if (flags & BITS.EP_CAPTURE) {
        move.capturedSquare = algebraic(
          to + (color === exports.BLACK ? -16 : 16)
        );
      } else {
        move.capturedSquare = toAlgebraic;
      }
    }
    if (promotion) {
      move.promotion = promotion;
      move.lan += promotion;
    }
    return move;
  };
  Chess.prototype.setTurn = function (turn) {
    this._turn = turn;
  };
  Chess.prototype.turn = function () {
    return this._turn;
  };
  Chess.prototype.board = function () {
    var output = [];
    var row = [];
    for (var i = exports.Ox88.a8; i <= exports.Ox88.h1; i++) {
      if (this._board[i] == null) {
        row.push(null);
      } else {
        row.push({
          square: algebraic(i),
          type: this._board[i].type,
          color: this._board[i].color,
        });
      }
      if ((i + 1) & 0x88) {
        output.push(row);
        row = [];
        i += 8;
      }
    }
    return output;
  };
  Chess.prototype.squareColor = function (square) {
    if (square in exports.Ox88) {
      var sq = exports.Ox88[square];
      return (rank(sq) + file(sq)) % 2 === 0 ? "light" : "dark";
    }
    return null;
  };
  Chess.prototype.history = function (_a) {
    var _b = _a === void 0 ? {} : _a,
      _c = _b.verbose,
      verbose = _c === void 0 ? false : _c;
    var reversedHistory = [];
    var moveHistory = [];
    while (this._history.length > 0) {
      reversedHistory.push(this._undoMove());
    }
    // eslint-disable-next-line no-constant-condition
    while (true) {
      var move = reversedHistory.pop();
      if (!move) {
        break;
      }
      if (verbose) {
        moveHistory.push(this._makePretty(move));
      } else {
        moveHistory.push(this._moveToSan(move, this._moves()));
      }
      this._makeMove(move);
    }
    return moveHistory;
  };
  Chess.prototype._pruneComments = function () {
    var _this = this;
    var reversedHistory = [];
    var currentComments = {};
    var copyComment = function (fen) {
      if (fen in _this._comments) {
        currentComments[fen] = _this._comments[fen];
      }
    };
    while (this._history.length > 0) {
      reversedHistory.push(this._undoMove());
    }
    copyComment(this.fen());
    // eslint-disable-next-line no-constant-condition
    while (true) {
      var move = reversedHistory.pop();
      if (!move) {
        break;
      }
      this._makeMove(move);
      copyComment(this.fen());
    }
    this._comments = currentComments;
  };
  Chess.prototype.getComment = function () {
    return this._comments[this.fen()];
  };
  Chess.prototype.setComment = function (comment) {
    this._comments[this.fen()] = comment.replace("{", "[").replace("}", "]");
  };
  Chess.prototype.deleteComment = function () {
    var comment = this._comments[this.fen()];
    delete this._comments[this.fen()];
    return comment;
  };
  Chess.prototype.getComments = function () {
    var _this = this;
    this._pruneComments();
    return Object.keys(this._comments).map(function (fen) {
      return { fen: fen, comment: _this._comments[fen] };
    });
  };
  Chess.prototype.deleteComments = function () {
    var _this = this;
    this._pruneComments();
    return Object.keys(this._comments).map(function (fen) {
      var comment = _this._comments[fen];
      delete _this._comments[fen];
      return { fen: fen, comment: comment };
    });
  };
  Chess.prototype.setCastlingRights = function (color, rights) {
    for (var _i = 0, _a = [exports.KING, exports.QUEEN]; _i < _a.length; _i++) {
      var side = _a[_i];
      if (rights[side] !== undefined) {
        if (rights[side]) {
          this._castling[color] |= SIDES[side];
        } else {
          this._castling[color] &= ~SIDES[side];
        }
      }
    }
    this._updateCastlingRights();
    var result = this.getCastlingRights(color);
    return (
      (rights[exports.KING] === undefined ||
        rights[exports.KING] === result[exports.KING]) &&
      (rights[exports.QUEEN] === undefined ||
        rights[exports.QUEEN] === result[exports.QUEEN])
    );
  };
  Chess.prototype.getCastlingRights = function (color) {
    var _a;
    return (
      (_a = {}),
      (_a[exports.KING] = (this._castling[color] & SIDES[exports.KING]) !== 0),
      (_a[exports.QUEEN] =
        (this._castling[color] & SIDES[exports.QUEEN]) !== 0),
      _a
    );
  };
  Chess.prototype.moveNumber = function () {
    return this._moveNumber;
  };
  Chess.prototype.convertToMove = function (m) {
    var move = Object.create(null);
    move.captured = m.captured;
    move.color = m.color;
    move.from = exports.Ox88[m.from];
    move.to = exports.Ox88[m.to];
    move.piece = m.piece;
    move.promotion = m.promotion;
    var moveFlag = 0;
    for (var flag in exports.FLAGS) {
      if (m.flags.includes(flag)) {
        moveFlag += BITS[flag];
      }
    }
    move.flags = moveFlag;
    return move;
  };
  Chess.prototype.convertSanToMove = function (move) {
    return this._moveFromSan(move);
  };
  return Chess;
})();

let chess = new Chess();
console.log({
  loadPgn: chess.loadPgn(
    fs.readFileSync(path.join(process.cwd(), "./src/2.pgn")).toString()
  ),
  header: chess.header().FEN,
});
// console.log(chess);

exports.Chess = Chess;
