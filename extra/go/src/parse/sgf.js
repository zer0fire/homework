// Collection = GameTree, {GameTree}.
// GameTree = '(', Sequence, {GameTree}, ')'.
// Sequence = Node, {Node}.
// Property = PropIdent, PropValue, {PropValue}.
// PropIdent = upper, {upper}.
// PropValue = '[', CValueType, ']'.
// CValueType = ValueType | Compose.
// ValueType = None | Number | Real | Double | Color | SimpleText | Text | Move.
// None = [sp].
// Number = ['+' | '-'], digit, {digit}.
// Real = Number, ['.', digit, {digit}].
// Double = '1' | '2'.
// Color = 'B' | 'W'.
// Move = (lower | upper), (lower | upper).
// Compose = ValueType, ':', ValueType.

/**
 * @fileOverview SGFParser - SGF Parser Object
 * @version 0.1
 * @author EBNFParser written by Nonki Takahashi
 */
/**
 * SGF Parser Object
 * @class Represents SGF Parser Object
 * @this {SGFParser}
 * @param {String} src source to parser
 * @param {Object} gapFree array of gap free id
 * @param {String} name name of the parser
 * @param {String} ver version of the parser
 * @param {Boolean} ignoreCase true if ignore case (optional)
 * @property {String} buf source buffer
 * @property {Integer} ptr source buffer pointer
 * @property {Object} gapFree array of gap free id
 * @property {String} name name of the parser
 * @property {String} ver version of the parser
 * @property {Boolean} ignoreCase true if ignore case
 * @since 0.1
 */
SGFParser = function (src, gapFree, name, ver, ignoreCase) {
  this.gapFree = gapFree;
  this.name = name;
  this.ver = ver;
  if (ignoreCase) this.ignoreCase = true;
  else this.ignoreCase = false;
  // inherit the methods of class Lex
  Lex.call(this, src);
};
SGFParser.prototype = new Lex();
/**
 * Collection = GameTree, {GameTree}.
 * @return {String} code generated if matched, null if not matched
 * @since 0.1
 */
SGFParser.prototype.Collection = function () {
  var match = [];
  var save = this.ptr;
  var n = -1;
  this.sp();
  match[++n] = this.GameTree();
  if (match[n]) {
    this.sp();
    while (match[n]) {
      this.sp();
      match[++n] = this.GameTree();
    }
    match[++n] = true;
  }
  if (!match[n]) {
    this.ptr = save;
    return null;
  }
  return this.run(n, match, "Collection");
};
/**
 * GameTree = '(', Sequence, {GameTree}, ')'.
 * @return {String} code generated if matched, null if not matched
 * @since 0.1
 */
SGFParser.prototype.GameTree = function () {
  var match = [];
  var save = this.ptr;
  var n = -1;
  this.sp();
  match[++n] = this.text("(");
  if (match[n]) {
    this.sp();
    match[++n] = this.Sequence();
  }
  if (match[n]) {
    this.sp();
    while (match[n]) {
      this.sp();
      match[++n] = this.GameTree();
    }
    match[++n] = true;
  }
  if (match[n]) {
    this.sp();
    match[++n] = this.text(")");
  }
  if (!match[n]) {
    this.ptr = save;
    return null;
  }
  return this.run(n, match, "GameTree");
};
/**
 * Sequence = Node, {Node}.
 * @return {String} code generated if matched, null if not matched
 * @since 0.1
 */
SGFParser.prototype.Sequence = function () {
  var match = [];
  var save = this.ptr;
  var n = -1;
  this.sp();
  match[++n] = this.Node();
  if (match[n]) {
    this.sp();
    while (match[n]) {
      this.sp();
      match[++n] = this.Node();
    }
    match[++n] = true;
  }
  if (!match[n]) {
    this.ptr = save;
    return null;
  }
  return this.run(n, match, "Sequence");
};
/**
 * Property = PropIdent, PropValue, {PropValue}.
 * @return {String} code generated if matched, null if not matched
 * @since 0.1
 */
SGFParser.prototype.Property = function () {
  var match = [];
  var save = this.ptr;
  var n = -1;
  this.sp();
  match[++n] = this.PropIdent();
  if (match[n]) {
    this.sp();
    match[++n] = this.PropValue();
  }
  if (match[n]) {
    this.sp();
    while (match[n]) {
      this.sp();
      match[++n] = this.PropValue();
    }
    match[++n] = true;
  }
  if (!match[n]) {
    this.ptr = save;
    return null;
  }
  return this.run(n, match, "Property");
};
/**
 * PropIdent = upper, {upper}.
 * @return {String} code generated if matched, null if not matched
 * @since 0.1
 */
SGFParser.prototype.PropIdent = function () {
  var match = [];
  var save = this.ptr;
  var n = -1;
  this.sp();
  match[++n] = this.upper();
  if (match[n]) {
    while (match[n]) {
      match[++n] = this.upper();
    }
    match[++n] = true;
  }
  if (!match[n]) {
    this.ptr = save;
    return null;
  }
  return this.run(n, match, "PropIdent");
};
/**
 * PropValue = '[', CValueType, ']'.
 * @return {String} code generated if matched, null if not matched
 * @since 0.1
 */
SGFParser.prototype.PropValue = function () {
  var match = [];
  var save = this.ptr;
  var n = -1;
  this.sp();
  match[++n] = this.text("[");
  if (match[n]) {
    this.sp();
    match[++n] = this.CValueType();
  }
  if (match[n]) {
    this.sp();
    match[++n] = this.text("]");
  }
  if (!match[n]) {
    this.ptr = save;
    return null;
  }
  return this.run(n, match, "PropValue");
};
/**
 * CValueType = ValueType | Compose.
 * @return {String} code generated if matched, null if not matched
 * @since 0.1
 */
