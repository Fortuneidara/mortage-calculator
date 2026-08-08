const form = document.getElementById("mortgageForm");
const clearBtn = document.getElementById("clearBtn");

const amountInput = document.getElementById("amount");
const termInput = document.getElementById("term");
const rateInput = document.getElementById("rate");

const mortgageTypes = document.querySelectorAll('input[name="mortgageType"]');

const emptyState = document.getElementById("emptyState");
const resultCard = document.getElementById("resultCard");

const monthlyPayment = document.getElementById("monthlyPayment");
const totalPayment = document.getElementById("totalPayment");

mortgageTypes.forEach((radio) => {
  radio.addEventListener("change", () => {
    document.querySelectorAll(".radio-option").forEach((option) => {
      option.classList.remove("selected");
    });

    radio.closest(".radio-option").classList.add("selected");
  });
});

function showError(input, message) {
  const formGroup = input.closest(".form-group");

  const wrapper = formGroup.querySelector(".input-wrapper");

  const error = formGroup.querySelector(".error");

  if (wrapper) {
    wrapper.classList.add("error-border");
  }

  if (error) {
    error.textContent = message;
    error.style.display = "block";
  }
}

function clearError(input) {
  const formGroup = input.closest(".form-group");

  const wrapper = formGroup.querySelector(".input-wrapper");

  const error = formGroup.querySelector(".error");

  if (wrapper) {
    wrapper.classList.remove("error-border");
  }

  if (error) {
    error.textContent = "";
    error.style.display = "none";
  }
}

function validateForm() {
  let valid = true;

  clearError(amountInput);
  clearError(termInput);
  clearError(rateInput);

  if (amountInput.value.trim() === "") {
    showError(amountInput, "This field is required");

    valid = false;
  }

  if (termInput.value.trim() === "") {
    showError(termInput, "This field is required");

    valid = false;
  }

  if (rateInput.value.trim() === "") {
    showError(rateInput, "This field is required");

    valid = false;
  }

  const mortgageSelected = document.querySelector(
    'input[name="mortgageType"]:checked'
  );

  const mortgageError = document
    .querySelector(".radio-group")
    .parentElement.querySelector(".error");

  if (!mortgageSelected) {
    mortgageError.textContent = "Select a mortgage type";

    mortgageError.style.display = "block";

    valid = false;
  } else {
    mortgageError.textContent = "";

    mortgageError.style.display = "none";
  }

  return valid;
}

clearBtn.addEventListener("click", () => {
  form.reset();

  clearError(amountInput);
  clearError(termInput);
  clearError(rateInput);

  document.querySelectorAll(".radio-option").forEach((option) => {
    option.classList.remove("selected");
  });

  document.querySelectorAll(".error").forEach((error) => {
    error.textContent = "";

    error.style.display = "none";
  });

  emptyState.classList.remove("hidden");

  resultCard.classList.add("hidden");
});
function formatCurrency(value) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",

    currency: "GBP",

    minimumFractionDigits: 2,

    maximumFractionDigits: 2,
  }).format(value);
}
form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  const principal = parseFloat(amountInput.value);
  const years = parseFloat(termInput.value);
  const annualRate = parseFloat(rateInput.value);

  const mortgageType = document.querySelector(
    'input[name="mortgageType"]:checked'
  ).value;

  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = years * 12;

  let monthly = 0;
  let total = 0;

  if (mortgageType === "repayment") {
    monthly =
      (principal *
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    total = monthly * numberOfPayments;
  } else {
    monthly = principal * monthlyRate;

    total = monthly * numberOfPayments;
  }

  monthlyPayment.textContent = formatCurrency(monthly);

  totalPayment.textContent = formatCurrency(total);

  emptyState.classList.add("hidden");

  resultCard.classList.remove("hidden");
});

[amountInput, termInput, rateInput].forEach((input) => {
  input.addEventListener("input", () => {
    if (input.value.trim() !== "") {
      clearError(input);
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    if (document.activeElement.tagName === "INPUT") {
      form.requestSubmit();
    }
  }
});

[amountInput, termInput, rateInput].forEach((input) => {
  input.addEventListener("input", () => {
    if (parseFloat(input.value) < 0) {
      input.value = "";
    }
  });
});

rateInput.addEventListener("input", () => {
  if (parseFloat(rateInput.value) > 100) {
    rateInput.value = 100;
  }
});

termInput.addEventListener("input", () => {
  if (parseFloat(termInput.value) > 50) {
    termInput.value = 50;
  }
});

amountInput.addEventListener("input", () => {
  if (parseFloat(amountInput.value) > 100000000) {
    amountInput.value = 100000000;
  }
});
