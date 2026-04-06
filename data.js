// Données des employés de Leroy Merlin Dourges 1
// Coordonnées approximatives (à l'échelle ville/village)

const employees = [
    // Secteur Béthune (4 personnes)
    {
        id: 1,
        nom: "Dupont",
        prenom: "Jean",
        localite: "Béthune",
        lat: 50.5293,
        lng: 2.6400,
        email: "jean.dupont@leroymerlin.fr",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        equipe: "matin"
    },
    {
        id: 2,
        nom: "Petit",
        prenom: "Marie",
        localite: "Beuvry",
        lat: 50.5170,
        lng: 2.6790,
        email: "marie.petit@leroymerlin.fr",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        equipe: "matin"
    },
    {
        id: 3,
        nom: "Bernard",
        prenom: "Philippe",
        localite: "Verquin",
        lat: 50.5030,
        lng: 2.6450,
        email: "philippe.bernard@leroymerlin.fr",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        equipe: "aprem"
    },
    {
        id: 4,
        nom: "Dubois",
        prenom: "Sophie",
        localite: "Fouquereuil",
        lat: 50.5170,
        lng: 2.6020,
        email: "sophie.dubois@leroymerlin.fr",
        avatar: "", // avatar par défaut
        equipe: "aprem"
    },
    
    // Secteur Arras (4 personnes)
    {
        id: 5,
        nom: "Martin",
        prenom: "Thomas",
        localite: "Arras centre",
        lat: 50.2910,
        lng: 2.7774,
        email: "thomas.martin@leroymerlin.fr",
        avatar: "https://randomuser.me/api/portraits/men/5.jpg",
        equipe: "matin"
    },
    {
        id: 6,
        nom: "Robert",
        prenom: "Julie",
        localite: "Ste Catherine",
        lat: 50.3080,
        lng: 2.7640,
        email: "julie.robert@leroymerlin.fr",
        avatar: "https://randomuser.me/api/portraits/women/6.jpg",
        equipe: "aprem"
    },
    {
        id: 7,
        nom: "Richard",
        prenom: "Nicolas",
        localite: "Achicourt",
        lat: 50.2740,
        lng: 2.7590,
        email: "nicolas.richard@leroymerlin.fr",
        avatar: "", // avatar par défaut
        equipe: "nuit"
    },
    {
        id: 8,
        nom: "Durand",
        prenom: "Laura",
        localite: "Dainville",
        lat: 50.2820,
        lng: 2.7260,
        email: "laura.durand@leroymerlin.fr",
        avatar: "https://randomuser.me/api/portraits/women/8.jpg",
        equipe: "nuit"
    },
    
    // Secteur Douai/Lièvin (4 personnes)
    {
        id: 9,
        nom: "Lefebvre",
        prenom: "David",
        localite: "Douai",
        lat: 50.3705,
        lng: 3.0764,
        email: "david.lefebvre@leroymerlin.fr",
        avatar: "https://randomuser.me/api/portraits/men/9.jpg",
        equipe: "matin"
    },
    {
        id: 10,
        nom: "Moreau",
        prenom: "Céline",
        localite: "Lièvin",
        lat: 50.4305,
        lng: 2.7808,
        email: "celine.moreau@leroymerlin.fr",
        avatar: "https://randomuser.me/api/portraits/women/10.jpg",
        equipe: "aprem"
    },
    {
        id: 11,
        nom: "Simon",
        prenom: "Lucas",
        localite: "Carvin",
        lat: 50.4930,
        lng: 2.9580,
        email: "lucas.simon@leroymerlin.fr",
        avatar: "", // avatar par défaut
        equipe: "nuit"
    },
    {
        id: 12,
        nom: "Laurent",
        prenom: "Emma",
        localite: "Courrières",
        lat: 50.4570,
        lng: 2.9470,
        email: "emma.laurent@leroymerlin.fr",
        avatar: "", // avatar par défaut
        equipe: "matin"
    }
];

// Entrepôt Dourges 1 (point central)
const entrepot = {
    nom: "Leroy Merlin Dourges 1",
    lat: 50.4376,
    lng: 2.8837,
    adresse: "Avenue de l'Europe, Dourges"
};