import './main.scss';

// import esri = __esri;
import esriConfig from '@arcgis/core/config';

import Map from '@arcgis/core/Map';
import Basemap from '@arcgis/core/Basemap';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';

import { parseGeoXML } from './../src/Georef2Media';

esriConfig.portalUrl = 'https://gis.vernonia-or.gov/portal';

const load = async (): Promise<void> => {
  const cityLimits = new FeatureLayer({
    portalItem: {
      id: '5e1e805849ac407a8c34945c781c1d54',
    },
  });

  await cityLimits.load();

  new MapView({
    map: new Map({
      basemap: new Basemap({
        portalItem: {
          id: '6e9f78f3a26f48c89575941141fd4ac3',
        },
      }),
      layers: [cityLimits],
    }),
    extent: cityLimits.fullExtent.clone(),
    container: 'view-div',
  });

  parseGeoXML();
};

load();
