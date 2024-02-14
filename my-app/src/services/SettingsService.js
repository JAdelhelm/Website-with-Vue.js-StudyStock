// src/services/AuthService.js
import axios from 'axios';

/**
 * Author: Jörg Adelhelm
 * Passwort ändern - API
 */
export async function resetPW(credentialSettings) {
  {
    // console.log(credentialSettings);
    return await axios
      .put('/api/profil/update', credentialSettings)
      .then(response => response.data);
  }
}


/**
 * Author: Jörg Adelhelm
 * Middleware, um alle angebote
 * für den Nutzer zu finden und zu sperren
 */
export async function lockAll(profileSettings) {
  // console.log(profileSettings.id)
  const response = await axios.delete('/api/profil/lock', {
      params: {
        id: profileSettings.id,
        username: profileSettings.username
      }
  });
  return response.data;
}



/**
 * Author: Jörg Adelhelm
 * Löschen des Profils des Benutzers
 */
export async function deleteProfil(profileSettings) {
  // console.log(profileSettings.id)
  const response = await axios.delete('/api/profil/delete', {
      params: {
          id: profileSettings.id
      }
  });
  return response.data;
}


/**
 * Author: Jörg Adelhelm
 * Nutzer über Profil sperren - Admin
 */
export async function lockUserService(userSettings) {
  // console.log(userSettings.username)
  const response = await axios.put('/api/user/lock', {
      params: {
          username: userSettings.username,
      }
  });
  return response.data;
}

/**
 * Author: Jörg Adelhelm
 * Nutzer über Profil freigeben - Admin
 */
export async function unlockUserService(userSettings) {
  // console.log(userSettings.username)
  const response = await axios.put('/api/user/unlock', {
      params: {
          username: userSettings.username,
      }
  });
  return response.data;
}

/**
 * Author: Jörg Adelhelm
 * Beschreibung für den Nutzer hinzufügen
 */
export async function setDescription(descriptionSettings) {
  // console.log(descriptionSettings.description)
  const response = await axios.put('/api/user/description', {
      params: {
          id: descriptionSettings.id,
          description: descriptionSettings.description,
      }
  });
  return response.data;
}

