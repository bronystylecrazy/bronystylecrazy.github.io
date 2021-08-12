
var StringMaker = function () {
    this.parts = [];
    this.length = 0;
    this.append = function (s) {
        this.parts.push(s);
        this.length += s.length;
    }
    this.prepend = function (s) {
        this.parts.unshift(s);
        this.length += s.length;
    }
    this.toString = function () {
        return this.parts.join('');
    }
}

function jjencode($$, text) {
    var r = "";
    var n;
    var t;
    var b = ["___", "__$", "_$_", "_$$", "$__", "$_$", "$$_", "$$$", "$___", "$__$", "$_$_", "$_$$", "$$__", "$$_$", "$$$_", "$$$$", ];
    var s = "";
    for (var i = 0; i < text.length; i++) {
        n = text.charCodeAt(i);
        if (n == 0x22 || n == 0x5c) {
            s += "\\\\\\" + text.charAt(i).toString(16);
        } else if ((0x21 <= n && n <= 0x2f) || (0x3A <= n && n <= 0x40) || (0x5b <= n && n <= 0x60) || (0x7b <= n && n <= 0x7f)) {
            //}else if( (0x20 <= n && n <= 0x2f) || (0x3A <= n == 0x40) || ( 0x5b <= n && n <= 0x60 ) || ( 0x7b <= n && n <= 0x7f ) ){
            s += text.charAt(i);
        } else if ((0x30 <= n && n <= 0x39) || (0x61 <= n && n <= 0x66)) {
            if (s) r += "\"" + s + "\"+";
            r += $$ + "." + b[n < 0x40 ? n - 0x30 : n - 0x57] + "+";
            s = "";
        } else if (n == 0x6c) { // 'l'
            if (s) r += "\"" + s + "\"+";
            r += "(![]+\"\")[" + $$ + "._$_]+";
            s = "";
        } else if (n == 0x6f) { // 'o'
            if (s) r += "\"" + s + "\"+";
            r += $$ + "._$+";
            s = "";
        } else if (n == 0x74) { // 'u'
            if (s) r += "\"" + s + "\"+";
            r += $$ + ".__+";
            s = "";
        } else if (n == 0x75) { // 'u'
            if (s) r += "\"" + s + "\"+";
            r += $$ + "._+";
            s = "";
        } else if (n < 128) {
            if (s) r += "\"" + s;
            else r += "\"";
            r += "\\\\\"+" + n.toString(8).replace(/[0-7]/g, function (c) {
                return $$ + "." + b[c] + "+"
            });
            s = "";
        } else {
            if (s) r += "\"" + s;
            else r += "\"";
            r += "\\\\\"+" + $$ + "._+" + n.toString(16).replace(/[0-9a-f]/gi, function (c) {
                return $$ + "." + b[parseInt(c, 16)] + "+"
            });
            s = "";
        }
    }
    if (s) r += "\"" + s + "\"+";

    r =
        $$ + "=~[];" +
        $$ + "={___:++" + $$ + ",$$$$:(![]+\"\")[" + $$ + "],__$:++" + $$ + ",$_$_:(![]+\"\")[" + $$ + "],_$_:++" +
        $$ + ",$_$$:({}+\"\")[" + $$ + "],$$_$:(" + $$ + "[" + $$ + "]+\"\")[" + $$ + "],_$$:++" + $$ + ",$$$_:(!\"\"+\"\")[" +
        $$ + "],$__:++" + $$ + ",$_$:++" + $$ + ",$$__:({}+\"\")[" + $$ + "],$$_:++" + $$ + ",$$$:++" + $$ + ",$___:++" + $$ + ",$__$:++" + $$ + "};" +
        $$ + ".$_=" +
        "(" + $$ + ".$_=" + $$ + "+\"\")[" + $$ + ".$_$]+" +
        "(" + $$ + "._$=" + $$ + ".$_[" + $$ + ".__$])+" +
        "(" + $$ + ".$$=(" + $$ + ".$+\"\")[" + $$ + ".__$])+" +
        "((!" + $$ + ")+\"\")[" + $$ + "._$$]+" +
        "(" + $$ + ".__=" + $$ + ".$_[" + $$ + ".$$_])+" +
        "(" + $$ + ".$=(!\"\"+\"\")[" + $$ + ".__$])+" +
        "(" + $$ + "._=(!\"\"+\"\")[" + $$ + "._$_])+" +
        $$ + ".$_[" + $$ + ".$_$]+" +
        $$ + ".__+" +
        $$ + "._$+" +
        $$ + ".$;" +
        $$ + ".$$=" +
        $$ + ".$+" +
        "(!\"\"+\"\")[" + $$ + "._$$]+" +
        $$ + ".__+" +
        $$ + "._+" +
        $$ + ".$+" +
        $$ + ".$$;" +
        $$ + ".$=(" + $$ + ".___)[" + $$ + ".$_][" + $$ + ".$_];" +
        $$ + ".$(" + $$ + ".$(" + $$ + ".$$+\"\\\"\"+" + r + "\"\\\"\")())();";

    return r;
}

