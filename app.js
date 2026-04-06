// Initialisation de la carte
const map = L.map('map').setView([entrepot.lat, entrepot.lng], 12);

// Tuiles OpenStreetMap (style CartoDB Light, sobre)
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> & CartoDB',
    subdomains: 'abcd',
    maxZoom: 19,
    minZoom: 8  // Permet de dézoomer davantage
}).addTo(map);

// Marqueur de l'entrepôt (emoji usine plus grand)
const entrepotIcon = L.divIcon({
    className: 'custom-div-icon',
    html: '<div style="font-size: 40px;">🏭</div>',
    iconSize: [60, 60],
    popupAnchor: [0, -30]
});

L.marker([entrepot.lat, entrepot.lng], { icon: entrepotIcon })
    .bindPopup(`
        <div class="custom-popup">
            <h3>${entrepot.nom}</h3>
            <p>📍 ${entrepot.adresse}</p>
            <p><strong>🚗 Point de rendez-vous covoiturage</strong></p>
        </div>
    `)
    .addTo(map);

// ========== GESTION DU CLUSTERING ==========
const markers = L.markerClusterGroup({
    iconCreateFunction: function(cluster) {
        const childCount = cluster.getChildCount();
        return L.divIcon({
            html: `<div class="marker-cluster-custom">${childCount}</div>`,
            className: 'marker-cluster-custom',
            iconSize: L.point(40, 40)
        });
    },
    spiderfyOnMaxZoom: true,      // Explosion en éventail
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    maxClusterRadius: 60          // Rayon de regroupement
});

let allMarkers = [];

// ========== GESTION DES AVATARS ==========
function getAvatarUrl(employee) {
    if (employee.avatar && employee.avatar !== '') {
        return employee.avatar;
    }
    // ui-avatars.com : générateur gratuit d'avatars par initiales
    return 'https://ui-avatars.com/api/?background=1a1a1a&color=fff&name=' 
           + encodeURIComponent(employee.prenom.charAt(0) + employee.nom.charAt(0));
}

// ========== POPUP PERSONNALISÉ ==========
function createPopupContent(employee) {
    // Conversion des équipes A/B/C en texte lisible
    let equipeText = '';
    let equipeEmoji = '';
    switch(employee.equipe) {
        case 'A':
            equipeText = 'Équipe A (alternance matin/aprem)';
            equipeEmoji = '🔄';
            break;
        case 'B':
            equipeText = 'Équipe B (alternance aprem/matin)';
            equipeEmoji = '🔄';
            break;
        case 'C':
            equipeText = 'Équipe C (nuit)';
            equipeEmoji = '🌙';
            break;
        default:
            equipeText = 'Équipe inconnue';
            equipeEmoji = '❓';
    }
    
    return `
        <div class="custom-popup">
            <h3>${employee.prenom} ${employee.nom}</h3>
            <div class="popup-content">
                <img src="${getAvatarUrl(employee)}" alt="avatar" class="employee-avatar" 
                     onerror="this.src='https://ui-avatars.com/api/?background=1a1a1a&color=fff&name=${employee.prenom.charAt(0)}${employee.nom.charAt(0)}'">
                <div class="employee-info">
                    <p><strong>📍 ${employee.localite}</strong></p>
                    <p><strong>${equipeEmoji} Équipe :</strong> ${equipeText}</p>
                    <a href="https://github.com/CharlesCatto/LM-voiturage" target="_blank" class="contact-link">💬 Contacter sur GitHub</a>
                </div>
            </div>
        </div>
    `;
}

// ========== CRÉATION DES MARQUEURS AVEC PINS VERTS ==========
function addAllMarkers() {
    markers.clearLayers();
    allMarkers = [];
    
    employees.forEach(employee => {
        // Utilisation d'un CDN pour les pins verts (Solution 2)
        // Pas besoin d'image locale, tout est en ligne !
        const greenPinIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
        
        const marker = L.marker([employee.lat, employee.lng], { icon: greenPinIcon });
        marker.bindPopup(createPopupContent(employee));
        marker.employee = employee;  // On attache les données au marqueur
        markers.addLayer(marker);
        allMarkers.push(marker);
    });
    
    map.addLayer(markers);
}

// ========== SYSTÈME DE FILTRAGE (RECHERCHE + ÉQUIPE) ==========
let currentSearchType = 'name';
let currentTeamFilter = 'all';

function filterMarkers() {
    const searchValue = document.getElementById('searchInput').value;
    
    // Si la recherche est vide, on prend tous les marqueurs
    let filtered = allMarkers;
    
    // 1. FILTRE PAR RECHERCHE (nom/prénom ou localité)
    if (searchValue && searchValue.trim() !== '') {
        const query = searchValue.toLowerCase().trim();
        
        filtered = filtered.filter(marker => {
            const employee = marker.employee;
            if (currentSearchType === 'name') {
                return employee.nom.toLowerCase().includes(query) || 
                       employee.prenom.toLowerCase().includes(query);
            } else if (currentSearchType === 'city') {
                return employee.localite.toLowerCase().includes(query);
            }
            return true;
        });
    }
    
    // 2. FILTRE PAR ÉQUIPE (A, B, C ou all)
    if (currentTeamFilter !== 'all') {
        filtered = filtered.filter(marker => marker.employee.equipe === currentTeamFilter);
    }
    
    // Mise à jour de la carte
    markers.clearLayers();
    filtered.forEach(marker => markers.addLayer(marker));
    map.addLayer(markers);
    
    // Zoom intelligent selon les résultats
    if (filtered.length === 1) {
        const marker = filtered[0];
        map.setView(marker.getLatLng(), 14);
        marker.openPopup();
    } else if (filtered.length > 1 && filtered.length < allMarkers.length) {
        const bounds = L.latLngBounds(filtered.map(m => m.getLatLng()));
        map.fitBounds(bounds);
    } else if (filtered.length === 0) {
        // Aucun résultat, on reste sur la vue par défaut
        map.setView([entrepot.lat, entrepot.lng], 12);
    }
}

// ========== INITIALISATION ==========
addAllMarkers();

// ========== GESTION DE LA BARRE DE RECHERCHE ==========
const searchInput = document.getElementById('searchInput');
const clearBtn = document.getElementById('searchClear');
const tabBtns = document.querySelectorAll('.tab-btn');

// Changement d'onglet (Nom vs Localité)
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentSearchType = btn.dataset.searchType;
        
        // Mise à jour du placeholder
        searchInput.placeholder = currentSearchType === 'name' 
            ? 'Nom ou prénom...' 
            : 'Localité (Béthune, Arras, Douai...)';
        
        filterMarkers();
    });
});

// Écoute de la saisie
searchInput.addEventListener('input', () => {
    const value = searchInput.value;
    clearBtn.style.display = value ? 'flex' : 'none';
    filterMarkers();
});

// Bouton clear
clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.style.display = 'none';
    filterMarkers();
    searchInput.focus();
});

// ========== GESTION DES FILTRES ÉQUIPE ==========
const teamBtns = document.querySelectorAll('.team-btn');
teamBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        teamBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTeamFilter = btn.dataset.team;
        filterMarkers();
    });
});

// Ajustement de la carte au redimensionnement (important pour mobile)
window.addEventListener('resize', () => {
    setTimeout(() => map.invalidateSize(), 100);
});