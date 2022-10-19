function primesUpTo(limit) {
	if (typeof limit !== "number" || isNaN(limit)) return "Not a Number, bro";
	else {
		//initialize scope of output variables
		let primesList = [1];
		let factorLists = {};
		let populatedUpTo = 3;
		let largestDistance = 0;
		let largestDistancePrime = [];

		//ignore 1, start at 2 and repeat for each number up to limit
		for (let currN = 2; currN <= limit; currN++) {
			//initialize scope of calc variables
			let multipleFound = null;
			//for each number, try to divide it by all previous primes except the first, which is 1
			for (let dividerIndex = 1; dividerIndex <= primesList.length - 1; dividerIndex++) {
				//only go through array to get number once
				let divider = primesList[dividerIndex];
				// console.log(currN, "%", divider)
				//stop if found a divisible number, take note of what it was
				if (currN % divider === 0) {
					multipleFound = divider;
					break;
				}
			}

			//Depending on what was last divisible number, treat it:
			//If couldnt divide by anything, it is prime! (we didnt try to divide it by itself, thats redundant)
			//////add it to the list of primes
			//////We are gonna take note of all numbers each prime was found as the first divisible of.
			//////////But two would just be a huge array of all even numbers, so skip those.
			//////////Create the new array for the new found prime!
			//////largest distance between primes:
			//////////distance from this new found prime to the last
			//////////If it is bigger than the current largest distance, set largest,
			////////////and take note of what number it is in a fresh array
			//////////If distance is equal to the current largest distance,
			////////////add the number to the list of numbers that have that exact distance.
			//If it is 2, it is even, ignore it.
			//Else, it found another divisible prime before it got up to the current number
			//////Add the current number to the list of numbers that find a divisible prime to the prime's list
			//////Keep track of the largest prime we already found as divisible to another number,
			////////so we can clean all empty arrays later
			////////Also, we won't just delete all empty arrays because it would be nice to find a situation where
			////////////a higher prime was divisible before another prime that's smaller. So we want to see if we
			//////////// find an empty array in between populated arrays.

			//Handle Prime
			if (multipleFound === null) {
				// console.log(currN, "is prime!");
				primesList.push(currN);
				//initialize factors list for this prime, except for 2 (even numbers)
				if (currN !== 2) {
					let factorOfArrayName = "firstFactorsOf" + currN;
					factorLists[factorOfArrayName] = [];
				}
				//taking note of largest distances between primes
				let distanceToLast = currN - primesList[primesList.length - 2];
				if (distanceToLast > largestDistance) {
					largestDistance = distanceToLast;
					largestDistancePrime = [currN];
				} else if (distanceToLast === largestDistance) {
					largestDistancePrime.push(currN);
				}
			} else if (multipleFound === 2) {
				// Handle evens
				// console.log(currN,"is even...");
			} else {
				//handle found first divisor, add it to that prime divisor's list and keep track of highest divisor found
				// console.log(currN, "first divisible prime is", multipleFound);
				let factorOfArrayName = "firstFactorsOf" + multipleFound;
				factorLists[factorOfArrayName].push(currN);
				//highest populated list take note:
				if (multipleFound > populatedUpTo) populatedUpTo = multipleFound;
			}
		}

		//clean empty factors lists after last populated list
        let processFactorLists = []
        let cleanFactorLists = {}
		for (list in factorLists) {
			if (list.replace("firstFactorsOf", "") > populatedUpTo) {
                delete factorLists[list];
            } 
            else {
                processFactorLists.unshift([list, factorLists[list]]);
            }
		}
        for(index in processFactorLists) {
            cleanFactorLists[processFactorLists[index][0]] = processFactorLists[index][1]
        }
        
        //output
		let percentOfPrimes = primesList.length / limit;
		let biggestPrime = primesList[primesList.length - 1];
		let lastPrimeWithMultiple = populatedUpTo;
        let numberOfPrimes = primesList.length
		return { primesList, numberOfPrimes, percentOfPrimes, biggestPrime, largestDistance, largestDistancePrime, lastPrimeWithMultiple, ...cleanFactorLists};
	}
}
const htmlInput = document.getElementById("input");
const htmlResult = document.getElementById("result");
let numberInput = Number(htmlInput.value);
let result = primesUpTo(numberInput);
// htmlResult.innerHTML = result.primesList.join(", ");
// console.log(result["factorLists"])

displayResult(result);
function displayResult(result) {
	// htmlResult.innerHTML = result;
	// console.log(typeof result, result);
	let displayInfo = [];
	if (typeof result === "string") htmlResult.innerHTML = result;
	else {
		for (key in result) {
            displayInfo.push(
                `<div style="overflow-y: auto; max-height: 5em; margin: 0.2em; display: flex"> <div class="resultTitle" style="width: 10em; margin-right:10px; display:flex; align-items: center; justify-content: right">` 
                + key 
                + `:</div> <div class="resultResult" style="width: calc(100% - 10em)">` 
                + ((Array.isArray(result[key])) ? result[key].join(", ") : result[key])
                + `</div> </div>`
            );
		}
		htmlResult.innerHTML = displayInfo.join("<hr>");
		// htmlResult.innerHTML = `<p style="overflow-y: auto; max-height: 4em">`+result.primesList.join(", ")+`</p>`;
	}
}

htmlInput.addEventListener("input", () => {
    numberInput = Number(htmlInput.value);
	result = primesUpTo(numberInput);
	displayResult(result);
});