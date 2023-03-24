import {
  createContainerAt,
  getSolidDataset,
  createThing,
  buildThing,
  setThing,
  saveSolidDatasetAt,
  createSolidDataset,
  saveSolidDatasetInContainer,
  deleteContainer,
  deleteFile,
  saveAclFor,
  getSolidDatasetWithAcl,
  getResourceAcl,
  getThingAll,
  overwriteFile,
  getThing
} from '@inrupt/solid-client';
import { SCHEMA_INRUPT } from '@inrupt/vocab-common-rdf';
import {
  fetchUrl,
  setupAcl,
  placeFileInContainer,
  hasFiles,
  hasTTLFiles,
  createDocAclForUser
} from './session-helper';

/**
 * @typedef {import('@inrupt/solid-ui-react').SessionContext} Session
 */

/**
 * @typedef {import('../typedefs').fileObjectType} fileObjectType
 */

/**
 * Function that sets permissions for a user's document container's ACL file
 *
 * @memberof utils
 * @function setDocAclPermission
 * @param {Session} session - Solid's Session Object
 * @param {string} fileType - Type of document
 * @param {string} fetchType - Type of fetch (to own Pod, or "self-fetch" or to other Pods, or "cross-fetch")
 * @param {string} otherPodUrl - Url to other user's Pod or empty string
 * @returns {Promise} Promise - Sets permission for otherPodUrl for given document type, if exists, or null
 */

export const setDocAclPermission = async (session, fileType, accessType, otherPodUrl) => {
  const documentUrl = fetchUrl(session, fileType, 'self-fetch');

  const podResouceWithAcl = await getSolidDatasetWithAcl(documentUrl, { fetch: session.fetch });

  const resourceAcl = getResourceAcl(podResouceWithAcl);
  const webId = `https://${otherPodUrl}/profile/card#me`;
  let accessObject;
  switch (accessType) {
    case 'Give':
      accessObject = { read: true };
      break;
    default:
      accessObject = { read: false };
      break;
  }

  const updatedAcl = setupAcl(resourceAcl, webId, accessObject);
  await saveAclFor(podResouceWithAcl, updatedAcl, { fetch: session.fetch });
};

/**
 * Function that uploads file to Pod on Solid
 *
 * @memberof utils
 * @function uploadDocument
 * @param {Session} session - Solid's Session Object
 * @param {fileObjectType} fileObject - Object containing information about file from form submission
 * @returns {Promise} Promise - File upload is handled via Solid libraries
 */

// Main function to upload document to user's Pod on Solid
export const uploadDocument = async (session, fileObject) => {
  const documentUrl = fetchUrl(session, fileObject.type, 'self-fetch');
  await createContainerAt(documentUrl, { fetch: session.fetch });

  const storedFile = await placeFileInContainer(session, fileObject, documentUrl);
  const datasetFromUrl = await getSolidDataset(documentUrl, { fetch: session.fetch });

  const ttlFile = hasTTLFiles(datasetFromUrl);
  const ttlFileDescription = buildThing(createThing({ name: storedFile }))
    .addStringNoLocale(SCHEMA_INRUPT.name, fileObject.file.name)
    .addStringNoLocale(SCHEMA_INRUPT.identifier, fileObject.type)
    .addStringNoLocale(SCHEMA_INRUPT.endDate, fileObject.date)
    .addStringNoLocale(SCHEMA_INRUPT.description, fileObject.description)
    .build();

  if (ttlFile !== null) {
    throw new Error('Container already exist.');
  } else {
    let newSolidDataset = createSolidDataset();
    newSolidDataset = setThing(newSolidDataset, ttlFileDescription);

    await saveSolidDatasetInContainer(documentUrl, newSolidDataset, {
      fetch: session.fetch
    });

    await createDocAclForUser(session, documentUrl);
  }
};

export const updateDocument = async (session, fileObject) => {
  const documentUrl = fetchUrl(session, fileObject.type, 'self-fetch');
  let datasetFromUrl = await getSolidDataset(documentUrl, { fetch: session.fetch });

  const [, files] = hasFiles(datasetFromUrl);
  const fileToUpdate = files.find((file) => file.url.slice(-3) !== 'ttl');
  const updatedFile = await overwriteFile(fileToUpdate.url, fileObject.file, {
    fetch: session.fetch
  });

  const ttlFileDescription = buildThing(createThing({ name: updatedFile }))
    .addStringNoLocale(SCHEMA_INRUPT.endDate, fileObject.date)
    .addStringNoLocale(SCHEMA_INRUPT.description, fileObject.description)
    .build();

  datasetFromUrl = setThing(datasetFromUrl, ttlFileDescription);
};

/**
 * Function that fetch the URL of the container containing a specific file uploaded to
 * a user's Pod on Solid, if exist
 *
 * @memberof utils
 * @function fetchDocuments
 * @param {Session} session - Solid's Session Object
 * @param {string} fileType - Type of document
 * @param {string} fetchType - Type of fetch (to own Pod, or "self-fetch" or to other Pods,
 * or "cross-fetch")
 * @param {string} [otherPodUrl] - Url to other user's Pod (set to empty string by default)
 * @returns {Promise} Promise - Either a string containing the url location of the document,
 * if exist, or throws an Error
 */

export const fetchDocuments = async (session, fileType, fetchType, otherPodUrl = '') => {
  const documentUrl = fetchUrl(session, fileType, fetchType, otherPodUrl);

  try {
    await getSolidDataset(documentUrl, { fetch: session.fetch });
    return documentUrl;
  } catch (error) {
    throw new Error('No data found');
  }
};

/**
 * Function that deletes all files from a Solid container associated to a file type,
 * if exist, and returns the container's URL
 *
 * @memberof utils
 * @function deleteDocuments
 * @param {Session} session - Solid's Session Object
 * @param {string} fileType - Type of document
 * @returns {Promise} container.url - The URL of document container and the response on
 * whether document file is deleted, if exist, and delete all existing files within it
 */

export const deleteDocumentFile = async (session, fileType) => {
  const documentUrl = fetchUrl(session, fileType, 'self-fetch');
  const fetched = await getSolidDataset(documentUrl, { fetch: session.fetch });

  // Solid requires all files within Pod container must be deleted before
  // the container itself can be deleted from Pod
  const [container, files] = hasFiles(fetched);
  files.filter(async (file) => {
    if (!file.url.slice(-3).includes('/')) {
      await deleteFile(file.url, { fetch: session.fetch });
    }
  });

  return container.url;
};

/**
 * Function that delete a Solid container from Pod on Solid given the container's URL, if exist
 *
 * @memberof utils
 * @function deleteDocumentContainer
 * @param {Session} session - Solid's Session Object
 * @param {string} documentUrl - Url link to document container
 * @returns {Promise} Promise - Perform action that deletes container completely from Pod
 */

export const deleteDocumentContainer = async (session, documentUrl) => {
  await deleteContainer(documentUrl, { fetch: session.fetch });
};
