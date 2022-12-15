import esri = __esri;

interface _ControlPoint {
  mapPoint: esri.Point;
  sourcePoint: {
    x: number;
    y: number;
  };
}

import { XMLParser } from 'fast-xml-parser';
import { Point, SpatialReference } from '@arcgis/core/geometry';

export const parseGeoXML = async (): Promise<void> => {
  // fetch georeference xml
  const xml = await (
    await fetch('https://cityofvernonia.github.io/vernonia-tax-maps/tax-maps/tiff/4403.tiff.aux.xml')
  ).text();

  // parse xml to json
  const xml2json = new XMLParser().parse(xml);

  // find `Metadata` object with georeference information
  const geoData = (xml2json.PAMDataset.Metadata as Array<any>).find((data: any): boolean => {
    return Object.prototype.hasOwnProperty.call(data, 'GeodataXform');
  }).GeodataXform;

  // spatial reference of target points
  const spatialReference = new SpatialReference({ wkid: geoData.SpatialReference.WKID });

  // array of source points, i.e. [pnt_1_x, pnt_1_y, pnt_2_x, pnt_2_y...]
  // xml parser will stringify numbers with precision greater than 16 so convert strings to numbers
  const sourceArray = (geoData.SourceGCPs.Double as Array<number | string>).map((value: number | string): number => {
    return typeof value === 'number' ? value : parseFloat(value);
  });

  // array of target points, i.e. [pnt_1_x, pnt_1_y, pnt_2_x, pnt_2_y...]
  // xml parser will stringify numbers with precision greater than 16 so convert strings to numbers
  const targetArray = (geoData.TargetGCPs.Double as Array<number | string>).map((value: number | string): number => {
    return typeof value === 'number' ? value : parseFloat(value);
  });

  // chunk source and target points into arrays of [pnt_x, pnt_y]
  const sourceCoordinates = [];
  const targetCoordinates = [];
  for (let i = 0; i < sourceArray.length; i += 2) {
    sourceCoordinates.push(sourceArray.slice(i, i + 2));
  }
  for (let i = 0; i < targetArray.length; i += 2) {
    targetCoordinates.push(targetArray.slice(i, i + 2));
  }

  const controlPoints: _ControlPoint[] = [];

  console.log(sourceCoordinates, targetCoordinates);

  for 
};

const x = {
  PAMDataset: {
    SRS: 'PROJCS["NAD_1983_2011_Oregon_Statewide_Lambert_Ft_Intl",GEOGCS["GCS_NAD_1983_2011",DATUM["NAD_1983_2011",SPHEROID["GRS_1980",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Lambert_Conformal_Conic_2SP"],PARAMETER["False_Easting",1312335.958005249],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",-120.5],PARAMETER["Standard_Parallel_1",43.0],PARAMETER["Standard_Parallel_2",45.5],PARAMETER["Latitude_Of_Origin",41.75],UNIT["Foot",0.3048],AUTHORITY["EPSG","6557"]]',
    Metadata: [
      {
        MDI: 'NEAREST',
      },
      {
        GeodataXform: {
          PolynomialOrder: 1,
          SpatialReference: {
            WKT: 'PROJCS["NAD_1983_2011_Oregon_Statewide_Lambert_Ft_Intl",GEOGCS["GCS_NAD_1983_2011",DATUM["D_NAD_1983_2011",SPHEROID["GRS_1980",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Lambert_Conformal_Conic"],PARAMETER["False_Easting",1312335.958005249],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",-120.5],PARAMETER["Standard_Parallel_1",43.0],PARAMETER["Standard_Parallel_2",45.5],PARAMETER["Latitude_Of_Origin",41.75],UNIT["Foot",0.3048],AUTHORITY["EPSG",6557]]',
            XOrigin: -118489100,
            YOrigin: -97381100,
            XYScale: 37592196.316242374,
            ZOrigin: -100000,
            ZScale: 10000,
            MOrigin: -100000,
            MScale: 10000,
            XYTolerance: 0.0032808398950131233,
            ZTolerance: 0.001,
            MTolerance: 0.001,
            HighPrecision: true,
            WKID: 102970,
            LatestWKID: 6557,
          },
          SourceGCPs: {
            Double: [
              16.003273954722772,
              '0.63205331346944149',
              16.711777884308077,
              16.359192686395545,
              3.163146810021189,
              1.8083613362609867,
              '3.6168474157483672',
              15.530543575295269,
              '8.3940191805691118',
              16.700498478159716,
              3.2241326298176083,
              10.549609354405675,
            ],
          },
          TargetGCPs: {
            Double: [
              '635883.59383201599',
              1505281.1492782086,
              '636166.83989500999',
              1511639.6479658782,
              '630691.89140419662',
              1505753.6568241415,
              '630873.10334645212',
              1511302.1312336028,
              632803.4370482564,
              1511774.8405396342,
              '630714.34691207111',
              '1509288.6498717221',
            ],
          },
          Name: '',
        },
      },
    ],
  },
};
