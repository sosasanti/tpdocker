
async function loadCities() {
    try {
        const response = await axios.get('http://127.0.0.1:3000/ciudades');
        const cities = response.data;

        const cityList = document.getElementById('city-list');
        cityList.innerHTML = ''; // Limpiar la lista de ciudades antes de agregar las nuevas
        cities.forEach(city => addCityFront(city.data.name, city.data.image, city.data.attractions));

    } catch (error) {
        console.error('Error al cargar las ciudades:', error);
    }
}

async function addCityFront(name, image, attractions) {

    const cityList = document.getElementById('city-list');
    
    const newCity = document.createElement('div');
    newCity.classList.add('city');
    if (typeof name === 'string')
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

    if (Array.isArray(attractions)) {
        attractions.forEach(attraction => {
            const li = document.createElement('li');
            li.textContent = attraction;
            ul.appendChild(li);
        });
    }


    infoDiv.appendChild(ul);
    newCity.appendChild(img);
    newCity.appendChild(infoDiv);
    
    // Aplicar el gradiente al estilo de fondo del elemento HTML
    infoDiv.style.background=  `linear-gradient(160deg, #0093E9 0%, #80D0C7 50%, #ffffff 100%)`;

    cityList.appendChild(newCity);

    document.getElementById('city-form').reset();
}

//Formulario agregar nueva ciudad
document.getElementById('city-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const cityName = document.getElementById('city-name').value;
    const attraction1 = document.getElementById('attraction-1').value;
    const attraction2 = document.getElementById('attraction-2').value;
    const attraction3 = document.getElementById('attraction-3').value;
    const cityImageUrl = document.getElementById('city-image-url').value;


    if (!cityImageUrl) {
        alert('Por favor, proporciona una URL de imagen.');
        return;
    }
    if (!isValidImageUrl(cityImageUrl)) {
        alert('La URL de la imagen proporcionada no es válida.');
        return;
    }

    // Llamar a la función para agregar la ciudad con la URL de la imagen
    addCity(cityName, cityImageUrl, [attraction1, attraction2, attraction3]);
});

// Función para verificar si una URL es una URL de imagen válida
function isValidImageUrl(url) {
    const imageExtensions = /\.(png|jpe?g|gif)$/i;
    return imageExtensions.test(url);
}

async function addCity(name, image, attractions) {
    try {
        const response = await axios.post('http://127.0.0.1:3000/ciudades', {
            data: {
                name,
                image,
                attractions
            }
        });
        loadCities();  // Recargar la lista de ciudades después de agregar una nueva
        showNotification('Ciudad agregada exitosamente');
    } catch (error) {
        console.error('Error al agregar la ciudad:', error);
        showNotification('Error al agregar la ciudad');
    }
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
// Polling para recibir nuevas ciudades desde el backend cada 15 segundos
setInterval(loadCities, 15000);