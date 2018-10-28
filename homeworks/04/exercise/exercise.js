


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

const TEST_TEMPERATURES = [13, 18, 21, 19, 26, 25, 16];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

//const MARGIN = { top: 10, right: 10, bottom: 10, left: 10 };

class ScatterPlot {

    /**
     *
     * @param plotId
     * @param data
     */
	constructor(plotId, data) {

	    this.plot = d3.select(`#${plotId}`);
	    this.data = data;
        this.scaleX = d3.scaleLinear()
            .domain([0, this.data.length])
            .range([0, ScatterPlot.VIEW_BOX_WIDTH]);
        this.scaleY = d3.scaleLinear()
            .domain([ScatterPlot.MIN_TEMPERATURE, ScatterPlot.MAX_TEMPERATURE])
            .range([ScatterPlot.VIEW_BOX_HEIGHT, 0]);
        this.scaleRedColor = d3.scaleLinear()
            .domain([ScatterPlot.MIN_TEMPERATURE, ScatterPlot.MAX_TEMPERATURE])
            .range([0, 255]);
        this.scaleBlueColor = d3.scaleLinear()
            .domain([ScatterPlot.MIN_TEMPERATURE, ScatterPlot.MAX_TEMPERATURE])
            .range([255, 0]);
    }

    redraw() {

	    this.plot
            .append('rect')
            .attr('width', ScatterPlot.VIEW_BOX_WIDTH)
            .attr('height', ScatterPlot.VIEW_BOX_HEIGHT)
            .style('fill', 'black');

	    this.plot
            .selectAll('circle')
            .data(this.data)
            .enter()
            .append('circle')
                .attr('cx', d => this.scaleX(d.x))
                .attr('cy', d => this.scaleY(d.y))
                .attr('r', 1.0)
                .style('fill', d => `rgb(${this.scaleRedColor(d.y)}, 50, ${this.scaleBlueColor(d.y)})`);

    }
}

ScatterPlot.VIEW_BOX_WIDTH = 200;
ScatterPlot.VIEW_BOX_HEIGHT = 100;
ScatterPlot.MIN_TEMPERATURE = d3.min(TEST_TEMPERATURES)
ScatterPlot.MAX_TEMPERATURE = d3.max(TEST_TEMPERATURES);

whenDocumentLoaded(() => {

	// prepare the data here
    const D3_DATA = TEST_TEMPERATURES.map((temperature, index) => ({
        x: index,
        y: temperature,
        name: DAYS[index % DAYS.length]
    }));

	const plot = new ScatterPlot('plot', D3_DATA);
	plot.redraw();
});

