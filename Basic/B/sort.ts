function insertionSort(inputArr: Array<Number>): Array<Number> {
  let n = inputArr.length;
  for (let i = 1; i < n; i++) {
    // Choosing the first element in our unsorted subarray
    let current = inputArr[i];
    // The last element of our sorted subarray
    let j = i - 1;
    while (j > -1 && current < inputArr[j]) {
      inputArr[j + 1] = inputArr[j];
      j--;
    }
    inputArr[j + 1] = current;
  }
  return inputArr;
}

function sortNRandomArraysofKElements(
  numberOfArrays: number,
  numberOfElements: number
): number {
  let startingTime = new Date().getTime();

  for (let i = 0; i < numberOfArrays; i++) {
    let inputArr = Array(numberOfElements)
      .fill(0)
      .map(() => Math.round(Math.random() * 100));
    //console.log('Array before', inputArr);
    insertionSort(inputArr);
    //console.log('Array after', inputArr, '\n\n\n');
  }

  let endTime = new Date().getTime();
  let difference = endTime - startingTime;
  console.log(endTime, startingTime);
  console.log(`*** Number of arrays: ${numberOfArrays} ***`);
  console.log(`*** Number of Elements per array: ${numberOfElements} ***`);
  console.log(
    `*** Execution time: ${difference} milliseconds or  ${
      difference / (60 * 1000)
    } minutes *** \n \n`
  );
  console.log(
    `***Average time per array: ${difference / numberOfArrays} milliseconds `
  );

  return difference;
}

interface ArgsForSortingRandomArrays {
  value1: number;
  value2: number;
}

const parseArguments = (args: Array<string>): ArgsForSortingRandomArrays => {
  if (args.length < 4) throw new Error("Not enough arguments");
  if (args.length > 4) throw new Error("Too many arguments");

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      value1: Number(args[2]),
      value2: Number(args[3]),
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

if (process.argv.length > 3) {
  try {
    const { value1, value2 } = parseArguments(process.argv);
    sortNRandomArraysofKElements(value1, value2);
  } catch (error: unknown) {
    let errorMessage = "Something bad happened.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    console.log(errorMessage);
  }
} else {
  const executionTime = sortNRandomArraysofKElements(Math.pow(10, 5), 11);
  console.log(
    `****** Final Answer: For 10^10 times you will need approximately ${
      executionTime * Math.pow(10, 5)
    } milliseconds or ${executionTime * Math.pow(10, 2)} seconds or ${
      (executionTime * Math.pow(10, 2)) / 60
    } minutes *******`
  );
}
