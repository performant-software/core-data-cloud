// @flow

import { Types } from './ProjectModels';

const DEFAULT_LIMIT = 0;
const RADIX = 10;

/**
 * Returns the limit for the number of records to include in a IIIF manifest.
 *
 * @returns {number}
 */
const getManifestLimit = () => {
  let limit = DEFAULT_LIMIT;

  if (import.meta.env.VITE_IIIF_MANIFEST_ITEM_LIMIT) {
    limit = parseInt(import.meta.env.VITE_IIIF_MANIFEST_ITEM_LIMIT, RADIX);
  }

  return limit;
};

/**
 * Records the IIIF manifest URL for the passed project model, record UUID, and project model relationship UUID.
 *
 * @param projectModel
 * @param recordId
 * @param projectModelRelationshipId
 *
 * @returns {*}
 */
const getManifestURL = (projectModel, recordId, projectModelRelationshipId) => {
  let url;

  let baseUrl;

  switch (projectModel.model_class_view) {
    case Types.Event:
      baseUrl = 'events';
      break;

    case Types.Instance:
      baseUrl = 'instances';
      break;

    case Types.Item:
      baseUrl = 'items';
      break;

    case Types.MediaContent:
      baseUrl = 'media_contents';
      break;

    case Types.Organization:
      baseUrl = 'organizations';
      break;

    case Types.Person:
      baseUrl = 'people';
      break;

    case Types.Place:
      baseUrl = 'places';
      break;

    case Types.Taxonomy:
      baseUrl = 'taxonomies';
      break;

    case Types.Work:
      baseUrl = 'works';
      break;

    default:
      baseUrl = null;
  }

  if (baseUrl) {
    url = [
      import.meta.env.VITE_HOSTNAME,
      'core_data',
      'public',
      'v1',
      baseUrl,
      recordId,
      'manifests',
      projectModelRelationshipId
    ].join('/');
  }

  return url;
};

export default {
  getManifestLimit,
  getManifestURL
};
