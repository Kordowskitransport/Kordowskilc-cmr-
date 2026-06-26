async function addDriver(){

    const data = {
        name:
            document.getElementById("name").value,
        email:
            document.getElementById("email").value,
        phone:
            document.getElementById("phone").value,
        truck:
            document.getElementById("truck").value
    };

    await fetch("/api/drivers",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
    });

    loadDrivers();
}

async function loadDrivers(){

    const res =
        await fetch("/api/drivers");

    const data =
        await res.json();

    let html = "";

    data.forEach(d=>{

        html += `
        <tr>
            <td>${d.name}</td>
            <td>${d.email}</td>
            <td>${d.phone}</td>
            <td>${d.truck}</td>
        </tr>
        `;
    });

    document.getElementById(
        "drivers"
    ).innerHTML = html;
}

loadDrivers();
