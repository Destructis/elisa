// Fonction principale pour charger et afficher les images dynamiquement
async function loadImages() {
  try {
    // Remplacez 'images.json' par l'URL ou le chemin vers votre fichier JSON ou API
    const response = await fetch("images.json");
    if (!response.ok) {
      throw new Error(`Erreur HTTP ! status: ${response.status}`);
    }

    // Récupération de la liste des images
    const images = await response.json();

    if (!Array.isArray(images) || images.length === 0) {
      throw new Error("Le fichier JSON ne contient pas d'images valides.");
    }

    // Mélanger les images pour les afficher dans un ordre aléatoire
    shuffleArray(images);

    // Sélection de l'élément HTML où afficher les images
    const gallery = document.getElementById("gallery");
    gallery.style.position = "relative";
    gallery.style.width = "100%";
    gallery.style.height = "100vh"; // Utiliser toute la hauteur de la fenêtre
    gallery.style.overflow = "hidden";

    // Déterminer si l'écran est large ou non
    const isWideScreen = window.innerWidth > 800;

    // Création des éléments d'image avec des styles initiaux pour les transitions
    images.forEach((imageName, index) => {
      const imgElement = document.createElement("img");
      imgElement.src = `images/${imageName}`; // Le chemin doit correspondre à votre dossier images
      imgElement.alt = imageName;
      imgElement.classList.add("gallery-image");
      imgElement.style.position = "absolute";
      imgElement.style.top = "0";
      imgElement.style.left = isWideScreen ? `${(index % 2) * 50}%` : "0"; // Affiche 2 images côte à côte si l'écran est large
      imgElement.style.width = isWideScreen ? "50%" : "100%"; // Si large, chaque image occupe 50% de la largeur
      imgElement.style.height = "100%"; // Utiliser toute la hauteur de la fenêtre
      imgElement.style.objectFit = "cover"; // Adapte l'image sans déformation
      imgElement.style.opacity = "0";
      imgElement.style.transition = "opacity 1s ease-in-out";

      // Ajout de l'image au conteneur
      gallery.appendChild(imgElement);

      // Montre la première image initialement
      if (index === 0) {
        imgElement.style.opacity = "1";
      }
    });

    // Début des transitions entre les images
    startSlideshow(gallery, images.length, isWideScreen);
  } catch (error) {
    console.error("Erreur lors du chargement des images:", error);
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = `<p>Erreur de chargement des images. Veuillez réessayer plus tard.</p>`;
  }
}

// Fonction pour démarrer le diaporama
function startSlideshow(gallery, totalImages, isWideScreen) {
  let currentIndex = 0;
  const images = gallery.querySelectorAll(".gallery-image");

  setInterval(() => {
    // Masquer l'image actuelle
    images[currentIndex].style.opacity = "0";

    // Passer à l'image suivante (si on est en mode écran large, on gère 2 images)
    currentIndex = (currentIndex + (isWideScreen ? 2 : 1)) % totalImages;

    // Afficher la nouvelle image
    images[currentIndex].style.opacity = "1";
  }, 3000); // Change d'image toutes les 3 secondes
}

// Fonction pour mélanger un tableau (algorithme de Fisher-Yates)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Échange les éléments
  }
}

// Appel de la fonction après le chargement de la page
window.onload = loadImages;
