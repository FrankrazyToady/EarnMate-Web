let coins = localStorage.getItem("coins");

if (coins === null) {
  coins = 0;
} else {
  coins = parseInt(coins);
}

updateUI();

function addCoins() {
  coins += 5;
  saveCoins();
}

function completeSurvey(amount) {
  coins += amount;
  saveCoins();
  document.getElementById("status") &&
    (document.getElementById("status").innerText =
      "You earned " + amount + " coins!");
}

function withdrawCoins() {
  if (coins > 0) {
    alert("You withdrew " + coins + " coins!");
    coins = 0;
    saveCoins();
  } else {
    alert("No coins to withdraw!");
  }
}

function saveCoins() {
  firebase.database().ref("users/" + userId).set({
    coins: coins
  });
}

function updateUI() {
  let coinElements = document.querySelectorAll("#coins");
  coinElements.forEach(el => el.innerText = coins + " Coins");

  let wallet = document.getElementById("walletCoins");
  if (wallet) wallet.innerText = coins;
}

function updateUI() {
  let coinElements = document.querySelectorAll("#coins");
  coinElements.forEach(el => el.innerText = coins);
  
  let wallet = document.getElementById("walletCoins");
  if (wallet) wallet.innerText = coins;
}

let userId = localStorage.getItem("userId");

if (!userId) {
  userId = "user_" + Math.floor(Math.random() * 1000000);
  localStorage.setItem("userId", userId);
}

firebase.database().ref("users/" + userId).on("value", (snapshot) => {
  if (snapshot.exists()) {
    coins = snapshot.val().coins || 0;
    updateUI();
  }
});

document.addEventListener("DOMContentLoaded", function () {
  let frame = document.getElementById("surveyFrame");
  if (frame) {
    frame.src = "https://offers.cpx-research.com/index.php?app_id=32235&ext_user_id=" + userId;
  }
});