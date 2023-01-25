const NO_CONNECT = null;
let points;
let distances;
let mst;
let mapping;
let graph
let triangles;

function setup() {
	createCanvas(windowWidth, windowHeight);
	points = generatePoints(10000);
	distances = computeDistances(points);
	mst = prims(points, distances)
	//(distances)
	//(mst)

	mapping = new Array(points.length)
	graph = {}

	points.forEach(function (e, i) { 
		mapping[i] = e.v;
		graph[i] = new Set();
	})


	mst.forEach(function (e) {
		let v = e[0]
		let w = e[1]

		if (graph[v] == undefined) {
			graph[v] = new Set();
		} 
		if (graph[w] == undefined) {
			graph[w] = new Set();
		}
		graph[v].add(w);
		graph[w].add(v);
	})

	let leaves = new Set();
	for (let i = 0; i < points.length; i++) {
		if (graph[i].size == 1) {
			leaves.add(i);
		}
	}
	for (const leaf of leaves) {
		let minLeaf;
		let minLeafDist = Infinity;
		for (const otherLeaf of leaves) {
			if (leaf != otherLeaf && distances[leaf][otherLeaf] < minLeafDist) {
				minLeaf = otherLeaf;
				minLeafDist = distances[leaf][otherLeaf];
			}
		}
		graph[leaf].add(minLeaf);
	}

	

	let stack = [];
	let discovered = new Set();
	triangles = []
	stack.push({i: 0});
	while (stack.length > 0) {
		let v = stack.pop();
		if (!discovered.has(v.i)) {
			console.log(`visiting ${v.i}`)
			discovered.add(v.i);
			angles = []
			for (const w of graph[v.i]) {
				angles.push({i: w, alpha: mapping[v.i].angleBetween(mapping[w])})
				stack.push({i: w});

			}
			if (angles.length == 1) {
				continue;
			} 
			angles.sort((a, b) => a.alpha - b.alpha)
			angles.push(angles[0]);
			for (let j = 0; j < angles.length - 1; j++) {
				triangles.push({a: v.i, b:angles[j].i, c:angles[j+1].i})
			}
			
		}
	}



	// let stack = [];
	// let discovered = new Set();
	// triangles = []
	// stack.push({i: 0, triangulate: true});
	// while (stack.length > 0) {
	// 	let v = stack.pop();
	// 	if (!discovered.has(v.i)) {
	// 		console.log(`visiting ${v.i}`)
	// 		discovered.add(v.i);
	// 		for (const w of graph[v.i]) {
	// 			console.log(graph[v.i])
	// 			stack.push({i: w, triangulate: !v.triangulate});
	// 			if (v.triangulate) {
	// 				for (const x of graph[w]) {
	// 					if (!discovered.has(x)) {
	// 						triangles.push({a: v.i, b: w, c: x})
	// 					}
	// 				}
	// 			}
	// 		}
	// 	}
	// }


}

function draw() {
	background(200);

	// stroke(0);
	noStroke();
	triangles.forEach(function (t, i) {
		// fill(0, 50)
		fill(map(i, 0, triangles.length, 0, 255), 0, 255, 50)
		let a = mapping[t.a];
		let b = mapping[t.b];
		let c = mapping[t.c];
		triangle(a.x, a.y, b.x, b.y, c.x, c.y)
	})

	// noFill();
	// stroke(255, 0, 0);
	// strokeWeight(1);

	// points.forEach(p => {circle(p.v.x, p.v.y, 10)})

	// stroke(0);
	// strokeWeight(3);
	// mst.forEach(function (arr) {
	// 	let v = mapping[arr[0]];
	// 	let w = mapping[arr[1]];
	// 	line(v.x, v.y, w.x, w.y)
	// })


	// put drawing code here
}

function generatePoints(n = 100) {

	let points = new Array(n);
	for (let i = 0; i < n; i++) {
		let x = map(random(), 0, 1, -0.1 * windowWidth, 1.1 * windowWidth)
		let y = map(random(), 0, 1, -0.1 * windowHeight, 1.1 * windowHeight)
		points[i] = {idx: i, v: new p5.Vector(x, y)}
	}
	return points;

}

function computeDistances(points) {
	let distances = {}
	points.forEach(function (p) {
		distances[p.idx] = {}
		points.forEach(function (q) {
			distances[p.idx][q.idx] = p5.Vector.dist(p.v, q.v);
		})

	})
	return distances;
}

function prims(points, distances) {
	let costs = {};
	points.forEach(p => costs[p.idx] = windowHeight * windowWidth);
	let connections = {};
	points.forEach(p => connections[p.idx] = NO_CONNECT);
	let frontier = new Set(points);
	//(`getting mst of ${frontier.size} points`)
	let mst = new Set();

	while (frontier.size > 0) {
		// //(connections)
		let minCostPoint;
		let minCost = Infinity;
		for (const point of frontier) {
			//(costs[point.idx])
			if (costs[point.idx] < minCost) {
				minCostPoint = point;
				minCost = costs[point.idx];
			}
		}
		//(minCostPoint);
		frontier.delete(minCostPoint);

		if (connections[minCostPoint.idx]) {
			mst.add(connections[minCostPoint.idx])
		}

		for (const pointW of frontier) {
			let w = pointW;
			let v = minCostPoint;

			//(distances[w.idx][v.idx], costs[w.idx])
			if (distances[w.idx][v.idx] < costs[w.idx]) {
				//("setting new distance")
				costs[w.idx] = distances[w.idx][v.idx];
				connections[w.idx] = [v.idx, w.idx];
			}
		}
	}

	return mst;


}
