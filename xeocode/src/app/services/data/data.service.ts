import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subject } from 'rxjs';
import { Datum, Record } from './data.interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  /**
   *   a stream of single records with 0-1000 datum
   */
  records$ = new BehaviorSubject<Record[]>([])

  /**
   *   state, to be refactorecd into observable chaing
   */
  intervalMs: number = 1000
  records: Record[] = []


  constructor() {
    (window as any).data = this
    this.keepPollingForRecords()
  }

  /**
   *   User interaction: change the interval
   */
  onIntervalChange(intervalMs: number) {
    this.intervalMs = intervalMs
  }

  /**
   *    At a regular interval of 1 seconds, we fetch/generate a record
   *    and append it to our state array
   */
  keepPollingForRecords() {
    
    setTimeout(() => {
      const record = this.createRandomRecord()
      this.records.push(record)
      this.records$.next(this.records)
      this.keepPollingForRecords()
    }, this.intervalMs)
  }

  /**
   *   Create 1 Record with 0-1000 Datum
   */
   createRandomRecord() {
    const record: Record = { data: [] }
    const count = Math.round(Math.random() * 1000)
    for (let i = 0; i < count; i++) {
      const nowEpoch = new Date().getTime()
      const datum: Datum = {
        value: `value-${i}`,
        key: `key-${i}`,
        timestamp: nowEpoch,
      }
      record.data.push(datum)
    }
    return record
  }

}
