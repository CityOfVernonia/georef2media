import './main.scss';

// import esri = __esri;
import esriConfig from '@arcgis/core/config';

import Map from '@arcgis/core/Map';
import Basemap from '@arcgis/core/Basemap';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';
import { SimpleRenderer } from '@arcgis/core/renderers';
import { SimpleFillSymbol, TextSymbol } from '@arcgis/core/symbols';
import LabelClass from '@arcgis/core/layers/support/LabelClass';

import {
  imageMediaLayer,
  auxiliaryXmlToControlPoints,
  displayControlPoints,
  clearControlPoints,
} from '../src/GeoreferencedMedia';

esriConfig.portalUrl = 'https://gis.vernonia-or.gov/portal';

const load = async (): Promise<void> => {
  const cityLimits = new FeatureLayer({
    portalItem: {
      id: '5e1e805849ac407a8c34945c781c1d54',
    },
  });

  await cityLimits.load();

  const view = new MapView({
    map: new Map({
      basemap: new Basemap({
        portalItem: {
          id: '2622b9aecacd401583981410e07d5bb9',
        },
      }),
      layers: [
        new GeoJSONLayer({
          url: 'https://cityofvernonia.github.io/vernonia-tax-maps/TaxMapBoundaries.geojson',
          outFields: ['*'],
          renderer: new SimpleRenderer({
            symbol: new SimpleFillSymbol({
              color: [0, 0, 0, 0],
              outline: {
                color: 'yellow',
                width: 1.25,
              },
            }),
          }),
          labelingInfo: [
            new LabelClass({
              labelExpressionInfo: {
                expression: '$feature.name',
              },
              symbol: new TextSymbol({
                color: 'yellow',
                haloColor: [0, 0, 0, 0.5],
                haloSize: 1.25,
              }),
            }),
          ],
        }),
        cityLimits,
      ],
    }),
    extent: cityLimits.fullExtent.clone(),
    container: 'view-div',
  });

  const url = 'https://cityofvernonia.github.io/vernonia-tax-maps/tax-maps/jpg/4404CB.jpg';

  const mediaLayer = await imageMediaLayer(url, {
    title: 'Georeferenced image',
    copyright: 'Squirrels',
    opacity: 0.4,
  });
  view.map.add(mediaLayer, 0);
  await mediaLayer.when();
  view.goTo(mediaLayer.fullExtent);

  /**
   * Can also be added directly as a Promise which returns a layer.
   */
  // view.map.add(imageMediaLayer(url, {
  //   title: 'Georeferenced image',
  //   copyright: 'Squirrels',
  //   opacity: 0.5,
  // }));

  /**
   * Add via `then()`.
   */
  // imageMediaLayer(url, {
  //   title: 'Georeferenced image',
  //   copyright: 'Squirrels',
  //   opacity: 0.5,
  // }).then((layer: esri.MediaLayer): void => {
  //   view.map.add(layer);
  // });

  const { controlPoints, spatialReference } = await auxiliaryXmlToControlPoints(`${url}.aux.xml`);
  console.log(controlPoints, spatialReference);

  displayControlPoints(mediaLayer, view);

  setTimeout((): void => {
    clearControlPoints(view);
  }, 10000);
};

load();