function MakeIntoString(S) {
    S = StringReplace("\\", "\\\\", S);
    S = StringReplace("\"", "\\\"", S);
    S = StringReplace("\n", "\\n", S);
    return S;
}

function BitsToBytes(i) {
    o = 42;
    if (i.charAt(0) == '1') {
        o += 32;
    }
    if (i.charAt(1) == '1') {
        o += 16;
    }
    if (i.charAt(2) == '1') {
        o += 8;
    }
    if (i.charAt(3) == '1') {
        o += 4;
    }
    if (i.charAt(4) == '1') {
        o += 2;
    }
    if (i.charAt(5) == '1') {
        o += 1;
    }
    if (o >= 92) {
        o++;
    }
    return String.fromCharCode(o);
}

function CompressConfirm() {
    if (confirm("Are you sure that you want to do this?  It can take a long time!")) {
        CompressCode();
    }
}

function CompressCode(ov) {
    // Do initial scan
    var Letters = new Array(256);
    var LetterCodes = new Array(256);

    console.log("Working ...");
    console.log("Counting Letters");

    for (i = 0; i < 256; i++) {
        Letters[i] = 0;
    }

    for (i = 0; i < ov.length; i++) {
        Letters[ov.charCodeAt(i)]++;
    }

    //   This is a testing tree
    //   It should produce a list like this:
    //               __[  ]__
    //         [  ]~~        ~~[  ]__
    //       50    51        52      ~~[  ]
    //                               53    54
    //
    //   Letters[50] = 7;
    //   Letters[51] = 6;
    //   Letters[52] = 5;
    //   Letters[53] = 2;
    //   Letters[54] = 1;

    // Build a Huffman tree from the letter count frequencies
    var NodeLetter = new Array(512);
    var NodeCount = new Array(512);
    var NodeChild1 = new Array(512);
    var NodeChild2 = new Array(512);
    NextParent = 0;

    console.log("Constructing node list");
    for (i = 0; i < 256; i++) {
        if (Letters[i] > 0) {
            NodeLetter[NextParent] = i;
            NodeCount[NextParent] = Letters[i];
            NodeChild1[NextParent] = -1;
            NodeChild2[NextParent] = -1;
            NextParent++;
        }
    }

    // Built node list.  Now combine nodes to make a tree
    console.log("Constructing tree");
    SmallestNode2 = 1;
    while (SmallestNode2 != -1) {
        SmallestNode1 = -1;
        SmallestNode2 = -1;

        for (i = 0; i < NextParent; i++) {
            if (NodeCount[i] > 0) {
                if (SmallestNode1 == -1) {
                    SmallestNode1 = i;
                } else if (SmallestNode2 == -1) {
                    if (NodeCount[i] < NodeCount[SmallestNode1]) {
                        SmallestNode2 = SmallestNode1;
                        SmallestNode1 = i;
                    } else {
                        SmallestNode2 = i;
                    }
                } else if (NodeCount[i] <= NodeCount[SmallestNode1]) {
                    SmallestNode2 = SmallestNode1;
                    SmallestNode1 = i;
                }
            }
        }

        if (SmallestNode2 != -1) {
            NodeCount[NextParent] = NodeCount[SmallestNode1] + NodeCount[SmallestNode2];
            NodeCount[SmallestNode1] = 0;
            NodeCount[SmallestNode2] = 0;
            // Reversed SmallestNode numbers here for ordering in the tree
            NodeChild1[NextParent] = SmallestNode2;
            NodeChild2[NextParent] = SmallestNode1;
            NextParent++;
        }
    }

    // We have constructed the nodes.  Now rewrite the list into a single
    // array.
    // The value of an array element will be positive if it is the
    // character code we want.  Otherwise, it branches.  The left branch
    // will be the next array element.  The value of the array will be
    // (offset * -1), which is the right branch.
    console.log("Making final array");
    var FinalNodes = Array(NextParent);
    var DepthIndex = Array(256);
    Depth = 0;
    NextFinal = 0;
    DepthIndex[Depth] = SmallestNode1;
    while (Depth >= 0) {
        if (NodeChild1[DepthIndex[Depth]] > -1 && NodeChild2[DepthIndex[Depth]] > -1) {
            // If there is a left and right, push them on the stack
            idx = NodeChild1[DepthIndex[Depth]];
            NodeChild1[DepthIndex[Depth]] = -2 - NextFinal;
            Depth++;
            DepthIndex[Depth] = idx;
            NextFinal++;
        } else if (NodeChild1[DepthIndex[Depth]] < 0 && NodeChild2[DepthIndex[Depth]] > -1) {
            // If there is a left and a right, but the left was taken,
            // push the right on the stack.
            // Update the FinalNodes[] with the location for the right
            // branch.
            idx = NodeChild1[DepthIndex[Depth]];
            idx = 0 - idx;
            idx -= 2;
            FinalNodes[idx] = -NextFinal;

            // Traverse right branch
            idx = NodeChild2[DepthIndex[Depth]];
            NodeChild2[DepthIndex[Depth]] = -2;
            Depth++;
            DepthIndex[Depth] = idx;
        } else if (NodeChild1[DepthIndex[Depth]] < -1 && NodeChild2[DepthIndex[Depth]] < -1) {
            // If there was a left and a right, but they were both taken, pop up a level
            Depth--;
        } else if (NodeChild1[DepthIndex[Depth]] == -1 && NodeChild2[DepthIndex[Depth]] == -1) {
            // If we have a child here, add it to the final nodes, pop up
            FinalNodes[NextFinal] = NodeLetter[DepthIndex[Depth]];
            NextFinal++;
            Depth--;
        } else {
            // This shouldn't ever happen
            alert('Bad algorithm!');
            return;
        }
    }


    // We have the tree.  Associate codes with the letters.
    console.log("Determining codes");
    var CodeIndex = new Array(256);
    DepthIndex[0] = 0;
    CodeIndex[0] = "";
    Depth = 0;
    while (Depth >= 0) {
        if (FinalNodes[DepthIndex[Depth]] < 0) {
            c = CodeIndex[Depth];
            idx = DepthIndex[Depth];
            DepthIndex[Depth + 1] = DepthIndex[Depth] + 1;
            CodeIndex[Depth + 1] = c + '0';
            DepthIndex[Depth] = 0 - FinalNodes[idx];
            CodeIndex[Depth] = c + '1';
            Depth++;
        } else {
            LetterCodes[FinalNodes[DepthIndex[Depth]]] = CodeIndex[Depth];
            Depth--;
        }
    }


    // Build resulting data stream
    // The bits string could get very large
    console.log("Building data stream");
    bits = "";
    var bytes = new StringMaker();
    for (i = 0; i < ov.length; i++) {
        bits += LetterCodes[ov.charCodeAt(i)];
        while (bits.length > 5) {
            bytes.append(BitsToBytes(bits));
            bits = bits.slice(6, bits.length);
        }
    }
    bytes.append(BitsToBytes(bits));


    S = "";
    encodedNodes = "";
    for (i = 0; i < FinalNodes.length; i++) {
        var x, y;
        x = FinalNodes[i] + 512;
        y = x & 0x3F;
        x >>= 6;
        x &= 0x3F;
        x += 42;
        y += 42;
        if (x >= 92) {
            x++;
        }
        if (y >= 92) {
            y++;
        }
        encodedNodes += String.fromCharCode(x) + String.fromCharCode(y);
    }
    S += 'a=';
    while (encodedNodes.length > 74) {
        S += '"' + encodedNodes.slice(0, 74) + "\"\n+";
        encodedNodes = encodedNodes.slice(74, encodedNodes.length);
    }
    S += '"' + encodedNodes + "\";\n";
    S += "l=new Array();\n";
    S += "while(a.length){l.push((Y(a.charCodeAt(0))<<6)+Y(a.charCodeAt(1))-512);\n";
    S += "a=a.slice(2,a.length)}\n";
    S += 'd=';
    bytes = bytes.toString();
    while (bytes.length > 74) {
        S += '"' + bytes.slice(0, 74) + "\"\n+";
        bytes = bytes.slice(74, bytes.length);
    }
    S += '"' + bytes + "\";\n";
    S += 'c=' + ov.length + ";e=b=a=0;o=\"\";\n";
    S += "function Y(y){if(y>92)y--;return y-42}\n";
    S += "function B(){if(a==0){b=Y(d.charCodeAt(e++));a=6;}\n";
    S += "return ((b>>--a)&0x01);}\n";
    S += "while(c--){i=0;while(l[i]<0){if(B())i=-l[i];else i++;}\n";
    S += "o+=String.fromCharCode(l[i]);}\n";
    const result = {};

    result.encoded = S;

    result.ov = ov;
    result.S = S;
    result.reduce = Math.floor(100 * (ov.length - S.length) / ov.length);
    return result;
}

 options = {
     "indent": "auto",
     "indent-spaces": 2,
     "wrap": 80,
     "markup": true,
     "output-xml": false,
     "numeric-entities": true,
     "quote-marks": true,
     "quote-nbsp": false,
     "show-body-only": true,
     "quote-ampersand": false,
     "break-before-br": true,
     "uppercase-tags": false,
     "uppercase-attributes": false,
     "drop-font-tags": true,
     "tidy-mark": false
 }

