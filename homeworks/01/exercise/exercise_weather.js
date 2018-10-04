
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

const TEST_TEMPERATURES = [13, 18, 21, 19, 26, 25,16];
const BTN_TEMPERATURE = 'btn-part1';
const DIV_TEMPERATURES = 'weather-part1';

// Part 1 - DOM

whenDocumentLoaded(() => {
	// Part 1.1: Find the button + on click event
	document.getElementById(BTN_TEMPERATURE)
		.addEventListener(
		    'click',
            showTemperatures.bind(this, document.getElementById(DIV_TEMPERATURES), TEST_TEMPERATURES)
        );
});

/**
 * Part 1.2: Write temperatures
 * @param {HTMLElement} container
 * @param {Array<number>} temperatures
 */
const showTemperatures = (container, temperatures) => {
    container.innerHTML = temperatures
        .map(temperature => `<p>${temperature}</p>`)
        .join("\n");
};

// Part 2 - class

class Forecast {

    /**
     * @constructor
     * @param {HTMLElement} container
     */
    constructor(container) {

        /**
         * @type {HTMLElement}
         */
        this.container = container;

        /**
         * @type {Array<number>}
         */
        this.temperatures = [1, 2, 3, 4, 5, 6, 7];
    }

    /**
     * @override
     * @returns {string}
     * @TODO implement
     */
    toString() {
        return "foobar";
    }

    /**
     * Prints string representation to the console.
     */
    print() {
        console.log(this.toString());
    }

    /**
     * Show temperatures into container
     */
    show() {
        this.container.innerHTML =
            this.temperatures
                .map(temperature => `<p>${temperature}</p>`)
                .join('');
    }

    /**
     * @TODO document
     */
    reload() {
        this.temperatures = TEST_TEMPERATURES;
        this.show();
    }
}

whenDocumentLoaded(() => new Forecast(document.getElementById('weather-part2')).reload());

// Part 3 - fetch

const QUERY_LAUSANNE = 'http://query.yahooapis.com/v1/public/yql?format=json&q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="Lausanne") and u="c"';

/**
 *
 * @param {*} data
 * @return {*}
 */
function yahooToTemperatures(data) {
    return data
        .query
        .results
        .channel
        .item
        .forecast
        .map(forecast => .5 * (forecast.low + forecast.high));
}

/**
 *
 */
class ForecastOnline extends Forecast {

    /**
     * @override
     */
    async reload() {
        const data = await (await fetch(QUERY_LAUSANNE)).json();
        this.temperatures = yahooToTemperatures(data);
        this.show();
    }
}

whenDocumentLoaded(async () => {
    await new ForecastOnline(document.getElementById('weather-part3')).reload();
});

// Part 4 - interactive

const QUERY = `http://query.yahooapis.com/v1/public/yql?format=json&q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="{{{city}}}") and u="c"`;

class ForecastOnlineCity extends Forecast {

    /**
     * @constructor
     * @param {HTMLElement} container
     */
    constructor(container) {
        super(container);

        this.city = '';
    }

    /**
     *
     * @param {string} city
     */
    setCity(city) {
        this.city = city;
    }

    /**
     * @override
     */
    async reload() {
        const data = await (await fetch(QUERY.replace('{{{city}}}', this.city))).json();
        try {
            this.temperatures = yahooToTemperatures(data);
        } catch (e) {
            this.temperatures = [];
        }
        this.show();
    }

    /**
     * @override
     */
    show() {
        super.show();

        this.container.innerHTML = `${this.city}: ${this.container.innerHTML}`;
    }
}

const forecastOnlineCity = new ForecastOnlineCity(document.getElementById('weather-city'));

whenDocumentLoaded(() => {
    document.getElementById('btn-city')
        .addEventListener('click', async function() {
            const city = document.getElementById('query-city').value;
            forecastOnlineCity.setCity(city);
            await forecastOnlineCity.reload();
        });
});
