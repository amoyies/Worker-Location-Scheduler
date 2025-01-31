document.addEventListener("DOMContentLoaded", () => {
    loadSchedule();
});

// Add Location
function addLocation() {
    const locationName = document.getElementById("locationInput").value.trim();
    if (locationName === "") return;

    createLocation(locationName);
    saveSchedule();
    document.getElementById("locationInput").value = "";
}

// Create Location
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

// Add Worker
function addWorker() {
    const workerName = document.getElementById("workerInput").value.trim();
    if (workerName === "") return;

    createWorker(workerName);
    saveSchedule();
    document.getElementById("workerInput").value = "";
}

// Create Worker
function createWorker(name, parent = document.getElementById("workers")) {
    const workerDiv = document.createElement("div");
    workerDiv.classList.add("worker");
    workerDiv.draggable = true;
    workerDiv.innerText = name;
    workerDiv.dataset.worker = name;
    workerDiv.ondragstart = dragStart;

    parent.appendChild(workerDiv);
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

    // Save the schedule and workers separately
    localStorage.setItem("schedule", JSON.stringify(schedule));

    // Save unassigned workers
    const unassignedWorkers = [...document.getElementById("workers").children].map(worker => worker.dataset.worker);
    localStorage.setItem("workers", JSON.stringify(unassignedWorkers));
}

// Load schedule from localStorage
function loadSchedule() {
    const savedSchedule = JSON.parse(localStorage.getItem("schedule")) || [];
    const savedWorkers = JSON.parse(localStorage.getItem("workers")) || [];

    document.getElementById("locations").innerHTML = "";
    document.getElementById("workers").innerHTML = "";

    // Load locations and assigned workers
    savedSchedule.forEach(({ location, workers }) => {
        createLocation(location);

        workers.forEach(worker => {
            createWorker(worker, document.querySelector(`[data-location='${location}'] .dropzone`));
        });
    });

    // Load unassigned workers
    savedWorkers.forEach(worker => {
        createWorker(worker);
    });
}

// Reset schedule
function resetSchedule() {
    if (confirm("Are you sure you want to reset the schedule?")) {
        localStorage.removeItem("schedule");
        localStorage.removeItem("workers");
        document.getElementById("locations").innerHTML = "";
        document.getElementById("workers").innerHTML = "";
    }
}
