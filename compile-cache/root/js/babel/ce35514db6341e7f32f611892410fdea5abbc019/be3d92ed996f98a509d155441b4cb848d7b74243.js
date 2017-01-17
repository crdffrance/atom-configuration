"use babel";
Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PythonIndent = (function () {
    function PythonIndent() {
        _classCallCheck(this, PythonIndent);
    }

    _createClass(PythonIndent, [{
        key: "properlyIndent",
        value: function properlyIndent() {
            this.editor = atom.workspace.getActiveTextEditor();

            // Make sure this is a Python file
            if (this.editor.getGrammar().scopeName.substring(0, 13) !== "source.python") {
                return;
            }

            // Get base variables
            var row = this.editor.getCursorBufferPosition().row;
            var col = this.editor.getCursorBufferPosition().column;

            // Parse the entire file up to the current point, keeping track of brackets
            var lines = this.editor.getTextInBufferRange([[0, 0], [row, col]]).split("\n");
            // At this point, the newline character has just been added,
            // so remove the last element of lines, which will be the empty line
            lines = lines.splice(0, lines.length - 1);

            var parseOutput = this.parseLines(lines);
            // openBracketStack: A stack of [row, col] pairs describing where open brackets are
            // lastClosedRow: Either empty, or an array [rowOpen, rowClose] describing the rows
            //  here the last bracket to be closed was opened and closed.
            // shouldHang: A stack containing the row number where each bracket was closed.
            // lastColonRow: The last row a def/for/if/elif/else/try/except etc. block started
            var openBracketStack = parseOutput.openBracketStack;
            var lastClosedRow = parseOutput.lastClosedRow;
            var shouldHang = parseOutput.shouldHang;
            var lastColonRow = parseOutput.lastColonRow;

            if (shouldHang) {
                this.indentHanging(row, this.editor.buffer.lineForRow(row - 1));
                return;
            }

            if (!(openBracketStack.length || lastClosedRow.length && openBracketStack)) {
                return;
            }

            if (!openBracketStack.length) {
                // Can assume lastClosedRow is not empty
                if (lastClosedRow[1] === row - 1) {
                    // We just closed a bracket on the row, get indentation from the
                    // row where it was opened
                    var indentLevel = this.editor.indentationForBufferRow(lastClosedRow[0]);

                    if (lastColonRow === row - 1) {
                        // We just finished def/for/if/elif/else/try/except etc. block,
                        // need to increase indent level by 1.
                        indentLevel += 1;
                    }
                    this.editor.setIndentationForBufferRow(row, indentLevel);
                }
                return;
            }

            // Get tab length for context
            var tabLength = this.editor.getTabLength();

            var lastOpenBracketLocations = openBracketStack.pop();

            // Get some booleans to help work through the cases

            // haveClosedBracket is true if we have ever closed a bracket
            var haveClosedBracket = lastClosedRow.length;
            // justOpenedBracket is true if we opened a bracket on the row we just finished
            var justOpenedBracket = lastOpenBracketLocations[0] === row - 1;
            // justClosedBracket is true if we closed a bracket on the row we just finished
            var justClosedBracket = haveClosedBracket && lastClosedRow[1] === row - 1;
            // closedBracketOpenedAfterLineWithCurrentOpen is an ***extremely*** long name, and
            // it is true if the most recently closed bracket pair was opened on
            // a line AFTER the line where the current open bracket
            var closedBracketOpenedAfterLineWithCurrentOpen = haveClosedBracket && lastClosedRow[0] > lastOpenBracketLocations[0];
            var indentColumn = undefined;

            if (!justOpenedBracket && !justClosedBracket) {
                // The bracket was opened before the previous line,
                // and we did not close a bracket on the previous line.
                // Thus, nothing has happened that could have changed the
                // indentation level since the previous line, so
                // we should use whatever indent we are given.
                return;
            } else if (justClosedBracket && closedBracketOpenedAfterLineWithCurrentOpen) {
                // A bracket that was opened after the most recent open
                // bracket was closed on the line we just finished typing.
                // We should use whatever indent was used on the row
                // where we opened the bracket we just closed. This needs
                // to be handled as a separate case from the last case below
                // in case the current bracket is using a hanging indent.
                // This handles cases such as
                // x = [0, 1, 2,
                //      [3, 4, 5,
                //       6, 7, 8],
                //      9, 10, 11]
                // which would be correctly handled by the case below, but it also correctly handles
                // x = [
                //     0, 1, 2, [3, 4, 5,
                //               6, 7, 8],
                //     9, 10, 11
                // ]
                // which the last case below would incorrectly indent an extra space
                // before the "9", because it would try to match it up with the
                // open bracket instead of using the hanging indent.
                var previousIndent = this.editor.indentationForBufferRow(lastClosedRow[0]);
                indentColumn = previousIndent * tabLength;
            } else {
                // lastOpenBracketLocations[1] is the column where the bracket was,
                // so need to bump up the indentation by one
                indentColumn = lastOpenBracketLocations[1] + 1;
            }

            // Calculate soft-tabs from spaces (can have remainder)
            var tabs = indentColumn / tabLength;
            var rem = (tabs - Math.floor(tabs)) * tabLength;

            // If there's a remainder, `@editor.buildIndentString` requires the tab to
            // be set past the desired indentation level, thus the ceiling.
            tabs = rem > 0 ? Math.ceil(tabs) : tabs;

            // Offset is the number of spaces to subtract from the soft-tabs if they
            // are past the desired indentation (not divisible by tab length).
            var offset = rem > 0 ? tabLength - rem : 0;

            // I'm glad Atom has an optional `column` param to subtract spaces from
            // soft-tabs, though I don't see it used anywhere in the core.
            // It looks like for hard tabs, the "tabs" input can be fractional and
            // the "column" input is ignored...?
            var indent = this.editor.buildIndentString(tabs, offset);

            // The range of text to replace with our indent
            // will need to change this for hard tabs, especially tricky for when
            // hard tabs have mixture of tabs + spaces, which they can judging from
            // the editor.buildIndentString function
            var startRange = [row, 0];
            var stopRange = [row, this.editor.indentationForBufferRow(row) * tabLength];
            this.editor.getBuffer().setTextInRange([startRange, stopRange], indent);
        }
    }, {
        key: "parseLines",
        value: function parseLines(lines) {
            // openBracketStack is an array of [row, col] indicating the location
            // of the opening bracket (square, curly, or parentheses)
            var openBracketStack = [];
            // lastClosedRow is either empty or [rowOpen, rowClose] describing the
            // rows where the latest closed bracket was opened and closed.
            var lastClosedRow = [];
            // If we are in a string, this tells us what character introduced the string
            // i.e., did this string start with ' or with "?
            var stringDelimiter = [];
            // This is the row of the last function definition
            var lastColonRow = NaN;

            // true if we are in a triple quoted string
            var inTripleQuotedString = false;

            // If we have seen two of the same string delimiters in a row,
            // then we have to check the next character to see if it matches
            // in order to correctly parse triple quoted strings.
            var checkNextCharForString = false;

            // keep track of the number of consecutive string delimiter's we've seen
            // used to tell if we are in a triple quoted string
            var numConsecutiveStringDelimiters = 0;

            // true if we should have a hanging indent, false otherwise
            var shouldHang = false;

            // NOTE: this parsing will only be correct if the python code is well-formed
            // statements like "[0, (1, 2])" might break the parsing

            // loop over each line
            for (var row of Array(lines.length).fill().map(function (_, i) {
                return i;
            })) {
                var line = lines[row];

                // boolean, whether or not the current character is being escaped
                // applicable when we are currently in a string
                var isEscaped = false;

                // This is the last defined def/for/if/elif/else/try/except row
                var lastlastColonRow = lastColonRow;

                for (var col of Array(line.length).fill().map(function (_, i) {
                    return i;
                })) {
                    var c = line[col];

                    if (c === stringDelimiter && !isEscaped) {
                        numConsecutiveStringDelimiters += 1;
                    } else if (checkNextCharForString) {
                        numConsecutiveStringDelimiters = 0;
                        stringDelimiter = [];
                    } else {
                        numConsecutiveStringDelimiters = 0;
                    }

                    checkNextCharForString = false;

                    // If stringDelimiter is set, then we are in a string
                    // Note that this works correctly even for triple quoted strings
                    if (stringDelimiter.length) {
                        if (isEscaped) {
                            // If current character is escaped, then we do not care what it was,
                            // but since it is impossible for the next character to be escaped as well,
                            // go ahead and set that to false
                            isEscaped = false;
                        } else {
                            if (c === stringDelimiter) {
                                // We are seeing the same quote that started the string, i.e. ' or "
                                if (inTripleQuotedString) {
                                    if (numConsecutiveStringDelimiters === 3) {
                                        // Breaking out of the triple quoted string...
                                        numConsecutiveStringDelimiters = 0;
                                        stringDelimiter = [];
                                        inTripleQuotedString = false;
                                    }
                                } else if (numConsecutiveStringDelimiters === 3) {
                                    // reset the count, correctly handles cases like ''''''
                                    numConsecutiveStringDelimiters = 0;
                                    inTripleQuotedString = true;
                                } else if (numConsecutiveStringDelimiters === 2) {
                                    // We are not currently in a triple quoted string, and we've
                                    // seen two of the same string delimiter in a row. This could
                                    // either be an empty string, i.e. '' or "", or it could be
                                    // the start of a triple quoted string. We will check the next
                                    // character, and if it matches then we know we're in a triple
                                    // quoted string, and if it does not match we know we're not
                                    // in a string any more (i.e. it was the empty string).
                                    checkNextCharForString = true;
                                } else if (numConsecutiveStringDelimiters === 1) {
                                    // We are not in a string that is not triple quoted, and we've
                                    // just seen an un-escaped instance of that string delimiter.
                                    // In other words, we've left the string.
                                    // It is also worth noting that it is impossible for
                                    // numConsecutiveStringDelimiters to be 0 at this point, so
                                    // this set of if/else if statements covers all cases.
                                    stringDelimiter = [];
                                }
                            } else if (c === "\\") {
                                // We are seeing an unescaped backslash, the next character is escaped.
                                // Note that this is not exactly true in raw strings, HOWEVER, in raw
                                // strings you can still escape the quote mark by using a backslash.
                                // Since that's all we really care about as far as escaped characters
                                // go, we can assume we are now escaping the next character.
                                isEscaped = true;
                            }
                        }
                    } else {
                        if ("[({".includes(c)) {
                            openBracketStack.push([row, col]);
                            // If the only characters after this opening bracket are whitespace,
                            // then we should do a hanging indent. If there are other non-whitespace
                            // characters after this, then they will set the shouldHang boolean to false
                            shouldHang = true;
                        } else if (" \t\r\n".includes(c)) {
                            // just in case there's a new line
                            // If it's whitespace, we don't care at all
                            // this check is necessary so we don't set shouldHang to false even if
                            // someone e.g. just entered a space between the opening bracket and the
                            // newline.
                            continue;
                        } else if (c === "#") {
                            // This check goes as well to make sure we don't set shouldHang
                            // to false in similar circumstances as described in the whitespace section.
                            break;
                        } else {
                            // We've already skipped if the character was white-space, an opening
                            // bracket, or a new line, so that means the current character is not
                            // whitespace and not an opening bracket, so shouldHang needs to get set to
                            // false.
                            shouldHang = false;

                            // Similar to above, we've already skipped all irrelevant characters,
                            // so if we saw a colon earlier in this line, then we would have
                            // incorrectly thought it was the end of a def/for/if/elif/else/try/except
                            // block when it was actually a dictionary being defined, reset the
                            // lastColonRow variable to whatever it was when we started parsing this
                            // line.
                            lastColonRow = lastlastColonRow;

                            if (c === ":") {
                                lastColonRow = row;
                            } else if ("})]".includes(c) && openBracketStack.length) {
                                // The .pop() will take the element off of the openBracketStack as it
                                // adds it to the array for lastClosedRow.
                                lastClosedRow = [openBracketStack.pop()[0], row];
                            } else if ("'\"".includes(c)) {
                                // Starting a string, keep track of what quote was used to start it.
                                stringDelimiter = c;
                                numConsecutiveStringDelimiters += 1;
                            }
                        }
                    }
                }
            }
            return { openBracketStack: openBracketStack, lastClosedRow: lastClosedRow, shouldHang: shouldHang, lastColonRow: lastColonRow };
        }
    }, {
        key: "indentHanging",
        value: function indentHanging(row) {
            // Indent at the current block level plus the setting amount (1 or 2)
            var indent = this.editor.indentationForBufferRow(row) + atom.config.get("python-indent.hangingIndentTabs");

            // Set the indent
            this.editor.setIndentationForBufferRow(row, indent);
        }
    }]);

    return PythonIndent;
})();

