async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const msg = document.getElementById("msg");

    try {
        const res = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            msg.innerText = data.message || "Błąd logowania";
            msg.style.color = "red";
            return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        msg.innerText = "Zalogowano ✔";
        msg.style.color = "green";

        // małe opóźnienie żeby użytkownik widział efekt
        setTimeout(() => {
            window.location.href = "/dashboard.html";
        }, 500);

    } catch (err) {
        msg.innerText = "Błąd serwera";
        msg.style.color = "red";
    }
}

async function register() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        alert(data.message);

    } catch (err) {
        alert("Błąd serwera");
    }
}
