async function signup() {
    const name = document.getElementById("name")?.value;
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;

    if (!name || !email || !password) {
        alert("All fields are required!");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        alert(data.message);

        if (data.message === "User registered successfully") {
            window.location.href = "login.html";
        }

    } catch (error) {
        alert("Server error. Please try again.");
        console.error(error);
    }
}
