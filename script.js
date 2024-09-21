let services = JSON.parse(localStorage.getItem('services')) || [
    { name: "Cleaning", price: 100 },
    { name: "Check-up", price: 75 },
    { name: "Filling", price: 200 }
];

let clients = JSON.parse(localStorage.getItem('clients')) || [];
let appointments = JSON.parse(localStorage.getItem('appointments')) || [];

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAEUz4iKEBHoDY9gsuDzRAkgVwCGlfE9JE",
  authDomain: "dentalapp-ca6d1.firebaseapp.com",
  projectId: "dentalapp-ca6d1",
  storageBucket: "dentalapp-ca6d1.appspot.com",
  messagingSenderId: "368760992270",
  appId: "1:368760992270:web:6dfccce74dc6c6a841c25f",
  measurementId: "G-KS49SMW8Y1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Show selected section
function showSection(sectionId) {
    document.getElementById('appointments').style.display = 'none';
    document.getElementById('clients').style.display = 'none';
    document.getElementById('services').style.display = 'none';
    document.getElementById(sectionId).style.display = 'block';

    if (sectionId === 'clients') {
        updateServiceDropdown();
        updateClientsList();
    } else if (sectionId === 'appointments') {
        populateClientDropdown();
        populateServiceDropdown();
        updateAppointmentsList();
    } else if (sectionId === 'services') {
        updateServicesList();
    }
}

// Populate client dropdown for appointments
function populateClientDropdown() {
    const dropdown = document.getElementById('appointmentClient');
    dropdown.innerHTML = '';
    clients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.name;
        option.textContent = client.name;
        dropdown.appendChild(option);
    });
}

// Populate service dropdown for appointments
function populateServiceDropdown() {
    const dropdown = document.getElementById('appointmentService');
    dropdown.innerHTML = '';
    services.forEach(service => {
        const option = document.createElement('option');
        option.value = service.name;
        option.textContent = service.name;
        dropdown.appendChild(option);
    });
}

// Update service dropdown in clients
function updateServiceDropdown() {
    const dropdown = document.getElementById('clientService');
    dropdown.innerHTML = '<option value="">Select a service</option>';
    services.forEach(service => {
        const option = document.createElement('option');
        option.value = service.name;
        option.textContent = service.name;
        dropdown.appendChild(option);
    });
}

// Update services list
function updateServicesList() {
    const servicesList = document.getElementById('servicesList');
    servicesList.innerHTML = '';
    services.forEach(service => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card';
        serviceCard.innerHTML = `
            <h3>${service.name}</h3>
            <p>Price: $${service.price}</p>
            <button onclick="deleteService('${service.name}')">Delete</button>
        `;
        servicesList.appendChild(serviceCard);
    });
}

// Add a new client
function addClient() {
    const name = document.getElementById('clientName').value;
    const age = document.getElementById('clientAge').value;
    const service = document.getElementById('clientService').value;

    if (name && age && service) {
        clients.push({ name, age: Number(age), service });
        updateClientsList();
        saveData();  // Save to localStorage
        clearClientFields();
    } else {
        alert('Please fill in all client details.');
    }
}

// Clear client input fields
function clearClientFields() {
    document.getElementById('clientName').value = '';
    document.getElementById('clientAge').value = '';
    document.getElementById('clientService').value = '';
}

// Update the displayed list of clients
function updateClientsList() {
    const clientsList = document.querySelector('.client-list');
    clientsList.innerHTML = '';

    // Show only the first 5 clients
    const clientsToShow = clients.slice(0, 5);
    clientsToShow.forEach(client => {
        const clientCard = document.createElement('div');
        clientCard.className = 'client-card';
        clientCard.innerHTML = `
            <h3>${client.name}</h3>
            <p>Age: ${client.age}</p>
            <p>Preferred Service: ${client.service}</p>
            <button onclick="deleteClient('${client.name}')">Delete</button>
        `;
        clientsList.appendChild(clientCard);
    });

    if (clients.length > 5) {
        const showAllButton = document.createElement('button');
        showAllButton.textContent = 'Show All';
        showAllButton.onclick = toggleShowAllClients;
        clientsList.appendChild(showAllButton);
    }
}

// Toggle display of all clients
let showingAllClients = false;
function toggleShowAllClients() {
    showingAllClients = !showingAllClients;
    const clientsList = document.querySelector('.client-list');
    clientsList.innerHTML = '';

    if (showingAllClients) {
        clients.forEach(client => {
            const clientCard = document.createElement('div');
            clientCard.className = 'client-card';
            clientCard.innerHTML = `
                <h3>${client.name}</h3>
                <p>Age: ${client.age}</p>
                <p>Preferred Service: ${client.service}</p>
                <button onclick="deleteClient('${client.name}')">Delete</button>
            `;
            clientsList.appendChild(clientCard);
        });
    } else {
        updateClientsList();
    }
}

