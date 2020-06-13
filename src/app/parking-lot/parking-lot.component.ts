import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';


@Component({
  selector: 'app-parking-lot',
  templateUrl: './parking-lot.component.html',
  styleUrls: ['./parking-lot.component.scss']
})
export class ParkingLotComponent implements OnInit {

  parkingLot: any[] = [
    { empty: true, vehicle: { name: '' } },
    { empty: true, vehicle: { name: '' } },
    { empty: true, vehicle: { name: '' } },
    { empty: true, vehicle: { name: '' } },
    { empty: true, vehicle: { name: '' } },
    { empty: true, vehicle: { name: '' } },
    { empty: true, vehicle: { name: '' } },
    { empty: true, vehicle: { name: '' } },
    { empty: true, vehicle: { name: '' } },
    { empty: true, vehicle: { name: '' } }];
  Queue: any[];

  constructor(private firebase: FirebaseService) {
    this.loadInitialData();
  }

  ngOnInit() {
  }

  loadInitialData() {

    this.firebase.getQueue().subscribe((listVehicles: any) => {
        this.Queue = listVehicles;
        setTimeout(() => {
          this.moveFromQueueToParkingLot();
        }, 500);
    });

    this.firebase.getParkingLot().subscribe(((parkinlotFirebase) => {
      this.parkingLot = parkinlotFirebase;
      if (this.Queue !== undefined && parkinlotFirebase !== null) {
        setTimeout(() => {
          this.moveFromQueueToParkingLot();
        }, 1000);
      }
    }));

  }

  moveFromQueueToParkingLot() {
    const sizeQueue = this.Queue.length;
    if (sizeQueue > 0) {
      const firstVehicle = this.Queue[0];
      const avalibleSpace = this.emptySpace(firstVehicle);
      if (avalibleSpace !== -1) {
        this.parkingLot[avalibleSpace].empty = false;
        this.parkingLot[avalibleSpace].vehicle.id = firstVehicle.vehicle.id;
        this.parkingLot[avalibleSpace].vehicle.name = firstVehicle.vehicle.name;
        this.deleteFromQueue(firstVehicle.key);
        this.updateParkingLot();

      }
    }
  }

  getTypes(type: string): string[] {
    const types: string[] = [];

    if (type === 'motorcycle') {
      types.push('small');
      types.push('medium');
      types.push('large');
    }

    if (type === 'sedan') {
      types.push('medium');
      types.push('large');
    }

    if (type === 'truck') {
      types.push('large');
    }

    return types;
  }


  emptySpace(vehicle: any): number {
    let avalibleSpace = -1;
    const types: string[] = this.getTypes(vehicle.vehicle.name);
    let i = 0;
    let found = false;
    const size = this.parkingLot.length;
    while (i < size && !found) {
      if (this.parkingLot[i].empty === true && types.indexOf(this.parkingLot[i].type) > -1) {
        avalibleSpace = i;
        found = true;
      }
      i++;
    }
    return avalibleSpace; // if there isn't an avalible space return null
  }

  isFirst( index: number) {
    if (index === 0) {
      return true;
    }
    return false;
  }

  addVehicleToQueue(vehicle: string) {
    this.firebase.addVehiculeToQueueFirebase(vehicle);
  }

  updateParkingLot() {
    this.firebase.updateParkingLot(this.parkingLot);
  }

  deleteFromQueue(vehicleKey: string) {
    this.firebase.deleteFromQueue(vehicleKey);
  }

  deleteParkingLot() {
    this.firebase.generateEmptyParkingLot();
  }

  deleteVehicleParkingLot() {
    let randomSpace = Math.floor(Math.random() * 10);
    while (this.parkingLot[randomSpace].empty) {
      randomSpace = Math.floor(Math.random() * 10);
    }
    this.parkingLot[randomSpace].empty = true;
    this.parkingLot[randomSpace].vehicle.id = -1;
    this.parkingLot[randomSpace].vehicle.name = '';

    setTimeout(() => {
      this.updateParkingLot();
    }, 1000);
  }




}
