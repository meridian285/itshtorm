import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {RequestService} from "../../services/request.service";
import {DefaultResponseType} from "../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormBuilder, Validators} from "@angular/forms";
import {ModalStateService} from "../../services/modal-state.service";
import {Observable} from "rxjs";

@Component({
  selector: 'modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.scss']
})
export class ModalDialogComponent implements OnInit {

  @ViewChild('selectedService') selectedService: ElementRef | null = null;
  @Input() selectedPoint: string = '';
  @Input() type: string = '';
  thankYouForm: boolean = false;
  isOpenModal$!: Observable<boolean>;
  // isOpenModal$:

  requestForm = this.fb.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required]],
  });


  constructor(private requestService: RequestService,
              private _snackBar: MatSnackBar,
              private fb: FormBuilder,
              private modalStateService: ModalStateService) {
  }

  ngOnInit(): void {
    this.isOpenModal$ = this.modalStateService.isOpenModal$;
    // if (this.selectedService) {
    //   this.selectedService.nativeElement.value = this.selectedPoint;
    // }
  }

  close() {
    this.modalStateService.isOpenModal = false;
    this.thankYouForm = false;
  }

  sendRequest() {
    if (this.requestForm && this.requestForm.value.name && this.requestForm.value.phone) {
      this.modalStateService.isOpenModal = true;
      this.thankYouForm = false;

      this.requestService.request(this.requestForm.value.name, this.requestForm.value.phone, this.selectedPoint, this.type)
        .subscribe((data: DefaultResponseType) => {
          console.log('this.selectedPoint', this.selectedPoint);
          if ((data as DefaultResponseType).error !== undefined) {
            const error = (data as DefaultResponseType).message;
            this._snackBar.open(error);
            throw new Error(error);
          }

          this._snackBar.open(data.message);
        })
    }
  }
}
