const OPERATORS = "+-/*";
let inputCtr;
let resultsCtr;

window.onload = function() {
  inputCtr = document.getElementById("input-ctr");
  resultsCtr = document.getElementById("results-ctr");
  inputCtr.value = "";
  resultsCtr.value = "";

  document.querySelectorAll('.inputs').forEach(btn => btn.addEventListener('click', appendInput));
  document.getElementById("btn-eq").addEventListener('click', processInput);
  document.getElementById("btn-clr").addEventListener('click', clearInput);
  document.getElementById("btn-del").addEventListener('click', delInputChar);
}


/**
 * Function: appendInput
 * Summary:  Button listener for all number and operator buttons
 *           in the calculator.  Checks if the value to be added
 *           will make an invalid expression, adds the contents 
 *           of the button that was clicked to the current running 
 *           expression, and updates the input container contents.
 * Used by:  All ".inputs" button listeners.
 * Inputs:   Event e.
 * Returns:  None.  Modifies input container contents.
*/
function appendInput(e)
{
  let char = e.target.textContent;

  // Don't allow >1 operators or decimals in a row, replace
  if ((isOperator(char) && isOperator(inputCtr.value.substr(-1))) ||
      (char == "." && inputCtr.value.substr(-1) == "."))
  {
    // Replace old operator with new one
    inputCtr.value = inputCtr.value.slice(0,-1);
  }

  // Don't allow >1 decimal per number
  if (char == ".")
  {
    // Search between previous decimal and end of string for operator
    let i = inputCtr.value.lastIndexOf(".");
    if (i >= 0)
    {
      let foundOperator = false;
      for (; i < inputCtr.value.length && !foundOperator; i++)
      {
        foundOperator = isOperator(inputCtr.value.charAt(i));
      }
      if (foundOperator)
        inputCtr.value += e.target.textContent;
    }
    else
      inputCtr.value += e.target.textContent;
  }
  else
    inputCtr.value += e.target.textContent;
}


/**
 * Function: processInput
 * Summary:  Validates the current expression in the input
 *           container, splits it into an array of operators and
 *           operands, and calculates the final results in PEMDAS
 *           order.  Updates result container with the final value
 *           or error message.
 * Used by:  "Equals" button listener.
 * Inputs:   Event e.
 * Returns:  None.  Modifies results container contents.
*/
function processInput(e)
{
  let exp = inputCtr.value;

  // Check expression does not begin or end with an operator
  if ((isNaN(exp.charAt(0)) && exp.charAt(0) != ".") || isNaN(exp.substr(-1)))
    resultsCtr.textContent = "Invalid Expression!";
  else
  {
    // Split on lowest priority operations first
    let arr = exp.split(/(\+|\-)/);

    // Create & reduce sub-arrays of highest priority operations
    multDivLoop: for (i = 0; i < arr.length; i++)
    {
      if (arr[i].includes('*') || arr[i].includes('/'))
      {
        arr[i] = arr[i].split(/(\*|\/)/);

        // Reduce multiplication/division sub-array down to single value
        arr[i] = arr[i].reduce((acc, curr, index) =>
        {
          if (index+1 >= arr[i].length || !isOperator(curr))
            return acc;
          if (curr == "*")
            acc *= +arr[i][index+1];
          else if (curr == "/")
            acc /= +arr[i][index+1];
    
          return acc;
          
        }, +arr[i][0]);
      }
    }

    // Continue reducing on addition/subtraction array
    let result = arr.reduce((acc, n, index) =>
    {
      if (index+1 >= arr.length || !isOperator(n))
        return acc;
      if (n == "+")
        acc += +arr[index+1];
      else if (n == "-")
        acc -= +arr[index+1];

      return acc;
      
    }, +arr[0]);

    if (result == Infinity || result == -Infinity)
      resultsCtr.textContent = "Division by 0 undefined";
    else
      resultsCtr.textContent = result % 1 == 0 ? result : result.toPrecision(6);
  } 
}


/**
 * Function: clearInput
 * Summary:  Resets the input and results containers.
 * Used by:  "clear" button listener.
 * Inputs:   Event e.
 * Returns:  None.  Modifies input & results container contents.
*/
function clearInput(e)
{
  inputCtr.value = "";
  resultsCtr.textContent = "";
}


/**
 * Function: delInputChar
 * Summary:  Removes a single character from the current
 *           expression/the input container.
 * Used by:  "del" button listener.
 * Inputs:   Event e.
 * Returns:  None.  Modifies input container contents.
*/
function delInputChar(e)
{
  inputCtr.value = inputCtr.value.slice(0,-1);
}


/**
 * Function: isOperator
 * Summary:  Checks if a given character is an operator.
 * Used by:  processInput(), appendInput().
 * Inputs:   Character to be tested.
 * Returns:  True/False.
*/
function isOperator(char)
{
  return (OPERATORS.indexOf(char) >= 0);
}