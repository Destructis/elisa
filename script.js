// Exemple de code JavaScript pour afficher des images dynamiquement avec des transitions

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

  setInterval(() => {
    // Masquer l'image actuelle
    images[currentIndex].style.opacity = "0";

    // Passer à l'image suivante
    currentIndex = (currentIndex + 1) % totalImages;

    // Afficher la nouvelle image
    images[currentIndex].style.opacity = "1";
  }, 3000); // Change d'image toutes les 3 secondes
}

// Fonction pour ajouter un bouton ouvrant une galerie complète
function addGalleryButton(images) {
  const button = document.createElement("button");
  button.textContent = "Voir la galerie complète";
  button.style.position = "absolute";
  button.style.bottom = "10px";
  button.style.right = "10px";
  button.style.zIndex = "10";
  button.style.padding = "10px 20px";
  button.style.backgroundColor = "#000";
  button.style.color = "#fff";
  button.style.border = "none";
  button.style.borderRadius = "5px";
  button.style.cursor = "pointer";

  button.addEventListener("click", () => {
    openGalleryPage(images);
  });

  document.body.appendChild(button);
}

// Fonction pour ouvrir une nouvelle page avec la galerie complète
function openGalleryPage(images) {
  const galleryWindow = window.open("", "_blank");
  galleryWindow.document.write(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Galerie Complète</title>
          <style>
              body {
                  display: flex;
                  flex-wrap: wrap;
                  justify-content: center;
                  gap: 10px;
                  margin: 0;
                  padding: 20px;
                  font-family: Arial, sans-serif;
              }
              img {
                  width: calc(100% / 3 - 20px);
                  max-width: 300px;
                  height: auto;
                  border-radius: 5px;
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              @media (max-width: 800px) {
                  img {
                      width: calc(100% / 2 - 10px);
                  }
              }
              @media (max-width: 500px) {
                  img {
                      width: 100%;
                  }
              }
          </style>
      </head>
      <body>
          ${images
            .map(
              (imageName) =>
                `<img src="images/${imageName}" alt="${imageName}">`
            )
            .join("")}
      </body>
      </html>
  `);
}

// Appel de la fonction après le chargement de la page
window.onload = loadImages;