SGFParser.prototype.CValueType = function () {
  var match = [];
  var save = this.ptr;
  var n = -1;
  this.sp();
  match[++n] = this.ValueType();
  if (!match[n]) {
    n--;
    this.sp();
    match[++n] = this.Compose();
  }
  if (!match[n]) {
    this.ptr = save;
    return null;
  }
  return this.run(n, match, "CValueType");
};
/**
 * ValueType = None | Number | Real | Double | Color | SimpleText | Text | Move.
 * @return {String} code generated if matched, null if not matched
 * @since 0.1
 */
SGFParser.prototype.ValueType = function () {
  var match = [];
  var save = this.ptr;
  var n = -1;
  this.sp();
  match[++n] = this.None();
  if (!match[n]) {
    n--;
    this.sp();
    match[++n] = this.Number();
  }
  if (!match[n]) {
    n--;
    this.sp();
    match[++n] = this.Real();
  }
  if (!match[n]) {
    n--;
    this.sp();
    match[++n] = this.Double();
  }
  if (!match[n]) {
    n--;
    this.sp();
    match[++n] = this.Color();
  }
  if (!match[n]) {
    n--;
    this.sp();
    match[++n] = this.SimpleText();
  }
  if (!match[n]) {
    n--;
    this.sp();
    match[++n] = this.Text();
  }
  if (!match[n]) {
    n--;
    this.sp();
    match[++n] = this.Move();
  }
  if (!match[n]) {
    this.ptr = save;
    return null;
  }
  return this.run(n, match, "ValueType");
};
/**
 * None = [sp].
 * @return {String} code generated if matched, null if not matched
 * @since 0.1
 */
SGFParser.prototype.None = function () {
  var match = [];
  var save = this.ptr;
  var n = -1;
  this.sp();
  this.sp();
  match[++n] = this.sp();
  match[++n] = true;
  if (!match[n]) {
    this.ptr = save;
    return null;
  }
  return this.run(n, match, "None");
};
/**
 * Number = ['+' | '-'], digit, {digit}.
 * @return {String} code generated if matched, null if not matched
 * @since 0.1
 */
SGFParser.prototype.Number = function () {
  var match = [];
  var save = this.ptr;
  var n = -1;
  this.sp();
  match[++n] = this.text("+");
  if (!match[n]) {
    n--;
    match[++n] = this.text("-");
  }
  match[++n] = true;
  if (match[n]) {
    match[++n] = this.digit();
  }
  if (match[n]) {
    while (match[n]) {
      match[++n] = this.digit();
    }
    match[++n] = true;
  }
  if (!match[n]) {
    this.ptr = save;
    return null;
  }
  return this.run(n, match, "Number");
};
/**
 * Real = Number, ['.', digit, {digit}].
 * @return {String} code generated if matched, null if not matched
 * @since 0.1
 */
SGFParser.prototype.Real = function () {
  var match = [];
  var save = this.ptr;
  var n = -1;
  this.sp();
  match[++n] = this.Number();
  if (match[n]) {
    match[++n] = this.text(".");
    if (match[n]) {
      match[++n] = this.digit();
    }
    if (match[n]) {
      while (match[n]) {
        match[++n] = this.digit();
      }
      match[++n] = true;
    }
    match[++n] = true;
  }
  if (!match[n]) {
    this.ptr = save;
    return null;
  }
  return this.run(n, match, "Real");
};
/**
 * Double = '1' | '2'.
 * @return {String} code generated if matched, null if not matched
 * @since 0.1
 */
SGFParser.prototype.Double = function () {
  var match = [];
  var save = this.ptr;
  var n = -1;
  this.sp();
  match[++n] = this.text("1");
  if (!match[n]) {
    n--;
    this.sp();
    match[++n] = this.text("2");
  }
  if (!match[n]) {
    this.ptr = save;
    return null;
  }
  return this.run(n, match, "Double");
};
/**
 * Color = 'B' | 'W'.
 * @return {String} code generated if matched, null if not matched
 * @since 0.1
 */
SGFParser.prototype.Color = function () {
  var match = [];
  var save = this.ptr;
  var n = -1;
  this.sp();
  match[++n] = this.text("B");
  if (!match[n]) {
    n--;
    this.sp();
    match[++n] = this.text("W");
  }
  if (!match[n]) {
    this.ptr = save;
    return null;
  }
  return this.run(n, match, "Color");
};
/**
 * Move = (lower | upper), (lower | upper).
 * @return {String} code generated if matched, null if not matched
 * @since 0.1
 */
SGFParser.prototype.Move = function () {
  var match = [];
  var save = this.ptr;
  var n = -1;
  this.sp();
  this.sp();
  match[++n] = this.lower();
  if (!match[n]) {
    n--;
    this.sp();
    match[++n] = this.upper();
  }
  if (match[n]) {
    this.sp();
    this.sp();
    match[++n] = this.lower();
    if (!match[n]) {
      n--;
      this.sp();
      match[++n] = this.upper();
    }
  }
  if (!match[n]) {
    this.ptr = save;
    return null;
  }
  return this.run(n, match, "Move");
};
/**
 * Compose = ValueType, ':', ValueType.
 * @return {String} code generated if matched, null if not matched
 * @since 0.1
 */
SGFParser.prototype.Compose = function () {
  var match = [];
  var save = this.ptr;
  var n = -1;
  this.sp();
  match[++n] = this.ValueType();
  if (match[n]) {
    this.sp();
    match[++n] = this.text(":");
  }
  if (match[n]) {
    this.sp();
    match[++n] = this.ValueType();
  }
  if (!match[n]) {
    this.ptr = save;
    return null;
  }
  return this.run(n, match, "Compose");
};
