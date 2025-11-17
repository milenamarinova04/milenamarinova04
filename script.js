// Aktiviert den Strict Mode für sicheres JavaScript
"use strict";

// Event-Listener für beide Buttons
window.onload = function() {
  document.getElementById("rechnen").onclick = () => rechnen();
  document.getElementById("einfachBtn").onclick = () => einfacheBerechnung();
};

// Funktion zum Setzen der Hintergrundfarbe basierend auf dem Ergebnis
//Diese Funktion habe ich nicht selber geschriben, ich habe sie von ChatGPT generiert (war schwierig für mich, selber das zu machen)
function setBackgroundColor(result) {
  const hue = (result * 137.5) % 360; 
  document.body.style.backgroundColor = `hsl(${hue}, 70%, 95%)`;
}

// Funktion für spezielle Nachrichten
function getSpecialMessage(result) {
  const messages = {
    13: "Unlucky number! 🍀",
    42: "The Answer to Life, the Universe, and Everything! 🌌",
    69: "Nice! 😏",
    420: "Blaze it! 🌿",
    666: "Number of the Beast! 😈",
    777: "Lucky number! 🍀",
    1000: "Millennium! 🎉",
    1337: "Leet! 💻"
  };
  return messages[result] || null;
}

// Asynchrone Hauptfunktion mit Callback und Error Handling
async function rechnen() {
  const z1 = document.getElementById("zahl1").value;
  const z2 = document.getElementById("zahl2").value;
  const ausgabe = document.getElementById("ausgabe");

  try {
    // Validierung der Eingaben
    if (z1 === "" || z2 === "") {
      throw new Error("Bitte beide Zahlen eingeben.");
    }

    const num1 = Number(z1);
    const num2 = Number(z2);

    if (isNaN(num1) || isNaN(num2)) {
      throw new Error("Bitte gültige Zahlen eingeben.");
    }

    if (num2 === 0) {
      throw new Error("Division durch 0 nicht erlaubt.");
    }

    await delayedCalculation(num1 + num2);

    await new Promise(resolve => {
      addiere(num1, num2, (ergebnis) => {
        zeigeErgebnis(ergebnis);
        addToHistory(`${num1} + ${num2} = ${ergebnis}`);
        resolve();
      });
    });

  } catch (err) {
    ausgabe.innerText = "❌ Fehler: " + err.message;
    ausgabe.className = "error";
  } finally {
    document.getElementById("zahl1").value = "";
    document.getElementById("zahl2").value = "";
  }
}

// Asynchrone Callback-Funktion 
async function zeigeErgebnis(wert) {
  const ausgabe = document.getElementById("ausgabe");
  const specialMessage = getSpecialMessage(wert);
  
  // Setze Hintergrundfarbe
  setBackgroundColor(wert);
  
  // Zeige Ergebnis mit Animation
  ausgabe.className = specialMessage ? "special" : "success";
  ausgabe.innerText = specialMessage || "✅ Ergebnis: " + wert;
}

function addiere(a, b, callback) {
  const ergebnis = Number(a) + Number(b);
  callback(ergebnis);
}

async function delayedCalculation(wert) {
  try {
    const ausgabe = document.getElementById("ausgabe");
    let dots = 0;
    
    const animation = setInterval(() => {
      dots = (dots + 1) % 4;
      ausgabe.innerText = "🤔 Thinking" + ".".repeat(dots);
    }, 500);

    const ergebnis = await new Promise((resolve) => {
      setTimeout(() => {
        clearInterval(animation); 
        resolve(wert);
      }, 2000);
    });

    ausgabe.className = "success";
    ausgabe.innerText = "⏳ Berechnet: " + ergebnis;

  } catch (err) {
    const ausgabe = document.getElementById("ausgabe");
    ausgabe.className = "error";
    ausgabe.innerText = "❌ Fehler bei der Berechnung";
  }
}

// Asynchrone Funktion für alle Grundrechenarten
async function einfacheBerechnung() {
  const z1 = document.getElementById("zahl1").value;
  const z2 = document.getElementById("zahl2").value;
  const op = document.getElementById("operation").value;
  const ausgabe = document.getElementById("ausgabe");

  try {
    if (z1 === "" || z2 === "") {
      throw new Error("Bitte beide Zahlen eingeben.");
    }

    const num1 = Number(z1);
    const num2 = Number(z2);

    if (isNaN(num1) || isNaN(num2)) {
      throw new Error("Bitte gültige Zahlen eingeben.");
    }

    let result;
    switch (op) {
      case "➕": result = num1 + num2; break;
      case "➖": result = num1 - num2; break;
      case "✖️": result = num1 * num2; break;
      case "➗":
        if (num2 === 0) throw new Error("Division durch 0 nicht erlaubt.");
        result = num1 / num2;
        break;
      default:
        throw new Error("Ungültige Operation");
    }

    //  Hintergrundfarbe
    setBackgroundColor(result);
    
    // Zeige Ergebnis mit Animation
    const specialMessage = getSpecialMessage(result);
    ausgabe.className = specialMessage ? "special" : "success";
    ausgabe.innerText = specialMessage || "✅ Ergebnis: " + result;
    
    addToHistory(`${num1} ${op} ${num2} = ${result}`);

  } catch (err) {
    // Zeige Fehler nachricht
    ausgabe.innerText = "❌ " + err.message;
    ausgabe.className = "error";
  } 
   {
    // Lösche Eingaben
    document.getElementById("zahl1").value = "";
    document.getElementById("zahl2").value = "";
  }
}

// History-Funktion
function addToHistory(entry) {
  let history = document.getElementById("history");
  if (!history) {
    history = document.createElement("ul");
    history.id = "history";
    document.querySelector(".container").appendChild(history);
  }

  const item = document.createElement("li");
  item.innerText = entry;
  history.appendChild(item);

  if (history.children.length > 5) {
    history.removeChild(history.children[0]);
  }
}
