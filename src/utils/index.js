/**
 * The utils module to help run functions for PASS forms, notifications, and
 * Solid Session, and Pod management. The file session-core contains functions
 * that is exported to PASS
 *
 * @module utils
 * @namespace utils
 */
import getDriversLicenseData from './barcode/barcode-scan';
import formattedDate from './barcode/barcode-date-parser';
import createPASSContainer, { generateACL } from './pod-management/pod-helper';
import saveToClipboard from './text/saveToClipboard';
import truncateText from './text/truncateText';
import getTypeText from './text/documentTypes';

export {
  getDriversLicenseData,
  formattedDate,
  createPASSContainer,
  generateACL,
  saveToClipboard,
  truncateText,
  getTypeText
};

export * from './network/session-core';
export * from './network/session-helper';
