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

function appendInput(e)
{
  inputCtr.value += e.target.textContent;
}

function processInput(e)
{
  resultsCtr.textContent = inputCtr.value;
}

function clearInput(e)
{
  inputCtr.value = "";
  resultsCtr.textContent = "";
}

function delInputChar(e)
{
  inputCtr.value = inputCtr.value.slice(0,-1);
}