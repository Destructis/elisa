const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Stockez ce token dans les secrets Netlify
const REPO_OWNER = "votre-utilisateur-github";
const REPO_NAME = "votre-repo";
const BRANCH = "main";

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { name, base64 } = JSON.parse(event.body);

    // Sauvegarde temporaire de l'image localement
    const tempPath = path.join("/tmp", name);
    fs.writeFileSync(tempPath, Buffer.from(base64, "base64"));

    // Prépare l'appel à l'API GitHub
    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/images/${name}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Ajout de l'image ${name}`,
          content: base64,
          branch: BRANCH,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`GitHub API error: ${error.message}`);
    }

    // Met à jour le fichier JSON
    const jsonResponse = await updateJsonFile(name);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Image uploadée et ajoutée au dépôt avec succès",
        response: jsonResponse,
      }),
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: "Erreur lors de la mise à jour." };
  }
};

async function updateJsonFile(imageName) {
  const jsonPath = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/images.json`;
  const response = await fetch(jsonPath, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error("Impossible de récupérer le fichier JSON.");
  }

  const data = await response.json();
  const content = Buffer.from(data.content, "base64").toString("utf-8");
  const images = JSON.parse(content);
  images.push(imageName);

  const updatedContent = Buffer.from(JSON.stringify(images, null, 2)).toString(
    "base64"
  );

  const updateResponse = await fetch(jsonPath, {
    method: "PUT",
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Mise à jour de images.json",
      content: updatedContent,
      sha: data.sha,
      branch: BRANCH,
    }),
  });

  if (!updateResponse.ok) {
    throw new Error("Impossible de mettre à jour le fichier JSON.");
  }

  return await updateResponse.json();
}
