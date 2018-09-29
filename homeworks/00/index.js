
/*
## Functions and iteration
To implement:

* isEven(value)
* apply isEven on [1, 2, 3, 4, 5]
* filter [1, 2, 3, 4, 5] by isEven

*/
const isEven = v => v % 2 === 0;
const input = [1, 2, 3, 4, 5];
const ex01 = input.map(isEven);
const ex02 = input.filter(isEven);


/*
### multiply
To implement:
* multiply, a function that accepts arbitrary number of parameters
* find a product of the following numbers: 1,2,3,4,5
* multiply(1,2,3,4,5) should return 120
*/
const multiply = (...args) => args.reduce((old, curr) => old * curr, 1);
console.log(multiply(1, 2, 3, 4, 5));

/*
## Closures

### divisibleBy
To implement:
* divisibleBy
* filter [0, 1, 2, 3, 4, 5, 6] by divisibleBy(3)
*/
const divisibleBy = divisor => (value => value % divisor === 0);
console.log([0, 1, 2, 3, 4, 5, 6].filter(divisibleBy(3)));

/*
### increment
To implement:
* increment
* initial value is 100, step size is 2
*/
const increment = function(init) {
    let value = init || 0;
    return (step) => () => value += step;
};

/*
### colorCycle
To implement:
colorCycle(colors=COLOR_CYCLE_DEFAULT)
*/
const COLOR_CYCLE_DEFAULT = ['red', 'green', 'magenta', 'blue'];
const colorCycle = function(values) {
    const cycle = values || COLOR_CYCLE_DEFAULT;
    let index = 0;
    return () => cycle[++ index % cycle.length];
};


const cc_r_g = colorCycle(['red', 'green']);
// This is a way to run 10 times, see the task about `range` below.
console.log('cycle red/green', Array.from(Array(10), cc_r_g));

const cc1 = colorCycle();
const cc2 = colorCycle();
console.log('cycle default', [cc1(), cc1(), cc2(), cc2(), cc1()]);

const my_cc = colorCycle(['purple', 'rgb(20, 230, 220)', 'rgb(10, 230, 20)', 'rgb(230, 20, 10)']);
showColorCycle(my_cc);

/*
## Range

To implement:
* range
* filter range(100) by divisibility by 13
*/
const range = n => Array.from(Array(n), (u, i) => i);

console.log('range(100) divisible by 13', range(100).filter(divisibleBy(13)));
console.log('range(10)', range(10));
// Expeceted result:
// [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]



/*
To implement:
* Implement a function `randomInRange(min_val=0, max_val=100)` which returns a random float value between `min_val` and `max_val`.

* Implement a function `randomArray(N, min_val=0, max_val=100)` which generates an array of `N` random values between `min_val` and `max_val`.

*/
const randomInRange = (min, max) => (min || 0) + Math.random() * ((max || 100) - (min || 0));
const randomArray = (n, min, max) => Array.from(Array(n), (u, i) => randomInRange(min, max));
console.log('randomArray', randomArray(5, 0, 10));

/*
## Counting

* Create a function `countOccurrences(string)` which counts the number of occurrences of each letter in a string.
	For example `countOccurrences("hello")` yields `{'h': 1, 'e': 1, 'l': 2, 'o': 1 }`.
*/
const countOccurrences = source =>
    Array.from(source).reduce((prev, curr) => {
        if (typeof prev[curr] === "undefined")
            prev[curr] = 0;
        prev[curr] ++;
        return prev;
    }, {});

console.log(countOccurrences('hello'));
// Expected result:
// countOccurrences("hello") ---> {'h': 1, 'e': 1, 'l': 2, 'o': 1 }

