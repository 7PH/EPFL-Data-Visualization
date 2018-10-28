
/*
	Run the action when we are sure the DOM has been loaded
	https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded
	Example:
	whenDocumentLoaded(() => {
		console.log('loaded!');
		document.getElementById('some-element');
	});
*/
function whenDocumentLoaded(action) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", action);
	} else {
		// `DOMContentLoaded` already fired
		action();
	}
}

class ImageHistogram {

	constructor(figElementId) {
		this.figElementId = figElementId;
		this.svg = d3.select('#' + figElementId + ' svg');
		this.hist = [[0, 0, 1], [2, 0, 1], [4, 2, 0]];

		this.initImage();

		this.plotArea = this.svg.append('g')
			.attr('x', 0)
			.attr('y', 0);

		// may be useful for calculating scales
		const svgViewbox = this.svg.node().viewBox.animVal;
		console.log('viewBox', svgViewbox);

		// Scales
        const scaleX = d3.scaleLinear().domain([0, 255]).range([0, svgViewbox.width]);
        const scaleY = d3.scaleLinear().domain([0, 10000]).range([svgViewbox.height, 0]);
        const colorScale = d3.scaleOrdinal().domain([0, 1, 2]).range(['red', 'green', 'blue']);

		// Curve generator
        const lineGenerator = d3.line()
            .x((d, i) => scaleX(i))
            .y(d => scaleY(d));

		// Data and curves
        const render = () => {

            const paths = this.plotArea
                .selectAll('path')
                .data(this.hist, d => Math.random());

            paths
                .enter()
                .append('path')
                .attr('class', (d, i) => colorScale(i))
                .merge(paths)
                .attr('d', d => {
                    console.log("Regen", d);
                    return lineGenerator(d);
                });

            paths.exit()
                .remove();
        };

		// Brush
        const brush =
            d3.brush().on("brush", () => {
                if (d3.event.selection === null)
                    return;
                console.log(d3.event.selection);
                const [[xMin, yMin], [xMax, yMax]] = d3.event.selection;
                const width = xMax - xMin;
                const height = yMax - yMin;
                this.hist = plotObject.getImageHistogramOfArea(xMin, yMin, width, height);
                this.hist = this.hist.map(d => {
                    d[0] = 0;
                    d[d.length - 1] = 0;
                    return d;
                });
                render();
            });


		// Brush visual representation
        this.svg
            .append("g")
            .attr("class", "brush")
            .call(brush);
	}

    initImage() {
        this.canvas = document.querySelector('#' + this.figElementId + ' canvas');
        console.log(this.canvas);
        this.canvas_context = this.canvas.getContext("2d");

        const image = new Image;
        image.onload = () => {
            this.canvas.width = image.width;
            this.canvas.height = image.height;
            this.canvas_context.drawImage(image, 0, 0);
        };
        image.src = "epfl-rolex.jpg";
    }

    /*
        Calculate the histogram of pixel values inside the specified area
        Returns an array [red, green, blue]
        such that values_red[r] = number of pixels in the area which have the red value exactly equal to r
    */
    getImageHistogramOfArea(xLeft, yTop, width, height) {
        // getImageData:
        //	https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getImageData
        // returns an ImageData
        //	https://developer.mozilla.org/en-US/docs/Web/API/ImageData
        // we use the .data property which is a uint8 array
        //	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray
        const imageBytes = this.canvas_context.getImageData(xLeft, yTop, width, height).data;

        // To make a histogram, for each color we count how many pixels
        // had a given value
        let counts = [
            new Array(256).fill(0),
            new Array(256).fill(0),
            new Array(256).fill(0),
        ];

        // The bytes are arranged as follows: RGBARGBARGBA
        // so to get to the next pixel we add +4 to our index
        for(let idx = 0; idx < imageBytes.length; idx += 4) {
            // pixel color:
            // r = imageBytes[idx], g = imageBytes[idx+1], b = imageBytes[idx+2], a = imageBytes[idx+3]
            counts[0][imageBytes[idx]] += 1;
            counts[1][imageBytes[idx+1]] += 1;
            counts[2][imageBytes[idx+2]] += 1;
        }

        return counts;
    }
}

let plotObject;
whenDocumentLoaded(() => {
    plotObject = new ImageHistogram('fig-histogram');
	// plot object is global, you can inspect it in the dev-console
});
