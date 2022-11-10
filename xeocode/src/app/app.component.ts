import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { DataService } from './services/data/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  @ViewChild('barLinesGroup') barLinesGroup: ElementRef<SVGGElement> | undefined
  @ViewChild('chartSvg') chartSvg: ElementRef<SVGElement> | undefined

  /**
   *  chart settings
   */
  chartSettings = {
    xPerDatum: 5,
    barWidth: 4,
    viewbox: {
      left: -100,
      top: -100,
      width: 200,
      height: 120,
    }
  }

  constructor(
    public dataService: DataService,
  ) {
    (window as any).chart = this
  }

  ngAfterViewInit() {
    this.keepUpdatingChart()
  }


  keepUpdatingChart() {
    this.dataService.records$.subscribe(records => {
      if (records.length === 0) { return }
      const lastRecord = records[records.length -1]
      const lastRecordDataCount = lastRecord.data.length

      const x = records.length * this.chartSettings.xPerDatum
      const height = lastRecordDataCount / 10

      const dataLine = this.createDataLine(x, height)
      this.barLinesGroup?.nativeElement.appendChild(dataLine)

      this.chartSettings.viewbox.left += this.chartSettings.xPerDatum
      this.updateViewBox()

    })
  }

  /**
   *  create line element for data point
   */
  createDataLine(x: number, height: number) {
    const lineElement = createLineElement({
      startX: x,
      endX: x,
      startY: 0,
      endY: -height,
      strokeColor: 'lime',
      strokeWidth: 4,
    })
    return lineElement
  }

  updateViewBox() {
    const viewBox = `${this.chartSettings.viewbox.left} ${this.chartSettings.viewbox.top} ${this.chartSettings.viewbox.width} ${this.chartSettings.viewbox.height}`
    this.chartSvg?.nativeElement.setAttribute('viewBox', viewBox)
  }

}

export function createLineElement(input: {
  startX: number
  endX: number
  startY: number
  endY: number
  strokeWidth: number
  strokeColor: string
  lineCap?: string
  strokeOpacity?: number
  dash?: string
}) {
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  line.setAttribute('x1', input.startX + '')
  line.setAttribute('x2', input.endX + '')
  line.setAttribute('y1', input.startY + '')
  line.setAttribute('y2', input.endY + '')
  line.setAttribute('stroke', input.strokeColor || 'red')
  line.setAttribute('stroke-width', input.strokeWidth + '' || '1')
  line.setAttribute('stroke-linecap', input.lineCap || 'butt')
  line.setAttribute('stroke-opacity', input.strokeOpacity + '' || '1')
  line.setAttribute('stroke-dasharray', input.dash || '')
  return line
}