Vue.use(VueCodemirror)
new Vue({
    el: '#app',
    data: {
        code: "",
        info: "",
        encoded: "", 
        cmOption: {
            tabSize: 4,
            styleActiveLine: true,
            lineNumbers: true,
            mode: 'text/javascript',
            theme: "monokai"
        },
    },
    mounted() {
        setInterval(() => this.counter++, 10)
    },
    methods: {
        generate(){
            if(this.code.trim() === '') {
                this.encoded = '';
                return;
            }
            var enc = CompressCode(this.code || ' ');
            this.encoded = js_beautify(enc.encoded + jjencode('e', 'eval(o);o=undefined;'), options);
            this.info = "Size reduced by " + Math.floor(100 * (enc.ov.length - enc.S.length) / enc.ov.length) + "% (" + enc.ov.length + " -> " + enc.S.length + ")"
            console.info('DONE');
        },
        popup(){
            var ShowMeWindow = window.open("", "", "location=no,directories=no,menubar=no,resizable=yes,scrollbars=yes,status=yes,toolbar=no,width=300,height=240");
            ShowMeWindow.document.write(`<script>${this.encoded}</script>`);
            ShowMeWindow.document.close();
        },
        copy(){
                /* Get the text field */
                var copyText = document.getElementById("encoded");

                /* Select the text field */
                copyText.select();
                copyText.setSelectionRange(0, 99999); /* For mobile devices */

                /* Copy the text inside the text field */
                document.execCommand("copy");

        }
    }
})

Vue = undefined;