exports["default"] = PythonIndent;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pvY2VseW4vLmF0b20vcGFja2FnZXMvcHl0aG9uLWluZGVudC9saWIvcHl0aG9uLWluZGVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7OztJQUNTLFlBQVk7YUFBWixZQUFZOzhCQUFaLFlBQVk7OztpQkFBWixZQUFZOztlQUVmLDBCQUFHO0FBQ2IsZ0JBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDOzs7QUFHbkQsZ0JBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsS0FBSyxlQUFlLEVBQUU7QUFDekUsdUJBQU87YUFDVjs7O0FBR0QsZ0JBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsdUJBQXVCLEVBQUUsQ0FBQyxHQUFHLENBQUM7QUFDdEQsZ0JBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsdUJBQXVCLEVBQUUsQ0FBQyxNQUFNLENBQUM7OztBQUd6RCxnQkFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7OztBQUcvRSxpQkFBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7O0FBRTFDLGdCQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDOzs7Ozs7Z0JBTW5DLGdCQUFnQixHQUE4QyxXQUFXLENBQXpFLGdCQUFnQjtnQkFBRSxhQUFhLEdBQStCLFdBQVcsQ0FBdkQsYUFBYTtnQkFBRSxVQUFV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QUFDLEdBQUcsQ0FBQyxHQUNuRCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxpQ0FBaUMsQ0FBQyxBQUFDLENBQUM7OztBQUd6RCxnQkFBSSxDQUFDLE1BQU0sQ0FBQywwQkFBMEIsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDdkQ7OztXQTNTZ0IsWUFBWTs7O3FCQUFaLFlBQVkiLCJmaWxlIjoiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9weXRob24taW5kZW50L2xpYi9weXRob24taW5kZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIjtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFB5dGhvbkluZGVudCB7XG5cbiAgICBwcm9wZXJseUluZGVudCgpIHtcbiAgICAgICAgdGhpcy5lZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG5cbiAgICAgICAgLy8gTWFrZSBzdXJlIHRoaXMgaXMgYSBQeXRob24gZmlsZVxuICAgICAgICBpZiAodGhpcy5lZGl0b3IuZ2V0R3JhbW1hcigpLnNjb3BlTmFtZS5zdWJzdHJpbmcoMCwgMTMpICE9PSBcInNvdXJjZS5weXRob25cIikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gR2V0IGJhc2UgdmFyaWFibGVzXG4gICAgICAgIGNvbnN0IHJvdyA9IHRoaXMuZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkucm93O1xuICAgICAgICBjb25zdCBjb2wgPSB0aGlzLmVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpLmNvbHVtbjtcblxuICAgICAgICAvLyBQYXJzZSB0aGUgZW50aXJlIGZpbGUgdXAgdG8gdGhlIGN1cnJlbnQgcG9pbnQsIGtlZXBpbmcgdHJhY2sgb2YgYnJhY2tldHNcbiAgICAgICAgbGV0IGxpbmVzID0gdGhpcy5lZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UoW1swLCAwXSwgW3JvdywgY29sXV0pLnNwbGl0KFwiXFxuXCIpO1xuICAgICAgICAvLyBBdCB0aGlzIHBvaW50LCB0aGUgbmV3bGluZSBjaGFyYWN0ZXIgaGFzIGp1c3QgYmVlbiBhZGRlZCxcbiAgICAgICAgLy8gc28gcmVtb3ZlIHRoZSBsYXN0IGVsZW1lbnQgb2YgbGluZXMsIHdoaWNoIHdpbGwgYmUgdGhlIGVtcHR5IGxpbmVcbiAgICAgICAgbGluZXMgPSBsaW5lcy5zcGxpY2UoMCwgbGluZXMubGVuZ3RoIC0gMSk7XG5cbiAgICAgICAgY29uc3QgcGFyc2VPdXRwdXQgPSB0aGlzLnBhcnNlTGluZXMobGluZXMpO1xuICAgICAgICAvLyBvcGVuQnJhY2tldFN0YWNrOiBBIHN0YWNrIG9mIFtyb3csIGNvbF0gcGFpcnMgZGVzY3JpYmluZyB3aGVyZSBvcGVuIGJyYWNrZXRzIGFyZVxuICAgICAgICAvLyBsYXN0Q2xvc2VkUm93OiBFaXRoZXIgZW1wdHksIG9yIGFuIGFycmF5IFtyb3dPcGVuLCByb3dDbG9zZV0gZGVzY3JpYmluZyB0aGUgcm93c1xuICAgICAgICAvLyAgaGVyZSB0aGUgbGFzdCBicmFja2V0IHRvIGJlIGNsb3NlZCB3YXMgb3BlbmVkIGFuZCBjbG9zZWQuXG4gICAgICAgIC8vIHNob3VsZEhhbmc6IEEgc3RhY2sgY29udGFpbmluZyB0aGUgcm93IG51bWJlciB3aGVyZSBlYWNoIGJyYWNrZXQgd2FzIGNsb3NlZC5cbiAgICAgICAgLy8gbGFzdENvbG9uUm93OiBUaGUgbGFzdCByb3cgYSBkZWYvZm9yL2lmL2VsaWYvZWxzZS90cnkvZXhjZXB0IGV0Yy4gYmxvY2sgc3RhcnRlZFxuICAgICAgICBjb25zdCB7IG9wZW5CcmFja2V0U3RhY2ssIGxhc3RDbG9zZWRSb3csIHNob3VsZEhhbmcsIGxhc3RDb2xvblJvdyB9ID0gcGFyc2VPdXRwdXQ7XG5cbiAgICAgICAgaWYgKHNob3VsZEhhbmcpIHtcbiAgICAgICAgICAgIHRoaXMuaW5kZW50SGFuZ2luZyhyb3csIHRoaXMuZWRpdG9yLmJ1ZmZlci5saW5lRm9yUm93KHJvdyAtIDEpKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghKG9wZW5CcmFja2V0U3RhY2subGVuZ3RoIHx8IChsYXN0Q2xvc2VkUm93Lmxlbmd0aCAmJiBvcGVuQnJhY2tldFN0YWNrKSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghb3BlbkJyYWNrZXRTdGFjay5sZW5ndGgpIHtcbiAgICAgICAgICAgIC8vIENhbiBhc3N1bWUgbGFzdENsb3NlZFJvdyBpcyBub3QgZW1wdHlcbiAgICAgICAgICAgIGlmIChsYXN0Q2xvc2VkUm93WzFdID09PSByb3cgLSAxKSB7XG4gICAgICAgICAgICAgICAgLy8gV2UganVzdCBjbG9zZWQgYSBicmFja2V0IG9uIHRoZSByb3csIGdldCBpbmRlbnRhdGlvbiBmcm9tIHRoZVxuICAgICAgICAgICAgICAgIC8vIHJvdyB3aGVyZSBpdCB3YXMgb3BlbmVkXG4gICAgICAgICAgICAgICAgbGV0IGluZGVudExldmVsID0gdGhpcy5lZGl0b3IuaW5kZW50YXRpb25Gb3JCdWZmZXJSb3cobGFzdENsb3NlZFJvd1swXSk7XG5cbiAgICAgICAgICAgICAgICBpZiAobGFzdENvbG9uUm93ID09PSByb3cgLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdlIGp1c3QgZmluaXNoZWQgZGVmL2Zvci9pZi9lbGlmL2Vsc2UvdHJ5L2V4Y2VwdCBldGMuIGJsb2NrLFxuICAgICAgICAgICAgICAgICAgICAvLyBuZWVkIHRvIGluY3JlYXNlIGluZGVudCBsZXZlbCBieSAxLlxuICAgICAgICAgICAgICAgICAgICBpbmRlbnRMZXZlbCArPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmVkaXRvci5zZXRJbmRlbnRhdGlvbkZvckJ1ZmZlclJvdyhyb3csIGluZGVudExldmVsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEdldCB0YWIgbGVuZ3RoIGZvciBjb250ZXh0XG4gICAgICAgIGNvbnN0IHRhYkxlbmd0aCA9IHRoaXMuZWRpdG9yLmdldFRhYkxlbmd0aCgpO1xuXG4gICAgICAgIGNvbnN0IGxhc3RPcGVuQnJhY2tldExvY2F0aW9ucyA9IG9wZW5CcmFja2V0U3RhY2sucG9wKCk7XG5cbiAgICAgICAgLy8gR2V0IHNvbWUgYm9vbGVhbnMgdG8gaGVscCB3b3JrIHRocm91Z2ggdGhlIGNhc2VzXG5cbiAgICAgICAgLy8gaGF2ZUNsb3NlZEJyYWNrZXQgaXMgdHJ1ZSBpZiB3ZSBoYXZlIGV2ZXIgY2xvc2VkIGEgYnJhY2tldFxuICAgICAgICBjb25zdCBoYXZlQ2xvc2VkQnJhY2tldCA9IGxhc3RDbG9zZWRSb3cubGVuZ3RoO1xuICAgICAgICAvLyBqdXN0T3BlbmVkQnJhY2tldCBpcyB0cnVlIGlmIHdlIG9wZW5lZCBhIGJyYWNrZXQgb24gdGhlIHJvdyB3ZSBqdXN0IGZpbmlzaGVkXG4gICAgICAgIGNvbnN0IGp1c3RPcGVuZWRCcmFja2V0ID0gbGFzdE9wZW5CcmFja2V0TG9jYXRpb25zWzBdID09PSByb3cgLSAxO1xuICAgICAgICAvLyBqdXN0Q2xvc2VkQnJhY2tldCBpcyB0cnVlIGlmIHdlIGNsb3NlZCBhIGJyYWNrZXQgb24gdGhlIHJvdyB3ZSBqdXN0IGZpbmlzaGVkXG4gICAgICAgIGNvbnN0IGp1c3RDbG9zZWRCcmFja2V0ID0gaGF2ZUNsb3NlZEJyYWNrZXQgJiYgbGFzdENsb3NlZFJvd1sxXSA9PT0gcm93IC0gMTtcbiAgICAgICAgLy8gY2xvc2VkQnJhY2tldE9wZW5lZEFmdGVyTGluZVdpdGhDdXJyZW50T3BlbiBpcyBhbiAqKipleHRyZW1lbHkqKiogbG9uZyBuYW1lLCBhbmRcbiAgICAgICAgLy8gaXQgaXMgdHJ1ZSBpZiB0aGUgbW9zdCByZWNlbnRseSBjbG9zZWQgYnJhY2tldCBwYWlyIHdhcyBvcGVuZWQgb25cbiAgICAgICAgLy8gYSBsaW5lIEFGVEVSIHRoZSBsaW5lIHdoZXJlIHRoZSBjdXJyZW50IG9wZW4gYnJhY2tldFxuICAgICAgICBjb25zdCBjbG9zZWRCcmFja2V0T3BlbmVkQWZ0ZXJMaW5lV2l0aEN1cnJlbnRPcGVuID0gaGF2ZUNsb3NlZEJyYWNrZXQgJiZcbiAgICAgICAgICAgIGxhc3RDbG9zZWRSb3dbMF0gPiBsYXN0T3BlbkJyYWNrZXRMb2NhdGlvbnNbMF07XG4gICAgICAgIGxldCBpbmRlbnRDb2x1bW47XG5cbiAgICAgICAgaWYgKCFqdXN0T3BlbmVkQnJhY2tldCAmJiAhanVzdENsb3NlZEJyYWNrZXQpIHtcbiAgICAgICAgICAgIC8vIFRoZSBicmFja2V0IHdhcyBvcGVuZWQgYmVmb3JlIHRoZSBwcmV2aW91cyBsaW5lLFxuICAgICAgICAgICAgLy8gYW5kIHdlIGRpZCBub3QgY2xvc2UgYSBicmFja2V0IG9uIHRoZSBwcmV2aW91cyBsaW5lLlxuICAgICAgICAgICAgLy8gVGh1cywgbm90aGluZyBoYXMgaGFwcGVuZWQgdGhhdCBjb3VsZCBoYXZlIGNoYW5nZWQgdGhlXG4gICAgICAgICAgICAvLyBpbmRlbnRhdGlvbiBsZXZlbCBzaW5jZSB0aGUgcHJldmlvdXMgbGluZSwgc29cbiAgICAgICAgICAgIC8vIHdlIHNob3VsZCB1c2Ugd2hhdGV2ZXIgaW5kZW50IHdlIGFyZSBnaXZlbi5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIGlmIChqdXN0Q2xvc2VkQnJhY2tldCAmJiBjbG9zZWRCcmFja2V0T3BlbmVkQWZ0ZXJMaW5lV2l0aEN1cnJlbnRPcGVuKSB7XG4gICAgICAgICAgICAvLyBBIGJyYWNrZXQgdGhhdCB3YXMgb3BlbmVkIGFmdGVyIHRoZSBtb3N0IHJlY2VudCBvcGVuXG4gICAgICAgICAgICAvLyBicmFja2V0IHdhcyBjbG9zZWQgb24gdGhlIGxpbmUgd2UganVzdCBmaW5pc2hlZCB0eXBpbmcuXG4gICAgICAgICAgICAvLyBXZSBzaG91bGQgdXNlIHdoYXRldmVyIGluZGVudCB3YXMgdXNlZCBvbiB0aGUgcm93XG4gICAgICAgICAgICAvLyB3aGVyZSB3ZSBvcGVuZWQgdGhlIGJyYWNrZXQgd2UganVzdCBjbG9zZWQuIFRoaXMgbmVlZHNcbiAgICAgICAgICAgIC8vIHRvIGJlIGhhbmRsZWQgYXMgYSBzZXBhcmF0ZSBjYXNlIGZyb20gdGhlIGxhc3QgY2FzZSBiZWxvd1xuICAgICAgICAgICAgLy8gaW4gY2FzZSB0aGUgY3VycmVudCBicmFja2V0IGlzIHVzaW5nIGEgaGFuZ2luZyBpbmRlbnQuXG4gICAgICAgICAgICAvLyBUaGlzIGhhbmRsZXMgY2FzZXMgc3VjaCBhc1xuICAgICAgICAgICAgLy8geCA9IFswLCAxLCAyLFxuICAgICAgICAgICAgLy8gICAgICBbMywgNCwgNSxcbiAgICAgICAgICAgIC8vICAgICAgIDYsIDcsIDhdLFxuICAgICAgICAgICAgLy8gICAgICA5LCAxMCwgMTFdXG4gICAgICAgICAgICAvLyB3aGljaCB3b3VsZCBiZSBjb3JyZWN0bHkgaGFuZGxlZCBieSB0aGUgY2FzZSBiZWxvdywgYnV0IGl0IGFsc28gY29ycmVjdGx5IGhhbmRsZXNcbiAgICAgICAgICAgIC8vIHggPSBbXG4gICAgICAgICAgICAvLyAgICAgMCwgMSwgMiwgWzMsIDQsIDUsXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgIDYsIDcsIDhdLFxuICAgICAgICAgICAgLy8gICAgIDksIDEwLCAxMVxuICAgICAgICAgICAgLy8gXVxuICAgICAgICAgICAgLy8gd2hpY2ggdGhlIGxhc3QgY2FzZSBiZWxvdyB3b3VsZCBpbmNvcnJlY3RseSBpbmRlbnQgYW4gZXh0cmEgc3BhY2VcbiAgICAgICAgICAgIC8vIGJlZm9yZSB0aGUgXCI5XCIsIGJlY2F1c2UgaXQgd291bGQgdHJ5IHRvIG1hdGNoIGl0IHVwIHdpdGggdGhlXG4gICAgICAgICAgICAvLyBvcGVuIGJyYWNrZXQgaW5zdGVhZCBvZiB1c2luZyB0aGUgaGFuZ2luZyBpbmRlbnQuXG4gICAgICAgICAgICBjb25zdCBwcmV2aW91c0luZGVudCA9IHRoaXMuZWRpdG9yLmluZGVudGF0aW9uRm9yQnVmZmVyUm93KGxhc3RDbG9zZWRSb3dbMF0pO1xuICAgICAgICAgICAgaW5kZW50Q29sdW1uID0gcHJldmlvdXNJbmRlbnQgKiB0YWJMZW5ndGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBsYXN0T3BlbkJyYWNrZXRMb2NhdGlvbnNbMV0gaXMgdGhlIGNvbHVtbiB3aGVyZSB0aGUgYnJhY2tldCB3YXMsXG4gICAgICAgICAgICAvLyBzbyBuZWVkIHRvIGJ1bXAgdXAgdGhlIGluZGVudGF0aW9uIGJ5IG9uZVxuICAgICAgICAgICAgaW5kZW50Q29sdW1uID0gbGFzdE9wZW5CcmFja2V0TG9jYXRpb25zWzFdICsgMTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENhbGN1bGF0ZSBzb2Z0LXRhYnMgZnJvbSBzcGFjZXMgKGNhbiBoYXZlIHJlbWFpbmRlcilcbiAgICAgICAgbGV0IHRhYnMgPSBpbmRlbnRDb2x1bW4gLyB0YWJMZW5ndGg7XG4gICAgICAgIGNvbnN0IHJlbSA9ICh0YWJzIC0gTWF0aC5mbG9vcih0YWJzKSkgKiB0YWJMZW5ndGg7XG5cbiAgICAgICAgLy8gSWYgdGhlcmUncyBhIHJlbWFpbmRlciwgYEBlZGl0b3IuYnVpbGRJbmRlbnRTdHJpbmdgIHJlcXVpcmVzIHRoZSB0YWIgdG9cbiAgICAgICAgLy8gYmUgc2V0IHBhc3QgdGhlIGRlc2lyZWQgaW5kZW50YXRpb24gbGV2ZWwsIHRodXMgdGhlIGNlaWxpbmcuXG4gICAgICAgIHRhYnMgPSByZW0gPiAwID8gTWF0aC5jZWlsKHRhYnMpIDogdGFicztcblxuICAgICAgICAvLyBPZmZzZXQgaXMgdGhlIG51bWJlciBvZiBzcGFjZXMgdG8gc3VidHJhY3QgZnJvbSB0aGUgc29mdC10YWJzIGlmIHRoZXlcbiAgICAgICAgLy8gYXJlIHBhc3QgdGhlIGRlc2lyZWQgaW5kZW50YXRpb24gKG5vdCBkaXZpc2libGUgYnkgdGFiIGxlbmd0aCkuXG4gICAgICAgIGNvbnN0IG9mZnNldCA9IHJlbSA+IDAgPyB0YWJMZW5ndGggLSByZW0gOiAwO1xuXG4gICAgICAgIC8vIEknbSBnbGFkIEF0b20gaGFzIGFuIG9wdGlvbmFsIGBjb2x1bW5gIHBhcmFtIHRvIHN1YnRyYWN0IHNwYWNlcyBmcm9tXG4gICAgICAgIC8vIHNvZnQtdGFicywgdGhvdWdoIEkgZG9uJ3Qgc2VlIGl0IHVzZWQgYW55d2hlcmUgaW4gdGhlIGNvcmUuXG4gICAgICAgIC8vIEl0IGxvb2tzIGxpa2UgZm9yIGhhcmQgdGFicywgdGhlIFwidGFic1wiIGlucHV0IGNhbiBiZSBmcmFjdGlvbmFsIGFuZFxuICAgICAgICAvLyB0aGUgXCJjb2x1bW5cIiBpbnB1dCBpcyBpZ25vcmVkLi4uP1xuICAgICAgICBjb25zdCBpbmRlbnQgPSB0aGlzLmVkaXRvci5idWlsZEluZGVudFN0cmluZyh0YWJzLCBvZmZzZXQpO1xuXG4gICAgICAgIC8vIFRoZSByYW5nZSBvZiB0ZXh0IHRvIHJlcGxhY2Ugd2l0aCBvdXIgaW5kZW50XG4gICAgICAgIC8vIHdpbGwgbmVlZCB0byBjaGFuZ2UgdGhpcyBmb3IgaGFyZCB0YWJzLCBlc3BlY2lhbGx5IHRyaWNreSBmb3Igd2hlblxuICAgICAgICAvLyBoYXJkIHRhYnMgaGF2ZSBtaXh0dXJlIG9mIHRhYnMgKyBzcGFjZXMsIHdoaWNoIHRoZXkgY2FuIGp1ZGdpbmcgZnJvbVxuICAgICAgICAvLyB0aGUgZWRpdG9yLmJ1aWxkSW5kZW50U3RyaW5nIGZ1bmN0aW9uXG4gICAgICAgIGNvbnN0IHN0YXJ0UmFuZ2UgPSBbcm93LCAwXTtcbiAgICAgICAgY29uc3Qgc3RvcFJhbmdlID0gW3JvdywgdGhpcy5lZGl0b3IuaW5kZW50YXRpb25Gb3JCdWZmZXJSb3cocm93KSAqIHRhYkxlbmd0aF07XG4gICAgICAgIHRoaXMuZWRpdG9yLmdldEJ1ZmZlcigpLnNldFRleHRJblJhbmdlKFtzdGFydFJhbmdlLCBzdG9wUmFuZ2VdLCBpbmRlbnQpO1xuICAgIH1cblxuICAgIHBhcnNlTGluZXMobGluZXMpIHtcbiAgICAgICAgLy8gb3BlbkJyYWNrZXRTdGFjayBpcyBhbiBhcnJheSBvZiBbcm93LCBjb2xdIGluZGljYXRpbmcgdGhlIGxvY2F0aW9uXG4gICAgICAgIC8vIG9mIHRoZSBvcGVuaW5nIGJyYWNrZXQgKHNxdWFyZSwgY3VybHksIG9yIHBhcmVudGhlc2VzKVxuICAgICAgICBjb25zdCBvcGVuQnJhY2tldFN0YWNrID0gW107XG4gICAgICAgIC8vIGxhc3RDbG9zZWRSb3cgaXMgZWl0aGVyIGVtcHR5IG9yIFtyb3dPcGVuLCByb3dDbG9zZV0gZGVzY3JpYmluZyB0aGVcbiAgICAgICAgLy8gcm93cyB3aGVyZSB0aGUgbGF0ZXN0IGNsb3NlZCBicmFja2V0IHdhcyBvcGVuZWQgYW5kIGNsb3NlZC5cbiAgICAgICAgbGV0IGxhc3RDbG9zZWRSb3cgPSBbXTtcbiAgICAgICAgLy8gSWYgd2UgYXJlIGluIGEgc3RyaW5nLCB0aGlzIHRlbGxzIHVzIHdoYXQgY2hhcmFjdGVyIGludHJvZHVjZWQgdGhlIHN0cmluZ1xuICAgICAgICAvLyBpLmUuLCBkaWQgdGhpcyBzdHJpbmcgc3RhcnQgd2l0aCAnIG9yIHdpdGggXCI/XG4gICAgICAgIGxldCBzdHJpbmdEZWxpbWl0ZXIgPSBbXTtcbiAgICAgICAgLy8gVGhpcyBpcyB0aGUgcm93IG9mIHRoZSBsYXN0IGZ1bmN0aW9uIGRlZmluaXRpb25cbiAgICAgICAgbGV0IGxhc3RDb2xvblJvdyA9IE5hTjtcblxuICAgICAgICAvLyB0cnVlIGlmIHdlIGFyZSBpbiBhIHRyaXBsZSBxdW90ZWQgc3RyaW5nXG4gICAgICAgIGxldCBpblRyaXBsZVF1b3RlZFN0cmluZyA9IGZhbHNlO1xuXG4gICAgICAgIC8vIElmIHdlIGhhdmUgc2VlbiB0d28gb2YgdGhlIHNhbWUgc3RyaW5nIGRlbGltaXRlcnMgaW4gYSByb3csXG4gICAgICAgIC8vIHRoZW4gd2UgaGF2ZSB0byBjaGVjayB0aGUgbmV4dCBjaGFyYWN0ZXIgdG8gc2VlIGlmIGl0IG1hdGNoZXNcbiAgICAgICAgLy8gaW4gb3JkZXIgdG8gY29ycmVjdGx5IHBhcnNlIHRyaXBsZSBxdW90ZWQgc3RyaW5ncy5cbiAgICAgICAgbGV0IGNoZWNrTmV4dENoYXJGb3JTdHJpbmcgPSBmYWxzZTtcblxuICAgICAgICAvLyBrZWVwIHRyYWNrIG9mIHRoZSBudW1iZXIgb2YgY29uc2VjdXRpdmUgc3RyaW5nIGRlbGltaXRlcidzIHdlJ3ZlIHNlZW5cbiAgICAgICAgLy8gdXNlZCB0byB0ZWxsIGlmIHdlIGFyZSBpbiBhIHRyaXBsZSBxdW90ZWQgc3RyaW5nXG4gICAgICAgIGxldCBudW1Db25zZWN1dGl2ZVN0cmluZ0RlbGltaXRlcnMgPSAwO1xuXG4gICAgICAgIC8vIHRydWUgaWYgd2Ugc2hvdWxkIGhhdmUgYSBoYW5naW5nIGluZGVudCwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAgICAgIGxldCBzaG91bGRIYW5nID0gZmFsc2U7XG5cbiAgICAgICAgLy8gTk9URTogdGhpcyBwYXJzaW5nIHdpbGwgb25seSBiZSBjb3JyZWN0IGlmIHRoZSBweXRob24gY29kZSBpcyB3ZWxsLWZvcm1lZFxuICAgICAgICAvLyBzdGF0ZW1lbnRzIGxpa2UgXCJbMCwgKDEsIDJdKVwiIG1pZ2h0IGJyZWFrIHRoZSBwYXJzaW5nXG5cbiAgICAgICAgLy8gbG9vcCBvdmVyIGVhY2ggbGluZVxuICAgICAgICBmb3IgKGNvbnN0IHJvdyBvZiBBcnJheShsaW5lcy5sZW5ndGgpLmZpbGwoKS5tYXAoKF8sIGkpID0+IGkpKSB7XG4gICAgICAgICAgICBjb25zdCBsaW5lID0gbGluZXNbcm93XTtcblxuICAgICAgICAgICAgLy8gYm9vbGVhbiwgd2hldGhlciBvciBub3QgdGhlIGN1cnJlbnQgY2hhcmFjdGVyIGlzIGJlaW5nIGVzY2FwZWRcbiAgICAgICAgICAgIC8vIGFwcGxpY2FibGUgd2hlbiB3ZSBhcmUgY3VycmVudGx5IGluIGEgc3RyaW5nXG4gICAgICAgICAgICBsZXQgaXNFc2NhcGVkID0gZmFsc2U7XG5cbiAgICAgICAgICAgIC8vIFRoaXMgaXMgdGhlIGxhc3QgZGVmaW5lZCBkZWYvZm9yL2lmL2VsaWYvZWxzZS90cnkvZXhjZXB0IHJvd1xuICAgICAgICAgICAgY29uc3QgbGFzdGxhc3RDb2xvblJvdyA9IGxhc3RDb2xvblJvdztcblxuICAgICAgICAgICAgZm9yIChjb25zdCBjb2wgb2YgQXJyYXkobGluZS5sZW5ndGgpLmZpbGwoKS5tYXAoKF8sIGkpID0+IGkpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYyA9IGxpbmVbY29sXTtcblxuICAgICAgICAgICAgICAgIGlmIChjID09PSBzdHJpbmdEZWxpbWl0ZXIgJiYgIWlzRXNjYXBlZCkge1xuICAgICAgICAgICAgICAgICAgICBudW1Db25zZWN1dGl2ZVN0cmluZ0RlbGltaXRlcnMgKz0gMTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNoZWNrTmV4dENoYXJGb3JTdHJpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgbnVtQ29uc2VjdXRpdmVTdHJpbmdEZWxpbWl0ZXJzID0gMDtcbiAgICAgICAgICAgICAgICAgICAgc3RyaW5nRGVsaW1pdGVyID0gW107XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbnVtQ29uc2VjdXRpdmVTdHJpbmdEZWxpbWl0ZXJzID0gMDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjaGVja05leHRDaGFyRm9yU3RyaW5nID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAvLyBJZiBzdHJpbmdEZWxpbWl0ZXIgaXMgc2V0LCB0aGVuIHdlIGFyZSBpbiBhIHN0cmluZ1xuICAgICAgICAgICAgICAgIC8vIE5vdGUgdGhhdCB0aGlzIHdvcmtzIGNvcnJlY3RseSBldmVuIGZvciB0cmlwbGUgcXVvdGVkIHN0cmluZ3NcbiAgICAgICAgICAgICAgICBpZiAoc3RyaW5nRGVsaW1pdGVyLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNFc2NhcGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiBjdXJyZW50IGNoYXJhY3RlciBpcyBlc2NhcGVkLCB0aGVuIHdlIGRvIG5vdCBjYXJlIHdoYXQgaXQgd2FzLFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYnV0IHNpbmNlIGl0IGlzIGltcG9zc2libGUgZm9yIHRoZSBuZXh0IGNoYXJhY3RlciB0byBiZSBlc2NhcGVkIGFzIHdlbGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBnbyBhaGVhZCBhbmQgc2V0IHRoYXQgdG8gZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRXNjYXBlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGMgPT09IHN0cmluZ0RlbGltaXRlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlIGFyZSBzZWVpbmcgdGhlIHNhbWUgcXVvdGUgdGhhdCBzdGFydGVkIHRoZSBzdHJpbmcsIGkuZS4gJyBvciBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpblRyaXBsZVF1b3RlZFN0cmluZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobnVtQ29uc2VjdXRpdmVTdHJpbmdEZWxpbWl0ZXJzID09PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBCcmVha2luZyBvdXQgb2YgdGhlIHRyaXBsZSBxdW90ZWQgc3RyaW5nLi4uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBudW1Db25zZWN1dGl2ZVN0cmluZ0RlbGltaXRlcnMgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nRGVsaW1pdGVyID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpblRyaXBsZVF1b3RlZFN0cmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChudW1Db25zZWN1dGl2ZVN0cmluZ0RlbGltaXRlcnMgPT09IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVzZXQgdGhlIGNvdW50LCBjb3JyZWN0bHkgaGFuZGxlcyBjYXNlcyBsaWtlICcnJycnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBudW1Db25zZWN1dGl2ZVN0cmluZ0RlbGltaXRlcnMgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpblRyaXBsZVF1b3RlZFN0cmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChudW1Db25zZWN1dGl2ZVN0cmluZ0RlbGltaXRlcnMgPT09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2UgYXJlIG5vdCBjdXJyZW50bHkgaW4gYSB0cmlwbGUgcXVvdGVkIHN0cmluZywgYW5kIHdlJ3ZlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNlZW4gdHdvIG9mIHRoZSBzYW1lIHN0cmluZyBkZWxpbWl0ZXIgaW4gYSByb3cuIFRoaXMgY291bGRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZWl0aGVyIGJlIGFuIGVtcHR5IHN0cmluZywgaS5lLiAnJyBvciBcIlwiLCBvciBpdCBjb3VsZCBiZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGUgc3RhcnQgb2YgYSB0cmlwbGUgcXVvdGVkIHN0cmluZy4gV2Ugd2lsbCBjaGVjayB0aGUgbmV4dFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjaGFyYWN0ZXIsIGFuZCBpZiBpdCBtYXRjaGVzIHRoZW4gd2Uga25vdyB3ZSdyZSBpbiBhIHRyaXBsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBxdW90ZWQgc3RyaW5nLCBhbmQgaWYgaXQgZG9lcyBub3QgbWF0Y2ggd2Uga25vdyB3ZSdyZSBub3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaW4gYSBzdHJpbmcgYW55IG1vcmUgKGkuZS4gaXQgd2FzIHRoZSBlbXB0eSBzdHJpbmcpLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGVja05leHRDaGFyRm9yU3RyaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG51bUNvbnNlY3V0aXZlU3RyaW5nRGVsaW1pdGVycyA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXZSBhcmUgbm90IGluIGEgc3RyaW5nIHRoYXQgaXMgbm90IHRyaXBsZSBxdW90ZWQsIGFuZCB3ZSd2ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBqdXN0IHNlZW4gYW4gdW4tZXNjYXBlZCBpbnN0YW5jZSBvZiB0aGF0IHN0cmluZyBkZWxpbWl0ZXIuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEluIG90aGVyIHdvcmRzLCB3ZSd2ZSBsZWZ0IHRoZSBzdHJpbmcuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEl0IGlzIGFsc28gd29ydGggbm90aW5nIHRoYXQgaXQgaXMgaW1wb3NzaWJsZSBmb3JcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbnVtQ29uc2VjdXRpdmVTdHJpbmdEZWxpbWl0ZXJzIHRvIGJlIDAgYXQgdGhpcyBwb2ludCwgc29cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcyBzZXQgb2YgaWYvZWxzZSBpZiBzdGF0ZW1lbnRzIGNvdmVycyBhbGwgY2FzZXMuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cmluZ0RlbGltaXRlciA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gXCJcXFxcXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXZSBhcmUgc2VlaW5nIGFuIHVuZXNjYXBlZCBiYWNrc2xhc2gsIHRoZSBuZXh0IGNoYXJhY3RlciBpcyBlc2NhcGVkLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5vdGUgdGhhdCB0aGlzIGlzIG5vdCBleGFjdGx5IHRydWUgaW4gcmF3IHN0cmluZ3MsIEhPV0VWRVIsIGluIHJhd1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHN0cmluZ3MgeW91IGNhbiBzdGlsbCBlc2NhcGUgdGhlIHF1b3RlIG1hcmsgYnkgdXNpbmcgYSBiYWNrc2xhc2guXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2luY2UgdGhhdCdzIGFsbCB3ZSByZWFsbHkgY2FyZSBhYm91dCBhcyBmYXIgYXMgZXNjYXBlZCBjaGFyYWN0ZXJzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZ28sIHdlIGNhbiBhc3N1bWUgd2UgYXJlIG5vdyBlc2NhcGluZyB0aGUgbmV4dCBjaGFyYWN0ZXIuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNFc2NhcGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChcIlsoe1wiLmluY2x1ZGVzKGMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuQnJhY2tldFN0YWNrLnB1c2goW3JvdywgY29sXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgb25seSBjaGFyYWN0ZXJzIGFmdGVyIHRoaXMgb3BlbmluZyBicmFja2V0IGFyZSB3aGl0ZXNwYWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhlbiB3ZSBzaG91bGQgZG8gYSBoYW5naW5nIGluZGVudC4gSWYgdGhlcmUgYXJlIG90aGVyIG5vbi13aGl0ZXNwYWNlXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjaGFyYWN0ZXJzIGFmdGVyIHRoaXMsIHRoZW4gdGhleSB3aWxsIHNldCB0aGUgc2hvdWxkSGFuZyBib29sZWFuIHRvIGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG91bGRIYW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcIiBcXHRcXHJcXG5cIi5pbmNsdWRlcyhjKSkgeyAvLyBqdXN0IGluIGNhc2UgdGhlcmUncyBhIG5ldyBsaW5lXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiBpdCdzIHdoaXRlc3BhY2UsIHdlIGRvbid0IGNhcmUgYXQgYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzIGNoZWNrIGlzIG5lY2Vzc2FyeSBzbyB3ZSBkb24ndCBzZXQgc2hvdWxkSGFuZyB0byBmYWxzZSBldmVuIGlmXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzb21lb25lIGUuZy4ganVzdCBlbnRlcmVkIGEgc3BhY2UgYmV0d2VlbiB0aGUgb3BlbmluZyBicmFja2V0IGFuZCB0aGVcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5ld2xpbmUuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjID09PSBcIiNcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBjaGVjayBnb2VzIGFzIHdlbGwgdG8gbWFrZSBzdXJlIHdlIGRvbid0IHNldCBzaG91bGRIYW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0byBmYWxzZSBpbiBzaW1pbGFyIGNpcmN1bXN0YW5jZXMgYXMgZGVzY3JpYmVkIGluIHRoZSB3aGl0ZXNwYWNlIHNlY3Rpb24uXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlJ3ZlIGFscmVhZHkgc2tpcHBlZCBpZiB0aGUgY2hhcmFjdGVyIHdhcyB3aGl0ZS1zcGFjZSwgYW4gb3BlbmluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYnJhY2tldCwgb3IgYSBuZXcgbGluZSwgc28gdGhhdCBtZWFucyB0aGUgY3VycmVudCBjaGFyYWN0ZXIgaXMgbm90XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB3aGl0ZXNwYWNlIGFuZCBub3QgYW4gb3BlbmluZyBicmFja2V0LCBzbyBzaG91bGRIYW5nIG5lZWRzIHRvIGdldCBzZXQgdG9cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZhbHNlLlxuICAgICAgICAgICAgICAgICAgICAgICAgc2hvdWxkSGFuZyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBTaW1pbGFyIHRvIGFib3ZlLCB3ZSd2ZSBhbHJlYWR5IHNraXBwZWQgYWxsIGlycmVsZXZhbnQgY2hhcmFjdGVycyxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNvIGlmIHdlIHNhdyBhIGNvbG9uIGVhcmxpZXIgaW4gdGhpcyBsaW5lLCB0aGVuIHdlIHdvdWxkIGhhdmVcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGluY29ycmVjdGx5IHRob3VnaHQgaXQgd2FzIHRoZSBlbmQgb2YgYSBkZWYvZm9yL2lmL2VsaWYvZWxzZS90cnkvZXhjZXB0XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBibG9jayB3aGVuIGl0IHdhcyBhY3R1YWxseSBhIGRpY3Rpb25hcnkgYmVpbmcgZGVmaW5lZCwgcmVzZXQgdGhlXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBsYXN0Q29sb25Sb3cgdmFyaWFibGUgdG8gd2hhdGV2ZXIgaXQgd2FzIHdoZW4gd2Ugc3RhcnRlZCBwYXJzaW5nIHRoaXNcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxpbmUuXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0Q29sb25Sb3cgPSBsYXN0bGFzdENvbG9uUm93O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYyA9PT0gXCI6XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0Q29sb25Sb3cgPSByb3c7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFwifSldXCIuaW5jbHVkZXMoYykgJiYgb3BlbkJyYWNrZXRTdGFjay5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGUgLnBvcCgpIHdpbGwgdGFrZSB0aGUgZWxlbWVudCBvZmYgb2YgdGhlIG9wZW5CcmFja2V0U3RhY2sgYXMgaXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhZGRzIGl0IHRvIHRoZSBhcnJheSBmb3IgbGFzdENsb3NlZFJvdy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0Q2xvc2VkUm93ID0gW29wZW5CcmFja2V0U3RhY2sucG9wKClbMF0sIHJvd107XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFwiJ1xcXCJcIi5pbmNsdWRlcyhjKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFN0YXJ0aW5nIGEgc3RyaW5nLCBrZWVwIHRyYWNrIG9mIHdoYXQgcXVvdGUgd2FzIHVzZWQgdG8gc3RhcnQgaXQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nRGVsaW1pdGVyID0gYztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBudW1Db25zZWN1dGl2ZVN0cmluZ0RlbGltaXRlcnMgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBvcGVuQnJhY2tldFN0YWNrLCBsYXN0Q2xvc2VkUm93LCBzaG91bGRIYW5nLCBsYXN0Q29sb25Sb3cgfTtcbiAgICB9XG5cbiAgICBpbmRlbnRIYW5naW5nKHJvdykge1xuICAgICAgICAvLyBJbmRlbnQgYXQgdGhlIGN1cnJlbnQgYmxvY2sgbGV2ZWwgcGx1cyB0aGUgc2V0dGluZyBhbW91bnQgKDEgb3IgMilcbiAgICAgICAgY29uc3QgaW5kZW50ID0gKHRoaXMuZWRpdG9yLmluZGVudGF0aW9uRm9yQnVmZmVyUm93KHJvdykpICtcbiAgICAgICAgICAgIChhdG9tLmNvbmZpZy5nZXQoXCJweXRob24taW5kZW50LmhhbmdpbmdJbmRlbnRUYWJzXCIpKTtcblxuICAgICAgICAvLyBTZXQgdGhlIGluZGVudFxuICAgICAgICB0aGlzLmVkaXRvci5zZXRJbmRlbnRhdGlvbkZvckJ1ZmZlclJvdyhyb3csIGluZGVudCk7XG4gICAgfVxufVxuIl19