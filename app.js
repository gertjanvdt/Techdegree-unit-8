// ***** GLOBAL VARIABLES *****

let employees = [];
const urlAPI = `https://randomuser.me/api/?results=12&inc=name, picture,
email, location, phone, dob &noinfo &nat=US`;
const gridContainer = document.querySelector('.grid-container');
const overlay = document.querySelector('.overlay');
const modalContainer = document.querySelector('.modal-content');
const modalClose = document.querySelector('.modal-close');
const search = document.getElementById('search');
const navigate = document.getElementById('navigate');
let index = 0;


// ***** FETCH API *****

fetch(urlAPI)
   .then((res) => res.json())
   .then((res) => res.results)
   .then(displayEmployees)
   .catch((err) => console.log(err));

// ***** FUNCTIONS *****

// Function to create HTML per employee
function displayEmployees(employeeData) {
    employees = employeeData;

    let employeeHTML = '';

    employees.forEach((employee, index) => {
        let name = employee.name;
        let email = employee.email;
        let city = employee.location.city;
        let picture = employee.picture;

        employeeHTML += `
            <div class="card" data-index="${index}">
            <img class="avatar" src="${picture.large}" />
            <div class="text-container">
            <h2 class="name">${name.first} ${name.last}</h2>
            <p class="email">${email}</p>
            <p class="address">${city}</p>
            </div>
            </div>
        `
    });

    gridContainer.innerHTML = employeeHTML;
};

// Function to create modal content
function displayModal(index) {
    let { name, dob, phone, email, location: { city, street, state, postcode
    }, picture } = employees[index];

    let date = new Date(dob.date);

    const modalHTML = `
        <img class="avatar" src="${picture.large}" />
        <div class="text-container">
        <h2 class="name">${name.first} ${name.last}</h2>
        <p class="email">${email}</p>
        <p class="address">${city}</p>
        <hr />
        <p>${phone}</p>
        <p class="address">${street.number} ${street.name}, ${state} ${postcode}</p>
        <p>Birthday:
        ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
        </div>
        `;

overlay.classList.remove("hidden");
modalContainer.innerHTML = modalHTML;
};

// function to filter on employee
function filter() {
    const employeeCards = document.querySelectorAll('.card');
    let searchInput = search.value.toUpperCase();

    employeeCards.forEach((card) => {
        let name = card.querySelector('.name').innerHTML.toUpperCase();

        if (name.indexOf(searchInput) > -1)  {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

// Function to change modal to the left or the right
function changeModal(direction) {
    if (direction === 'left' && parseInt(index) > 0) {
        index = parseInt(index) - 1
    } else if (direction === 'right' && parseInt(index) < 11) {
        index = parseInt(index) + 1
    }
    displayModal(index);
};

// ***** EVENT LISTENERS *****

// Listen for event to click on card and open Modal
gridContainer.addEventListener('click', (e) => {
    if (e.target !== gridContainer) {
        const card = e.target.closest(".card");
        index = card.getAttribute('data-index');
        displayModal(index);
    }
});

// Listen for click on x to close modal
modalClose.addEventListener('click', (e) => {
    overlay.classList.add('hidden');
});

// Listen for input and use it to filter
search.addEventListener('input', (e) => filter());

// Listen to navigate buttons in Modal
navigate.addEventListener('click', (e) => {
    changeModal(e.target.id);
});


