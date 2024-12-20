import { getFile, universalAccess } from '@inrupt/solid-client';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import {
  setDocAclForUser,
  getUserProfileName,
  saveMessageTTL,
  buildMessageTTL
} from './session-helper';

/**
 * @typedef {import('@inrupt/solid-client-authn-browser').Session} Session
 */

/**
 * @typedef {import('@inrupt/solid-client').Access} Access
 */

/**
 * @typedef {import("../../typedefs").messageListObject} messageListObject
 */

/*
  File Permissions Section

  Functions here deals primarily setting ACL permissions to other users
*/

/**
 * Function that sets permissions for a user's document container's ACL file
 *
 * @memberof utils
 * @function setDocAclPermission
 * @param {Session} session - Solid's Session Object {@link Session}
 * @param {string} docName - Name of document to share
 * @param {Access} permissions - The Access object for setting ACL in Solid
 * @param {URL} podUrl - URL of the user's Pod
 * @param {string} webId - The webId to share the document with
 * @returns {Promise} Promise - Sets permission for otherPodUsername for given
 * document type, if exists, or null
 */
export const setDocAclPermission = async (session, docName, permissions, podUrl, webId) => {
  const containerUrl = `${podUrl}PASS/Documents/`;
  const documentUrl = `${containerUrl}${docName.replace("'", '').replace(' ', '%20')}`;

  await universalAccess.setAgentAccess(documentUrl, webId, permissions, { fetch: session.fetch });
};

/**
 * Function that sets permissions for a user's document container's ACL file
 *
 * @memberof utils
 * @function setDocContainerAclPermission
 * @param {Session} session - Solid's Session Object {@link Session}
 * @param {Access} permissions - The Access object for setting ACL in Solid
 * @param {URL} podUrl - URL of the user's Pod
 * @param {string} webIdToSetPermsTo - URL of the other user's Pod to give/revoke permissions OR empty string
 * @returns {Promise} Promise - Sets permission for otherPodUsername for the user's
 * Documents container
 */
export const setDocContainerAclPermission = async (
  session,
  permissions,
  podUrl,
  webIdToSetPermsTo
) => {
  const containerUrl = `${podUrl}PASS/Documents/`;

  await setDocAclForUser(session, containerUrl, '', webIdToSetPermsTo, permissions);
};

/*
  User Message Section
  
  Functions here deal primarily with user messages on PASS
*/

/**
 * Function that sends a message to another user's Pod inbox as a TTL file and
 * saves a copy in the sender's outbox
 *
 * @memberof utils
 * @function sendMessageTTL
 * @param {Session} session - Solid's Session Object {@link Session}
 * @param {object} messageObject - An object containing inputs for the the message
 * @param {URL} podUrl - The Pod URL of the user to send message to
 * @returns {Promise} Promise - Sends a TTL file to another user's Pod inbox and
 * saves a copy on the sender's outbox
 */
export const sendMessageTTL = async (session, messageObject, podUrl) => {
  const { recipientPodUrl } = messageObject;
  const recipientWebId = `${recipientPodUrl}profile/card#me`;
  const recipientInboxUrl = `${recipientPodUrl}PASS/Inbox/`;
  const outboxUrl = `${podUrl}PASS/Outbox/`;

  const senderName = (await getUserProfileName(session.info.webId)) || podUrl;
  const recipientName = (await getUserProfileName(recipientWebId)) || recipientPodUrl;

  const date = dayjs().$d;
  const dateYYYYMMDD = dayjs().format('YYYYMMDD');
  const dateISOTime = dayjs().toISOString().split('T')[1].split('.')[0].replace(/:/g, '');
  const messageSlug = `${encodeURIComponent(
    messageObject.title.replace(':', '-')
  )}-${dateYYYYMMDD}-${dateISOTime}`;

  const messageMetadata = {
    messageId: uuidv4(),
    podUrl,
    senderName,
    recipientName,
    recipientPodUrl,
    recipientWebId,
    messageSlug
  };

  const newSolidDatasets = ['sender', 'recipient'].map((person) =>
    buildMessageTTL(session, date, messageObject, messageMetadata, person)
  );

  try {
    await Promise.all([
      saveMessageTTL(session, outboxUrl, newSolidDatasets[0], messageSlug),
      saveMessageTTL(session, recipientInboxUrl, newSolidDatasets[1], messageSlug)
    ]);
  } catch (error) {
    throw new Error(
      'Message failed to send. Reason: PASS-specific inbox does not exist for sender or recipient'
    );
  }
};

/**
 * A function that returns a file URL that could be used in local iframe
 *
 * @function getBlobFromSolid
 * @param {Session} session - Solid's Session Object {@link Session}
 * @param {URL} fileUrl - URL of file you wish to view
 * @returns {Promise<URL>} URL - URL of file blob which can be used locally for
 * iframes
 */

export const getBlobFromSolid = async (session, fileUrl) => {
  const fileBlob = await getFile(fileUrl, { fetch: session.fetch });
  return URL.createObjectURL(fileBlob);
};
