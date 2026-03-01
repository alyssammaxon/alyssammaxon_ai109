const startBtn = document.getElementById("start-btn");
const status = document.getElementById("status");

startBtn.addEventListener("click", () => {
  status.textContent = "Status: Thanks for visiting Alyssa Maxon's website.";
  status.style.background = "#e9f3ff";
  status.style.borderColor = "#c4d8f4";
  status.style.color = "#1e3a66";
});
