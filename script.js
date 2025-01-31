document.addEventListener("DOMContentLoaded", () => {
    loadSchedule();
});

function addLocation() {
    const locationName = document.getElementById("locationInput").value.trim();
    if (locationName === "") return;

    createLocation(locationName);
    saveSchedule();
    document.getElementById("locationInput").value = "";
}

function createLocation(name) {
    const locationsDiv = document.getElementById("locations");
    
    const locationDiv = document.createElement("div");
    locationDiv.classList.add("location");
    locationDiv.dataset.location = name;

    locationDiv.innerHTML = `
        <h3>${name}</h3>
        <div class="dropzone" ondragover="allowDrop(event)" ondrop="drop(event)"></div>
    `;

    locationsDiv.appendChild(locationDiv);
}

function addWorker() {
    const workerName = document.getElementById("workerInput").value.trim();
    if (workerName === "") return;

    createWorker(workerName);
    saveSchedule();
    document.getElementById("workerInput").value = "";
}

function createWorker(name) {
    const workersDiv = document.getElementById("workers");

    const workerDiv = document.createElement("div");
    workerDiv.classList.add("worker");
    workerDiv.draggable = true;
    workerDiv.innerText = name;
    workerDiv.dataset.worker = name;
    workerDiv.ondragstart = dragStart;

    workersDiv.appendChild(workerDiv);
}

// Drag & Drop Functions
function dragStart(event) {
    event.dataTransfer.setData("text", event.target.dataset.worker);
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const workerName = event.dataTransfer.getData("text");
    
    const workerElement = document.querySelector(`[data-worker='${workerName}']`);
    if (workerElement) {
        event.target.appendChild(workerElement);
    }

    saveSchedule();
}

// Save schedule to localStorage
function saveSchedule() {
    const locations = document.querySelectorAll(".location");
    const schedule = [];

    locations.forEach(location => {
        const locationName = location.dataset.location;
        const assignedWorkers = [...location.querySelector(".dropzone").children].map(worker => worker.dataset.worker);

        schedule.push({ location: locationName, workers: assignedWorkers });
    });

    localStorage.setItem("schedule", JSON.stringify(schedule));
}

// Load schedule from localStorage
function loadSchedule() {
    const savedSchedule = JSON.parse(localStorage.getItem("schedule")) || [];

    savedSchedule.forEach(({ location, workers }) => {
        createLocation(location);

        workers.forEach(worker => {
            createWorker(worker);
            document.querySelector(`[data-worker='${worker}']`).remove(); // Remove from main worker list
            document.querySelector(`[data-location='${location}'] .dropzone`).appendChild(
                document.querySelector(`[data-worker='${worker}']`)
            );
        });
    });
}

// Reset schedule
function resetSchedule() {
    if (confirm("Are you sure you want to reset the schedule?")) {
        localStorage.removeItem("schedule");
        document.getElementById("locations").innerHTML = "";
        document.getElementById("workers").innerHTML = "";
    }
}
