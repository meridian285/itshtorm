import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {RequestService} from "../../services/request.service";
import {DefaultResponseType} from "../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.scss']
})
export class ModalDialogComponent implements OnInit, OnChanges {

  @ViewChild('selectedService') selectedService: ElementRef | null = null;
  @Input() selectedPoint: string = '';
  @Input() type: string = '';

  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();

  thankYouForm: boolean = false;
  value='';
  counter = 0;

  requestForm = this.fb.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    service: ['', [Validators.required]],
    type: ['', [Validators.required]],
  });


  constructor(private requestService: RequestService,
              private _snackBar: MatSnackBar,
              private fb: FormBuilder,
              private cd: ChangeDetectorRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedPoint'] && this.selectedPoint) {
      this.requestForm.patchValue({service: this.selectedPoint});
    }
  }

  ngOnInit(): void {
  }

  close(): void {
    this.thankYouForm = false;
    this.requestForm.reset();
    this.closed.emit();
  }

  sendRequest(): void {
    if (this.type === 'order') {
      if (this.requestForm && this.requestForm.value.name && this.requestForm.value.phone && this.requestForm.value.service && this.type) {

        this.requestService.requestOrder(this.requestForm.value.name, this.requestForm.value.phone, this.selectedPoint, this.type)
          .subscribe((data: DefaultResponseType) => {
            if ((data as DefaultResponseType).error !== undefined) {
              const error = (data as DefaultResponseType).message;
              this._snackBar.open(error);
              throw new Error(error);
            }

            this._snackBar.open(data.message);
          })

        this.isOpen = false;
        this.thankYouForm = true;
        this.requestForm.reset();
      }
    } else if (this.type === 'consultation') {
      if (this.requestForm && this.requestForm.value.name && this.requestForm.value.phone && this.type) {
        this.requestService.requestConsultation(this.requestForm.value.name, this.requestForm.value.phone, this.type)
          .subscribe((data: DefaultResponseType) => {
            if ((data as DefaultResponseType).error !== undefined) {
              const error = (data as DefaultResponseType).message;
              this._snackBar.open(error);
              throw new Error(error);
            }

            this._snackBar.open(data.message);
          })

        this.isOpen = false;
        this.thankYouForm = true;
        this.requestForm.reset();
      }
    }
  }

  get name() {
    return this.requestForm.get('name');
  }

  get phone() {
    return this.requestForm.get('phone');
  }
}