/*
* Create the function `normalizeCounts` which takes the character counts outputted by `countOccurrences`,
	and calculates normalized counts - that is divided by the total sum.
	Please calculate the sum using [`reduce`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce).
	For example:
	`normalizeCounts({'h': 1, 'e': 1, 'l': 2, 'o': 1})` yields `{'h': 0.2, 'e': 0.2, 'l': 0.4, 'o': 0.2}`

* Create `countOccurencesNormalized` - a function which given a string, first applies `countOccurrences` and then normalizes the counts using `normalizeCounts`.

* Visualize the results by calling `setCharacterCountingFunction(countOccurencesNormalized);` - look at `index.html`, now you should be able to count the distribution
of characters in any text you input. You can pass a `colorCycle` with your colors as the second argument to color the bars.
*/
const normalizeCounts = counts => {
    const keys = Object.keys(counts);
    const letterCounts = keys.reduce((prev, curr) => prev + counts[curr], 0);
    keys.forEach(key => counts[key] = counts[key] / letterCounts);
    return counts;
};

const countOccurencesNormalized = source => normalizeCounts(countOccurrences(source));
console.log(normalizeCounts(countOccurrences('hello')));
// Expected result:
// normalizeCounts({'h': 1, 'e': 1, 'l': 2, 'o': 1 }) ---> {'h': 0.2, 'e': 0.2, 'l': 0.4, 'o': 0.2 }

setCharacterCountingFunction(countOccurencesNormalized, colorCycle(['blue', 'orange']));

/*
## Throwing balls

We will simulate a ball thrown at angle $b$ with velocity $v_0$. The initial velocity $(v_x, v_y)$ is:

$$v_x = v_0 cos(b)$$
$$v_y = v_0 sin(b)$$

The position of the ball at time $t$ is given by:

$$x(t) = v_x * t$$
$$y(t) = v_y * t + (a * t^2 * 0.5)$$

where $a$ is the acceleration caused by gravity, usually -9.81 $m/s^2$.

Implement a function `simulateBall(v0, angle, num_steps, dt, g)` such that:

* `v0` is the magnitude of the initial velocity
* 'angle' is the inclination angle in degrees, multiply by `DEG_TO_RAD = Math.PI / 180.` to get radians for the trigonometric functions,
* `num_steps` is the number of steps of the simulation, the default value should be 256,
* `dt` is the time that advances between steps, default value 0.05,
* `g` is the acceleration, default value -9.81,
* it returns an array of ball positions at each time step,
* each position is given as a array `[x, y]`,

Use the `range` function to create the array of time points, then `map` them to the `[x, y]` values given by the equations above.
* We want to finish the plot when the ball hits the ground (y=0), so please filter the point array to remove points with y below 0.
* Visualize the ball trajectories using `plotBall` (the 2nd optional argument is the line color):
* Use `randomArray` to create 20 random angles between 0 deg and 90 deg, then plot the ball trajectories for each angle.
*/

const DEG_TO_RAD = Math.PI / 180.;
const SIM_DEFAULT_NUM_STEPS = 256;
const SIM_DT = 0.05;
const SIM_G = - 9.81;

const simulateBall = (v0, angle, numSteps, dt, g) => {
    const G = g || SIM_G;
    const DT = dt || SIM_DT;
    const NUM_STEPS = numSteps || SIM_DEFAULT_NUM_STEPS;

    let acc = {x: 0, y: G};
    let vel = {x: v0 * Math.cos(angle * DEG_TO_RAD), y: v0 * Math.sin(angle * DEG_TO_RAD)};
    let pos = {x: 0, y: 0};

    return range(NUM_STEPS).map(() => {
        vel.x += acc.x * DT;
        vel.y += acc.y * DT;
        pos.x += vel.x * DT;
        pos.y += vel.y * DT;
        return [pos.x, pos.y];
    });
};

const ball_cc = colorCycle(['hsl(160, 100%, 64%)', 'hsl(200, 100%, 64%)', 'hsl(240, 100%, 64%)', 'hsl(120, 100%, 64%)', 'hsl(80, 100%, 64%)']);
randomArray(20, 0, 90).forEach(angle => plotBall(simulateBall(40, angle), ball_cc()));
