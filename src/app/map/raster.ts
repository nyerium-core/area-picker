import LineString from 'ol/geom/LineString';
import Feature from 'ol/Feature';
import VectorSource from 'ol/source/Vector';
import Map from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';

export class Raster {
  private maxY = 20000000;
  private minY = -20000000;
  private minX = -90000000;
  private maxX = 90000000;
  private readonly source: VectorSource;
  private readonly layer: VectorLayer;

  private visible = false;

  constructor(public map: Map) {
    this.source = new VectorSource({wrapX: false});

    this.layer = new VectorLayer({
      source: this.source
    });
    this.map.addLayer(this.layer);

    this.map.on('rendercomplete', this.onRenderComplete.bind(this));
  }

  private get currentZoomLevel(): number {
    return this.map.getView().getZoom();
  }

  private onRenderComplete(event) {
    this.isVisible = this.currentZoomLevel > 4;
  }

  public get isVisible(): boolean {
    return this.source.getFeatures().length > 0;
  }

  public set isVisible(value: boolean) {
    if (this.isVisible === value) {
      return;
    }
    if (value) {
      this.draw();
    } else {
      this.source.clear();
    }
  }

  private draw() {
    this.visible = true;
    this.drawVerticalLines();
    this.drawHorizontalLines();
  }

  private drawLine(start: [number, number], end: [number, number]) {
    const feature = new Feature({
      geometry: new LineString([start, end])
    });
    this.source.addFeature(feature);
  }

  private drawVerticalLines() {
    const stepSize = 100000;
    for (let i = this.minX; i < this.maxX; i = i + stepSize) {
      this.drawLine([i, this.minY], [i, this.maxY]);
    }
  }

  private drawHorizontalLines() {
    const stepSize = 100000;
    for (let i = this.minY; i < this.maxY; i = i + stepSize) {
      this.drawLine([this.minX, i], [this.maxX, i]);
    }
  }
}