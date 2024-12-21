const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    // Récupère le fichier image et son nom
    const { name, base64 } = JSON.parse(event.body);
    const imagePath = path.join(__dirname, "../../images", name);

    // Décode et sauvegarde l'image
    const imageBuffer = Buffer.from(base64, "base64");
    fs.writeFileSync(imagePath, imageBuffer);

    // Met à jour le fichier JSON
    const jsonPath = path.join(__dirname, "../../images.json");
    const images = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    images.push(name);
    fs.writeFileSync(jsonPath, JSON.stringify(images, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Image uploadée avec succès !" }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Erreur lors du téléchargement." }),
    };
  }
};
