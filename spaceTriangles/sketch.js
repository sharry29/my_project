let colors;

class Triangle {
	constructor(a, b, c) {
		this.a = a;
		this.b = b;
		this.c = c;
	}

	get points() {
		return [this.a, this.b, this.c];
	}

	split() {
		// let m = (this.c.y - this.b.y)/(this.c.x - this.b.x);
		// let intercept = this.c.y - (m * this.c.x);

		// let dx = (this.a.x + m*(this.a.y - intercept))/(1 + m * m);
		// let dy = (m * this.a.x + m * m * this.a.y + intercept) / (1 + m * m);

		let k = ((this.c.y - this.b.y) * (this.a.x - this.b.x) - (this.c.x - this.b.x) * (this.a.y - this.b.y)) / ((this.c.y - this.b.y) * (this.c.y - this.b.y) + (this.c.x - this.b.x) * (this.c.x - this.b.x))
		let dx = this.a.x - k * (this.c.y - this.b.y)
		let dy = this.a.y + k * (this.c.x - this.b.x)
		
		let d = createVector(dx, dy);
		return [new Tree(new Triangle(d, this.a, this.b)), new Tree(new Triangle(d, this.c, this.a))];
	}

	draw(i) {

		if (this.inside()) {
			fill(colors[i % colors.length]);
			stroke(colors[i % colors.length]);
		} else {
			fill(colors[i % colors.length]);
			stroke(colors[i % colors.length]);

			// noFill();
		}
		triangle(this.a.x, this.a.y, this.b.x, this.b.y, this.c.x, this.c.y);
	}

	sign(p1, p2, p3) {
		return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
	}

	inside() {
		let cursorVec = createVector(mouseX, mouseY);
		let d1 = this.sign(cursorVec, this.a, this.b);
		let d2 = this.sign(cursorVec, this.b, this.c);
		let d3 = this.sign(cursorVec, this.c, this.a);

		let has_neg = (d1 < 0) || (d2 < 0) || (d3 < 0);
		let has_pos = (d1 > 0) || (d2 > 0) || (d3 > 0);

		return !(has_neg && has_pos);
	}


}


class Tree {
	constructor(triangle, children = []) {
		this.triangle = triangle;
		this.children = children;
		this.i = 0;
	}

	// get children() {
	// 	return this.children;
	// }

	// get triangle() {
	// 	return this.triangle
	// }

	splitN(n) {
		while (n > 0) {
			let leafs = this.findLeafs();
			console.log(leafs.length);
			this.splitAll(leafs);
			n--;
		}
	}

	findLeafs(storage) {
		if (this.children.length == 0) {
			return [this];
		} else {
			let results = []
			for (const child of this.children) {
				results = results.concat(child.findLeafs());
			}
			console.log(results)
			return results;
		}
	}

	splitAll(leafs) {
		this.i = 1;
		for (const leaf of leafs) {
			leaf.split();
			for (const newLeaf of leaf.children) {
				newLeaf.i = this.i;
				this.i++;
			}
		}
	}

	split() {
		if (this.children.length > 0) {
			console.log("Tried to split a tree, not a leaf");
			return;
		}
		this.children = this.triangle.split();
	}

	draw() {
		if (this.children.length == 0) {
			this.triangle.draw(this.i);
		} else {
			for (let i = 0; i < this.children.length; i++) {
				// if (this.triangle != null) {
				// 	this.triangle.draw()
				// }

				this.children[i].draw();
			}
		}
	}
}

let t;
let i = 0;
let leftLeaf;
let rightLeaf;
let points;
let bounds;
let backgroundC;

// let font;
// function preload() {
//   font = loadFont('assets/inconsolata.otf');
// }

function setup() {
	createCanvas(windowWidth, windowHeight);
	// colors = ["#5bc0eb","#fde74c","#9bc53d","#857e7b","#59344f"];
	colors = ["#ef3e36","#4C5760","#fad8d6"];
	backgroundC = "#2e282a";
	let a = createVector(0, 0);
	let b = createVector(width, 0);
	let c = createVector(0, height);
	let d = createVector(width, height);

	leftLeaf = new Tree(new Triangle(a, b, c));
	rightLeaf = new Tree(new Triangle(d, b, c));

	t = new Tree(null, [leftLeaf, rightLeaf]);
	t.splitN(13);

	console.log(t);
	frameRate(30);

	// points = font.textToPoints('p5', 0, 0, 10, {
	// 	sampleFactor: 5,
	// 	simplifyThreshold: 0
	//   });
	//   bounds = font.textBounds(' p5 ', 0, 0, 10);
	// put setup code here
}



function draw() {

	background(255);
	noFill();
	// stroke(0);
	strokeWeight(1);
	noStroke();
	t.draw();

	fill(colors[2]);
	stroke(backgroundC);
	strokeWeight(10);
	textSize(width / 4);
	textAlign(CENTER, CENTER)
	for (let i = width / 2 - 30; i <= width / 2 + 30; i+= 2) {
		text('CIS\n110', i, height/2);
	}





	// if (i == 0) {
	// 	let a = createVector(0, 0);
	// 	let b = createVector(width, 0);
	// 	let c = createVector(0, height);
	// 	let d = createVector(width, height);

	// 	leftLeaf = new Tree(new Triangle(a, b, c));
	// 	rightLeaf = new Tree(new Triangle(d, b, c));
	// } else {
	// 	t.splitN(1);
	// }
	// i = (i + 1) % 4;
	// t.draw();



}
