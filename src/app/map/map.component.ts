import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import Map from 'ol/Map.js';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import ScaleLine from 'ol/control/ScaleLine';
import {Raster} from './raster';
import {PolygonDraw} from './polygon-draw';
import {SelectedAreas} from './selected-areas';
import {Square} from './square';
import {MarsNationService} from '../smart-contract/mars-nation.service';
import {OwnedAreas} from './owned-areas';
import {Tiles} from './tiles-selection';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  private map: Map;
  private tilesUrl = Tiles.surfaceTexture;

  private raster: Raster;
  private polygonDraw: PolygonDraw;
  private selectedAreas: SelectedAreas;
  private ownedAreas: OwnedAreas;


  @Output()
  public onAreasSelected = new EventEmitter<Array<Square>>();

  constructor(private marsNation: MarsNationService) {
  }

  ngOnInit() {
    this.initMap();
    this.displayAlreadyOwnerFeatures();
  }

  private initMap() {
    const scaleLine = new ScaleLine();
    this.map = new Map({
      target: 'olmap',
      layers: [
        new TileLayer({
          source: new XYZ({
            url: this.tilesUrl
          })
        })
      ],
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });
    this.map.addControl(scaleLine);

    this.raster = new Raster(this.map);
    this.polygonDraw = new PolygonDraw((this.map));
    this.ownedAreas = new OwnedAreas(this.map);
    this.selectedAreas = new SelectedAreas(this.map);
    this.polygonDraw.onPolygonDrawn.subscribe(feature => {
      const squares = this.selectedAreas.select(feature);
      this.onAreasSelected.emit(squares);
    });
  }

  private displayAlreadyOwnerFeatures() {
    const squares = this.marsNation.getOwnedSquares();
    this.ownedAreas.select(squares);
  }

  public enableSelection() {
    this.polygonDraw.enabled = true;
  }
}
