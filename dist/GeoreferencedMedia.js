import { __awaiter } from "tslib";
import { XMLParser } from 'fast-xml-parser';
import { Point, SpatialReference } from '@arcgis/core/geometry';
import MediaLayer from '@arcgis/core/layers/MediaLayer';
import ControlPointsGeoreference from '@arcgis/core/layers/support/ControlPointsGeoreference';
import ImageElement from '@arcgis/core/layers/support/ImageElement';
import Graphic from '@arcgis/core/Graphic';
import { SimpleMarkerSymbol } from '@arcgis/core/symbols';
let _displayControlPoints = [];
/**
 * Convert a `Blob` to an object URL.
 * @param blob `Blob` to convert
 * @returns object URL string
 */
const blobToObjectUrl = (blob) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
});
/**
 * Chunk array into array of arrays with two numbers each.
 * @param input Array of numbers
 * @returns Array of arrays with two numbers
 */
const chunkArray = (input) => {
    const output = [];
    for (let i = 0; i < input.length; i += 2) {
        output.push(input.slice(i, i + 2));
    }
    return output;
};
/**
 * Create a `HTMLImageElement` from object URL string.
 * @param objectUrl Object URL string of image
 * @returns `HTMLImageElement`
 */
const objectUrlToImage = (objectUrl) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = objectUrl;
        image.onload = () => {
            resolve(image);
        };
        image.onerror = reject;
    });
});
/**
 * Parse auxiliary XML file for georeference information.
 * @param url URL of `*.aux.xml` file with georeference information
 * @returns Object with array of control points and associated spatial reference
 */
export const auxiliaryXmlToControlPoints = (url) => __awaiter(void 0, void 0, void 0, function* () {
    // fetch georeference xml
    const xml = yield (yield fetch(url)).text();
    // parse xml to json
    const xml2json = new XMLParser().parse(xml);
    // find `Metadata` object with georeference information
    const geoData = xml2json.PAMDataset.Metadata.find((data) => {
        return Object.prototype.hasOwnProperty.call(data, 'GeodataXform');
    }).GeodataXform;
    // spatial reference of target points
    const spatialReference = new SpatialReference({ wkid: geoData.SpatialReference.WKID });
    // array of source points, i.e. [pnt_1_x, pnt_1_y, pnt_2_x, pnt_2_y...]
    // xml parser will stringify numbers with precision greater than 16 so convert strings to numbers
    const sourceArray = geoData.SourceGCPs.Double.map((value) => {
        return typeof value === 'number' ? value : parseFloat(value);
    });
    // array of target points, i.e. [pnt_1_x, pnt_1_y, pnt_2_x, pnt_2_y...]
    // xml parser will stringify numbers with precision greater than 16 so convert strings to numbers
    const targetArray = geoData.TargetGCPs.Double.map((value) => {
        return typeof value === 'number' ? value : parseFloat(value);
    });
    // chunk source and target points into arrays of [pnt_x, pnt_y]
    const sourceCoordinates = chunkArray(sourceArray);
    const targetCoordinates = chunkArray(targetArray);
    // create control points
    const controlPoints = sourceCoordinates.map((source, index) => {
        const target = targetCoordinates[index];
        return {
            mapPoint: new Point({
                x: target[0],
                y: target[1],
                spatialReference,
            }),
            // note: source point y needs to be reversed from georeferenced xml
            sourcePoint: { x: source[0], y: -source[1] },
        };
    });
    return {
        controlPoints,
        spatialReference,
    };
});
/**
 * Create image media layer.
 * @param url URL of source image for MediaLayer (must have associated `*.aux.xml` file at same location)
 * @param mediaLayerProperties Optional MediaLayerProperties for the MediaLayer
 * @returns Promise resolving the MediaLayer
 */
export const imageMediaLayer = (url, mediaLayerProperties) => __awaiter(void 0, void 0, void 0, function* () {
    // control points and spatial reference from `*.aux.xml` file
    const { controlPoints, spatialReference } = yield auxiliaryXmlToControlPoints(`${url}.aux.xml`);
    // fetch image
    const blob = yield (yield fetch(url)).blob();
    // convert to object URL
    const imageUrl = yield blobToObjectUrl(blob);
    // create HTMLImageElement for dimensions and to pass to ImageElement
    const image = yield objectUrlToImage(imageUrl);
    return new MediaLayer(Object.assign(Object.assign({}, mediaLayerProperties), {
        source: [
            new ImageElement({
                image,
                georeference: new ControlPointsGeoreference({
                    controlPoints,
                    width: image.width,
                    height: image.height,
                }),
            }),
        ],
        spatialReference,
    }));
});
/**
 * Display media layer control points.
 * @param mediaLayer Media layer of interest
 * @param view View to display points in
 */
export const displayControlPoints = (mediaLayer, view) => {
    if (!mediaLayer.source || !mediaLayer.source.elements.length)
        return;
    mediaLayer.source.elements.getItemAt(0)
        .georeference.controlPoints.forEach((controlPoint) => {
        var _a;
        const graphic = new Graphic({
            geometry: (_a = controlPoint.mapPoint) === null || _a === void 0 ? void 0 : _a.clone(),
            symbol: new SimpleMarkerSymbol({
                color: 'blue',
                size: 9,
                style: 'circle',
                outline: {
                    color: 'white',
                    width: 1,
                },
            }),
        });
        view.graphics.add(graphic);
        _displayControlPoints.push(graphic);
    });
};
/**
 * Clear displayed media layer control points.
 * @param view View with media layer control points display in
 */
export const clearControlPoints = (view) => {
    view.graphics.removeMany(_displayControlPoints);
    _displayControlPoints = [];
};
