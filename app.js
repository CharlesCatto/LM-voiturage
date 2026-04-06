// Initialisation de la carte
const map = L.map('map').setView([entrepot.lat, entrepot.lng], 12);

// Tuiles OpenStreetMap
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> & CartoDB',
    subdomains: 'abcd',
    maxZoom: 19,
    minZoom: 10
}).addTo(map);

// Marqueur de l'entrepôt (optionnel, pour montrer le point central)
const entrepotIcon = L.divIcon({
    className: 'custom-div-icon',
    html: '🏭',
    iconSize: [30, 30],
    popupAnchor: [0, -15]
});

L.marker([entrepot.lat, entrepot.lng], { icon: entrepotIcon })
    .bindPopup(`
        <div class="custom-popup">
            <h3>${entrepot.nom}</h3>
            <p>📍 ${entrepot.adresse}</p>
            <p><strong>Point de rendez-vous covoiturage</strong></p>
        </div>
    `)
    .addTo(map);

// Gestion du clustering
const markers = L.markerClusterGroup({
    iconCreateFunction: function(cluster) {
        const childCount = cluster.getChildCount();
        return L.divIcon({
            html: `<div class="marker-cluster-custom">${childCount}</div>`,
            className: 'marker-cluster-custom',
            iconSize: L.point(40, 40)
        });
    },
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    maxClusterRadius: 60
});

// Stockage des marqueurs pour les filtres
let allMarkers = [];

// Fonction pour créer l'avatar (ou défaut)
function getAvatarUrl(employee) {
    if (employee.avatar && employee.avatar !== '') {
        return employee.avatar;
    }
    // Avatar par défaut : emoji ou placeholder
    return 'https://ui-avatars.com/api/?background=1a1a1a&color=fff&name=' + employee.prenom.charAt(0) + employee.nom.charAt(0);
}

// Fonction pour créer un popup personnalisé
function createPopupContent(employee) {
    return `
        <div class="custom-popup">
            <h3>${employee.prenom} ${employee.nom}</h3>
            <div class="popup-content">
                <img src="${getAvatarUrl(employee)}" alt="avatar" class="employee-avatar" onerror="this.src='https://ui-avatars.com/api/?background=1a1a1a&color=fff&name=${employee.prenom.charAt(0)}${employee.nom.charAt(0)}'">
                <div class="employee-info">
                    <p><strong>📍 ${employee.localite}</strong></p>
                    <p><strong>👔 Équipe :</strong> ${employee.equipe === 'matin' ? '🌅 Matin' : employee.equipe === 'aprem' ? '☀️ Après-midi' : '🌙 Nuit'}</p>
                    <a href="https://github.com/CharlesCatto/LM-voiturage" target="_blank" class="contact-link">💬 Contacter</a>
                </div>
            </div>
        </div>
    `;
}

// Fonction pour ajouter tous les marqueurs
function addAllMarkers() {
    // Vider les groupes existants
    markers.clearLayers();
    allMarkers = [];
    
    employees.forEach(employee => {
        const marker = L.marker([employee.lat, employee.lng]);
        marker.bindPopup(createPopupContent(employee));
        marker.employee = employee; // Attacher les données au marqueur
        markers.addLayer(marker);
        allMarkers.push(marker);
    });
    
    map.addLayer(markers);
}

// Fonction pour filtrer les marqueurs
function filterMarkers(searchType, searchValue) {
    if (!searchValue || searchValue.trim() === '') {
        // Afficher tous les marqueurs
        markers.clearLayers();
        allMarkers.forEach(marker => markers.addLayer(marker));
        map.addLayer(markers);
        return;
    }
    
    const query = searchValue.toLowerCase().trim();
    
    const filtered = allMarkers.filter(marker => {
        const employee = marker.employee;
        if (searchType === 'name') {
            return employee.nom.toLowerCase().includes(query) || 
                   employee.prenom.toLowerCase().includes(query);
        } else if (searchType === 'city') {
            return employee.localite.toLowerCase().includes(query);
        }
        return true;
    });
    
    // Mettre à jour la carte avec les marqueurs filtrés
    markers.clearLayers();
    filtered.forEach(marker => markers.addLayer(marker));
    map.addLayer(markers);
    
    // Si un seul résultat, zoomer dessus
    if (filtered.length === 1) {
        const marker = filtered[0];
        map.setView(marker.getLatLng(), 14);
        marker.openPopup();
    } else if (filtered.length > 1) {
        // Zoomer pour voir tous les résultats
        const bounds = L.latLngBounds(filtered.map(m => m.getLatLng()));
        map.fitBounds(bounds);
    }
}

// Initialisation de la carte
addAllMarkers();

// ========== GESTION DE LA BARRE DE RECHERCHE ==========
let currentSearchType = 'name';
const searchInput = document.getElementById('searchInput');
const clearBtn = document.getElementById('searchClear');
const tabBtns = document.querySelectorAll('.tab-btn');

// Changement d'onglet
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Mettre à jour l'UI
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Mettre à jour le type de recherche
        currentSearchType = btn.dataset.searchType;
        
        // Re-filtrer avec la valeur actuelle
        filterMarkers(currentSearchType, searchInput.value);
        
        // Mettre à jour le placeholder
        searchInput.placeholder = currentSearchType === 'name' ? 'Nom ou prénom...' : 'Localité (Béthune, Arras, Douai...)';
    });
});

// Écoute de la recherche
searchInput.addEventListener('input', (e) => {
    const value = e.target.value;
    clearBtn.style.display = value ? 'flex' : 'none';
    filterMarkers(currentSearchType, value);
});

// Bouton clear
clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.style.display = 'none';
    filterMarkers(currentSearchType, '');
    searchInput.focus();
});

// Ajuster la vue quand on resize
window.addEventListener('resize', () => {
    setTimeout(() => map.invalidateSize(), 100);
});