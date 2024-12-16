// Exemple de code JavaScript pour afficher des images dynamiquement

// Assurez-vous que le backend fournit une liste d'images dans un fichier JSON ou via une API
// Exemple d'une réponse JSON : ["image1.jpg", "image2.png", "image3.gif"]

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

    // Ajout des images dynamiquement dans la galerie
    images.forEach((imageName) => {
      const imgElement = document.createElement("img");
      imgElement.src = `images/${imageName}`; // Le chemin doit correspondre à votre dossier images
      imgElement.alt = imageName;
      imgElement.classList.add("gallery-image"); // Ajoutez une classe pour le style si nécessaire

      // Ajout de l'image au conteneur
      gallery.appendChild(imgElement);
    });
  } catch (error) {
    console.error("Erreur lors du chargement des images:", error);
  }
}

// Appel de la fonction après le chargement de la page
window.onload = loadImages;
