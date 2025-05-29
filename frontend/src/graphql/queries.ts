// frontend/graphql/queries.ts

import { gql } from '@apollo/client';

export const SEARCH_BY_GEOJSON = gql`
  query SearchImagesByGeoJSON($geoJson: String!) {
    searchImagesByGeoJSON(geoJson: $geoJson) {
      catalogID
      resolution
      cloudCoverage
    }
  }
`;

export const CREATE_ORDER = gql`
  mutation CreateOrder($catalogID: String!) {
    createOrder(catalogID: $catalogID) {
      id
      order_date
    }
  }
`;
