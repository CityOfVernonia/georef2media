# georeferenced-media

Tools to display media georeferenced with ArcGIS in a web map.

### Install

```shell
npm i @vernonia/georeferenced-media
```

### Important

`*.aux.xml` files must only contain a single georeference which contains control points. Translation, rotation or multiple georeferences are not supported.

### Use

```typescript
imageMediaLayer(url: string, mediaLayerProperties?: esri.MediaLayerProperties ): Promise<esri.MediaLayer>
```

| Parameter              | Type                      | Notes                                                                                       |
| ---------------------- | ------------------------- | ------------------------------------------------------------------------------------------- |
| `url`                  | string                    | URL of source image for MediaLayer (must have associated `*.aux.xml` file at same location) |
| `mediaLayerProperties` | esri.MediaLayerProperties | Optional MediaLayerProperties for the MediaLayer                                            |

Returns `Promise<esri.MediaLayer>`

```typescript
import { imageMediaLayer } from '@vernonia/georeferenced-media/dist/GeoreferencedMedia';
/**
 * An associated `*.aux.xml` file with georeference data must be available at same location.
 * e.g. https://www.example.com/images/ship-it.jpg.aux.xml
 */
const url = 'https://www.example.com/images/ship-it.jpg';

// in an async function to use media layer
const mediaLayer = await imageMediaLayer(url, {
  title: 'Ship it',
  copyright: 'Squirrel',
  opacity: 0.4,
});
await mediaLayer.when();
view.goTo(mediaLayer.fullExtent);

view.map.add(mediaLayer);

// it's a promise returning a layer so add directly or in `layers` array of map
view.map.add(
  imageMediaLayer(url, {
    title: 'Ship it',
    copyright: 'Squirrel',
    opacity: 0.4,
  }),
);

// as a promise
imageMediaLayer(url, {
  title: 'Ship it',
  copyright: 'Squirrel',
  opacity: 0.4,
}).then((layer: esri.MediaLayer): void => {
  view.map.add(layer);
});
```

### Helpers

```typescript
import {
  auxiliaryXmlToControlPoints,
  displayControlPoints,
  clearControlPoints,
} from '@vernonia/georeferenced-media/dist/GeoreferencedMedia';
```

Parse auxiliary XML and get control points.

```typescript
auxiliaryXmlToControlPoints(url: string): Promise<{ controlPoints: esri.ControlPoint[]; spatialReference: esri.SpatialReference; }>
```

Display media layer control points.

```typescript
displayControlPoints(mediaLayer: esri.MediaLayer, view: esri.MapView): void
```

Clear media layer control points.

```typescript
clearControlPoints(view: esri.MapView): void
```

***

Made with :heart: and :coffee: in Vernonia, Oregon