// Delete a client
function deleteClient(clientName) {
    clients = clients.filter(client => client.name !== clientName);
    saveData();  // Save to localStorage
    updateClientsList();
}

// Add a new appointment
function addAppointment() {
    const date = document.getElementById('appointmentDate').value;
    const clientName = document.getElementById('appointmentClient').value;
    const serviceName = document.getElementById('appointmentService').value;

    if (date && clientName && serviceName) {
        const service = services.find(s => s.name === serviceName);

        // Format the date into a string
        const formattedDate = new Date(date).toLocaleString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit'
        });

        // Save the formatted date instead of the Date object
        appointments.push({ date: formattedDate, clientName, serviceName, price: service.price });
        appointments.sort((a, b) => new Date(a.date) - new Date(b.date));
        updateAppointmentsList();
        saveData();  // Save to localStorage
        clearAppointmentFields();
    } else {
        alert('Please fill in all appointment details.');
    }
}

// Clear appointment input fields
function clearAppointmentFields() {
    document.getElementById('appointmentDate').value = '';
    document.getElementById('appointmentClient').value = '';
    document.getElementById('appointmentService').value = '';
}

// Update the displayed list of appointments
function updateAppointmentsList() {
    const appointmentsList = document.querySelector('.appointment-list');
    appointmentsList.innerHTML = '';

    appointments.forEach(appointment => {
        const appointmentCard = document.createElement('div');
        appointmentCard.className = 'appointment-card';

        appointmentCard.innerHTML = `
            <h3>${appointment.clientName}</h3>
            <p>Service: ${appointment.serviceName}</p>
            <p>Price: $${appointment.price}</p>
            <p>Time: ${appointment.date}</p>  <!-- Using the formatted date directly -->
            <button onclick="deleteAppointment('${appointment.clientName}', '${appointment.date}')">Delete</button>
        `;
        appointmentsList.appendChild(appointmentCard);
    });
}

// Delete an appointment
function deleteAppointment(clientName, appointmentDate) {
    appointments = appointments.filter(appointment => 
        !(appointment.clientName === clientName && appointment.date === appointmentDate));
    saveData();  // Save to localStorage
    updateAppointmentsList();
}

// Filter appointments by client name
function filterAppointments() {
    const searchValue = document.getElementById('searchAppointment').value.toLowerCase();
    const filteredAppointments = appointments.filter(appointment => 
        appointment.clientName.toLowerCase().includes(searchValue));
    
    const appointmentsList = document.querySelector('.appointment-list');
    appointmentsList.innerHTML = '';
    
    filteredAppointments.forEach(appointment => {
        const appointmentCard = document.createElement('div');
        appointmentCard.className = 'appointment-card';
        appointmentCard.innerHTML = `
            <h3>${appointment.clientName}</h3>
            <p>Service: ${appointment.serviceName}</p>
            <p>Price: $${appointment.price}</p>
            <p>Time: ${appointment.date}</p>
            <button onclick="deleteAppointment('${appointment.clientName}', '${appointment.date}')">Delete</button>
        `;
        appointmentsList.appendChild(appointmentCard);
    });
}

// Add a new service
function addService() {
    const name = document.getElementById('serviceName').value;
    const price = document.getElementById('servicePrice').value;

    if (name && price) {
        services.push({ name, price: Number(price) });
        updateServicesList();
        saveData();  // Save to localStorage
        clearServiceFields();
    } else {
        alert('Please enter both service name and price.');
    }
}

// Clear service input fields
function clearServiceFields() {
    document.getElementById('serviceName').value = '';
    document.getElementById('servicePrice').value = '';
}

// Delete a service
function deleteService(serviceName) {
    services = services.filter(service => service.name !== serviceName);
    saveData();  // Save to localStorage
    updateServicesList();
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('clients', JSON.stringify(clients));
    localStorage.setItem('appointments', JSON.stringify(appointments));
    localStorage.setItem('services', JSON.stringify(services));
}

// Initialize the app
function loadData() {
    const storedClients = localStorage.getItem('clients');
    const storedAppointments = localStorage.getItem('appointments');
    const storedServices = localStorage.getItem('services');

    if (storedClients) clients = JSON.parse(storedClients);
    if (storedAppointments) appointments = JSON.parse(storedAppointments);
    if (storedServices) services = JSON.parse(storedServices);
}

// Load initial data
loadData();
updateClientsList();
populateClientDropdown();
populateServiceDropdown();
updateAppointmentsList();
updateServicesList();
