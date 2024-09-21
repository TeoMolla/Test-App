// Import the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your Firebase configuration
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

// Initialize Firestore
const db = getFirestore(app);

let clients = [];
let appointments = [];
let services = [
    { name: "Cleaning", price: 100 },
    { name: "Check-up", price: 75 },
    { name: "Filling", price: 200 }
];

// Test Firestore write
async function testFirestore() {
    try {
        const docRef = await addDoc(collection(db, "test"), {
            testField: "testValue"
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

// Call testFirestore() after Firebase is initialized to test Firestore access
testFirestore();

// Show selected section
function showSection(sectionId) {
    document.getElementById('appointments').style.display = 'none';
    document.getElementById('clients').style.display = 'none';
    document.getElementById('services').style.display = 'none';
    document.getElementById(sectionId).style.display = 'block';

    if (sectionId === 'clients') {
        updateServiceDropdown();
        fetchClients();
    } else if (sectionId === 'appointments') {
        populateClientDropdown();
        populateServiceDropdown();
        fetchAppointments();
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

// Fetch clients from Firestore
async function fetchClients() {
    const querySnapshot = await getDocs(collection(db, "clients"));
    clients = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    updateClientsList();
}

// Add a new client to Firestore
async function addClient() {
    const name = document.getElementById('clientName').value;
    const age = document.getElementById('clientAge').value;
    const service = document.getElementById('clientService').value;

    if (name && age && service) {
        await addDoc(collection(db, "clients"), {
            name: name,
            age: Number(age),
            service: service
        });
        fetchClients(); // Refresh the list after adding the client
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

    clients.forEach(client => {
        const clientCard = document.createElement('div');
        clientCard.className = 'client-card';
        clientCard.innerHTML = `
            <h3>${client.name}</h3>
            <p>Age: ${client.age}</p>
            <p>Preferred Service: ${client.service}</p>
            <button onclick="deleteClient('${client.id}')">Delete</button>
        `;
        clientsList.appendChild(clientCard);
    });
}

// Delete a client from Firestore
async function deleteClient(clientId) {
    await deleteDoc(doc(db, "clients", clientId));
    fetchClients(); // Refresh the list after deleting the client
}

// Add a new appointment to Firestore
async function addAppointment() {
    const date = document.getElementById('appointmentDate').value;
    const clientName = document.getElementById('appointmentClient').value;
    const serviceName = document.getElementById('appointmentService').value;

    if (date && clientName && serviceName) {
        await addDoc(collection(db, "appointments"), {
            date: new Date(date),
            clientName: clientName,
            serviceName: serviceName
        });
        fetchAppointments(); // Refresh appointments list after adding
        clearAppointmentFields();
    } else {
        alert('Please fill in all appointment details.');
    }
}

// Fetch appointments from Firestore
async function fetchAppointments() {
    const querySnapshot = await getDocs(collection(db, "appointments"));
    appointments = querySnapshot.docs.map(doc => doc.data());
    updateAppointmentsList();
}

// Update the displayed list of appointments
function updateAppointmentsList() {
    const appointmentsList = document.querySelector('.appointment-list');
    appointmentsList.innerHTML = '';

    appointments.forEach(appointment => {
        const appointmentCard = document.createElement('div');
        appointmentCard.className = 'appointment-card';
        const formattedDate = new Date(appointment.date).toLocaleString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit'
        });
        appointmentCard.innerHTML = `
            <h3>${appointment.clientName}</h3>
            <p>Service: ${appointment.serviceName}</p>
            <p>Price: $${appointment.price}</p>
            <p>Time: ${formattedDate}</p>
            <button onclick="deleteAppointment('${appointment.clientName}', '${formattedDate}')">Delete</button>
        `;
        appointmentsList.appendChild(appointmentCard);
    });
}

// Clear appointment input fields
function clearAppointmentFields() {
    document.getElementById('appointmentDate').value = '';
    document.getElementById('appointmentClient').value = '';
    document.getElementById('appointmentService').value = '';
}

// Initialize the app by fetching clients and appointments
fetchClients();
fetchAppointments();
