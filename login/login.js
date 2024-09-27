const form = document.getElementById("loginform");
const usernameInput = document.getElementById("user_login");
const passwordInput = document.getElementById("user_pass");

const usernamePattern = /^[a-zA-Z0-9]{5,}$/;
const passwordPattern = /^([0-9]|\_)[a-z]{3}$/;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let isValid = true;

  if (!usernamePattern.test(usernameInput.value)) {
    usernameInput.style.border = "2px solid red";
    isValid = false;
  } else {
    usernameInput.style.border = "1px solid #dcdcdc";
  }

  if (!passwordPattern.test(passwordInput.value)) {
    passwordInput.style.border = "2px solid red";
    isValid = false;
  } else {
    passwordInput.style.border = "1px solid #dcdcdc";
  }

  if (isValid) {
    window.location.href = "../index.html";
  }
});
