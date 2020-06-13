import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {


  vehiclesQueueLength: number;

  constructor(private db: AngularFireDatabase) {
    this.db.list('Queue').query.once('value').then(data => {
      this.vehiclesQueueLength = data.numChildren();
    });
  }

  addVehiculeToQueueFirebase(vehicle: string) {
    this.db.list('Queue').push({ id: this.vehiclesQueueLength, name: vehicle});
    this.vehiclesQueueLength += 1;
  }

  generateEmptyParkingLot() {
    this.db.object('ParkingLot').remove();
    const parkingLot = [];
    for (let i = 0; i < 3; i++) {
        parkingLot.push({empty: true, type: 'small', vehicle: { id: -1, name: ''}});
    }
    for (let i = 0; i < 3; i++) {
      parkingLot.push({empty: true, type: 'medium', vehicle: { id: -1, name: ''}});
    }
    for (let i = 0; i < 4; i++) {
      parkingLot.push({empty: true, type: 'large', vehicle: { id: -1, name: ''}});
    }
    this.db.object('ParkingLot').set(parkingLot);
  }

  getParkingLot(): Observable<any> {
    let parkingLotList: Observable<any>;
    parkingLotList = this.db.object('ParkingLot').valueChanges();
    return parkingLotList;
  }

  getQueue(): Observable<any[]> {
    let vehiclesQueue: Observable<any[]>;
    vehiclesQueue = this.db.list('Queue').snapshotChanges().pipe(
      map(changes =>
        changes.map(data => ({ key: data.payload.key, vehicle: data.payload.val()}))
      )
    );
    return vehiclesQueue;
  }

  updateParkingLot(parkingLot: any[]) {
    this.db.object('ParkingLot').set(parkingLot);
  }

  deleteFromQueue(vehicleKey: string) {
    this.db.list('Queue').remove(vehicleKey);
  }
}
