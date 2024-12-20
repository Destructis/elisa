// Exemple de code JavaScript pour afficher des images dynamiquement avec des transitions et une galerie complète

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

    // Sélection de l'élément HTML où afficher les images
    const gallery = document.getElementById("gallery");
    gallery.style.position = "relative";
    gallery.style.width = "100%";
    gallery.style.height = "50vh"; // Utilise 50% de la hauteur de la fenêtre
    gallery.style.maxHeight = "600px"; // Définit une hauteur maximale
    gallery.style.overflow = "hidden";

    // Création des éléments d'image avec des styles initiaux pour les transitions
    images.forEach((imageName, index) => {
      const imgElement = document.createElement("img");
      imgElement.src = `images/${imageName}`; // Le chemin doit correspondre à votre dossier images
      imgElement.alt = imageName;
      imgElement.classList.add("gallery-image"); // Ajoutez une classe pour le style si nécessaire
      imgElement.style.position = "absolute";
      imgElement.style.top = "0";
      imgElement.style.left = "0";
      imgElement.style.width = "100%";
      imgElement.style.height = "100%";
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
    startSlideshow(gallery, images.length);

    // Ajout d'un bouton pour ouvrir la galerie complète
    addGalleryButton(images);
  } catch (error) {
    console.error("Erreur lors du chargement des images:", error);
  }
}

// Fonction pour démarrer le diaporama
function startSlideshow(gallery, totalImages) {
  let currentIndex = 0;
  const images = gallery.querySelectorAll(".gallery-image");
  const isWideScreen = window.innerWidth > 800;

  setInterval(() => {
    // Masquer l'image actuelle
    images.forEach((img, index) => {
      img.style.opacity = "0";
    });

    if (isWideScreen) {
      // Afficher deux images si la largeur est supérieure à 800px
      images[currentIndex].style.opacity = "1";
      images[(currentIndex + 1) % totalImages].style.opacity = "1";
      currentIndex = (currentIndex + 2) % totalImages;
    } else {
      // Afficher une seule image
      images[currentIndex].style.opacity = "1";
      currentIndex = (currentIndex + 1) % totalImages;
    }
  }, 3000); // Change d'image toutes les 3 secondes
}

// Fonction pour ajouter un bouton pour ouvrir la galerie complète
function addGalleryButton(images) {
  const button = document.createElement("button");
  button.textContent = "Ouvrir la galerie complète";
  button.style.position = "absolute";
  button.style.bottom = "10px";
  button.style.right = "10px";
  button.style.zIndex = "1000";
  button.style.padding = "10px 20px";
  button.style.backgroundColor = "#000";
  button.style.color = "#fff";
  button.style.border = "none";
  button.style.cursor = "pointer";

  button.addEventListener("click", () => {
    openFullGallery(images);
  });

  document.body.appendChild(button);
}

// Fonction pour ouvrir une nouvelle page avec la galerie complète
function openFullGallery(images) {
  const galleryWindow = window.open("", "_blank");
  galleryWindow.document.write(
    "<html><head><title>Galerie Complète</title></head><body>"
  );
  galleryWindow.document.write(
    '<h1>Galerie Complète</h1><div style="display: flex; flex-wrap: wrap; gap: 10px;">'
  );

  images.forEach((imageName) => {
    galleryWindow.document.write(
      `<div style="width: calc(33.33% - 10px);"><img src="images/${imageName}" alt="${imageName}" style="width: 100%; height: auto; object-fit: cover;"></div>`
    );
  });

  galleryWindow.document.write("</div></body></html>");
  galleryWindow.document.close();
}

// Appel de la fonction après le chargement de la page
window.onload = loadImages;
