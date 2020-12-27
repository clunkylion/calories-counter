const compose = (...functions) => (data) =>
  functions.reduceRight((value, func) => func(value), data);

const attrsToString = (obj = {}) =>
  Object.keys(obj)
    .map((key) => `${key}="${obj[key]}"`)
    .join("");

const tagAtrrs = ({ tag, attrs }) => (content = "") =>
  `<${tag} ${attrs && attrsToString(attrs)}>${content}</${tag}>`;

/*const tag = (t) => {
  if (typeof t === "string") {
    return tagAtrrs({ tag: t });
  } else {
    return tagAtrrs(t);
  }
};*/
const tag = (t) => (typeof t === "string" ? tagAtrrs({ tag: t }) : tagAtrrs(t));

const tableRowTag = tag("tr");
// const tableRow = (items) => tableRowTag(tableCells(items));
const tableRow = (items) => compose(tableRowTag, tableCells)(items);

const tableCell = tag("td");
const tableCells = (items) => items.map(tableCell).join("");

const trashIcon = tag({ tag: "i", attrs: { class: "fas fa-trash-alt" } })("");

let description = document.getElementById("description");
let calories = document.getElementById("calories");
let carbs = document.getElementById("carbs");
let protein = document.getElementById("protein");
let $inputs = document.querySelectorAll("input");
let $btnSubmit = document.getElementById("submit-button");

let list = [];

$inputs.forEach((input) => {
  input.addEventListener("keypress", function () {
    this.classList.remove("is-invalid");
  });
});

const validateInputs = () => {
  description.value ? "" : description.classList.add("is-invalid");
  calories.value ? "" : calories.classList.add("is-invalid");
  carbs.value ? "" : carbs.classList.add("is-invalid");
  protein.value ? "" : protein.classList.add("is-invalid");

  if (description.value && calories.value && carbs.value && protein.value) {
    add();
  }
};

const add = () => {
  const newItem = {
    description: description.value,
    calories: parseInt(calories.value),
    carbs: parseInt(carbs.value),
    protein: parseInt(protein.value),
  };

  list.push(newItem);
  cleanInputs();
  updateTotals();
  renderItems();
};

const updateTotals = () => {
  let calories = 0,
    carbs = 0,
    protein = 0;

  list.map((item) => {
    calories += item.calories;
    carbs += item.carbs;
    protein += item.protein;
  });

  document.getElementById("totalCalories").innerText = calories;
  document.getElementById("totalCarbs").innerText = carbs;
  document.getElementById("totalProtein").innerText = protein;
};

const cleanInputs = () => {
  description.value = "";
  calories.value = "";
  carbs.value = "";
  protein.value = "";
};

const removeItem = (i) => {
  list.splice(i, 1);
  updateTotals();
  renderItems();
};
const renderItems = () => {
  document.querySelector("tbody").innerHTML = "";

  list.map((item, index) => {
    const row = document.createElement("tr");
    const removeButton = tag({
      tag: "button",
      attrs: {
        class: "btn btn-outline-danger",
        onClick: `removeItem(${index})`,
      },
    })(trashIcon);
    const { description, calories, carbs, protein } = item;
    row.innerHTML = tableRow([
      description,
      calories,
      carbs,
      protein,
      removeButton,
    ]);

    document.querySelector("tbody").appendChild(row);
  });
};
$btnSubmit.addEventListener("click", validateInputs);
