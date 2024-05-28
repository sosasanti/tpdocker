
async function loadCities() {
    try {
        const response = await axios.get('http://127.0.0.1:3000/ciudades');
        const cities = response.data;

        const cityList = document.getElementById('city-list');
        cityList.innerHTML = ''; // Limpiar la lista de ciudades antes de agregar las nuevas

        cities.forEach(city => addCityFront(city.name, city.image, city.attractions));
    } catch (error) {
        console.error('Error al cargar las ciudades:', error);
    }
}


//Formulario agregar nueva ciudad
document.getElementById('city-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const cityName = document.getElementById('city-name').value.trim();
    const attraction1 = document.getElementById('attraction-1').value.trim();
    const attraction2 = document.getElementById('attraction-2').value.trim();
    const attraction3 = document.getElementById('attraction-3').value.trim();
    const cityImageUrl = document.getElementById('city-image-url').value.trim();

    if (cityExists(cityName)) {
        alert('La ciudad ya existe.');
        return;
    }


    if (!cityImageUrl) {
        alert('Por favor, proporciona una URL de imagen.');
        return;
    }

    // Verificar si la URL de la imagen es válida
    if (!isValidImageUrl(cityImageUrl)) {
        alert('La URL de la imagen proporcionada no es válida.');
        return;
    }

    // Llamar a la función para agregar la ciudad con la URL de la imagen
    addCity(cityName, cityImageUrl, [attraction1, attraction2, attraction3]);
});

// Función para verificar si una URL es una URL de imagen válida
function isValidImageUrl(url) {
    // Expresión regular para verificar si la URL termina con una extensión de imagen común
    const imageExtensions = /\.(png|jpe?g|gif)$/i;
    return imageExtensions.test(url);
}

async function cityExists(name) {
    try {
        const response = await axios.get('http://127.0.0.1:3000/ciudades');
        const cities = response.data;
        return cities.some(city => city.name.toLowerCase() === name.toLowerCase());
    } catch (error) {
        console.error('Error al comprobar si la ciudad existe:', error);
        return false;
    }
}

async function addCityFront(name, image, attractions) {

    const cityList = document.getElementById('city-list');
    
    const newCity = document.createElement('div');
    newCity.classList.add('city');
    newCity.setAttribute('data-name', name.toLowerCase());

    const img = document.createElement('img');
    img.src = image;
    img.alt = name;
    
    const infoDiv = document.createElement('div');
    infoDiv.classList.add('info');
    
    const h2 = document.createElement('h2');
    h2.textContent = name;
    infoDiv.appendChild(h2);
    
    const ul = document.createElement('ul');
    attractions.forEach(attraction => {
        const li = document.createElement('li');
        li.textContent = attraction;
        ul.appendChild(li);
    });

    infoDiv.appendChild(ul);
    newCity.appendChild(img);
    newCity.appendChild(infoDiv);
    
    // Aplicar el gradiente al estilo de fondo del elemento HTML
    infoDiv.style.background=  `linear-gradient(160deg, #0093E9 0%, #80D0C7 50%, #ffffff 100%)`;

    cityList.appendChild(newCity);

    document.getElementById('city-form').reset();
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    notificationText.textContent = message;
    notification.style.display = 'flex';
}
document.getElementById('close-notification').addEventListener('click', function() {
    document.getElementById('notification').style.display = 'none';
});

// Cargar las ciudades inicialmente
loadCities();
// Polling para recibir nuevas ciudades desde el backend cada 5 segundos
setInterval(loadCities, 5000);