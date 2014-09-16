// Returns the page number of the first instance of each pra style in use in the doc
// As well as a compiled list of pages that new styles occur on, for creating a sample PDF
// Need to add support for char styles...
// In designer docs, include note to add a range of +2 after chap num/chap title...

(function() {
if (app.documents.length > 0) {
processDocument(app.documents[0]);
}

function paddy(n, p, c) {
    var pad_char = typeof c !== 'undefined' ? c : '0';
    var pad = new Array(1 + p).join(pad_char);
    return (pad + n).slice(-pad.length);
}

function processDocument(aDoc) {
var curr, last = [], len = 0;
var page = aDoc.pages[0];
var bounds = page.bounds;
var theTF = page.textFrames.add({geometricBounds: bounds});
var theStory = theTF.parentStory;
theTF.move(undefined, [bounds[1] - bounds[3], 0]);
var myDoc = app.activeDocument;
var myPages = myDoc.pages;
var arr = [];
for (var j = 0; myPages.length > j; j++) {
	var pageFrames = myPages[j].textFrames;
	for (var h = 0; pageFrames.length > h; h++) {
		var frameParas = pageFrames[h].paragraphs;
		for (var k = 0; frameParas.length > k; k++) {
			var currStyle = frameParas[k].appliedParagraphStyle.name;
			var folio = parseInt(myPages[j].name);
			var padFolio = paddy(folio, 3);
			//if (currStyle = "Chap Number (cn)") {
				//range = padFolio+2;
				//var value = frameParas[k].appliedParagraphStyle.name + "," + padFolio + "-" + range;
			//} else {
				var value = frameParas[k].appliedParagraphStyle.name + "," + padFolio;
			//}
			arr.push(value);
		}
	}
}

theStory.insertionPoints[-1].contents = "FIRST INSTANCE OF EACH STYLE IN USE:";
theStory.insertionPoints[-1].contents = "\r";

arr.sort();
var instances = []

for (var k = 0; arr.length > k; k++) {
	working = arr[k].split(",")
	curr = working[0];
	myPage = working[1];
	if (curr !== last) {
	instances.push(myPage);
	theStory.insertionPoints[-1].contents = arr[k];
	theStory.insertionPoints[-1].contents = "\r";
	}
	last = curr;
}

instances.sort();

theStory.insertionPoints[-1].contents = "\r";
theStory.insertionPoints[-1].contents = "SAMPLE PAGES: ";

for (var s = 0; instances.length > s; s++) {
	curr = instances[s];
	var noFill = parseInt(instances[s],10);
	if (curr !== last) {
		theStory.insertionPoints[-1].contents = noFill + ", ";
	}
	last = curr;
}

}
}())

