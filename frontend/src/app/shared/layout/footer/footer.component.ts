import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  modalDialog: boolean = false;
  requestForCallForm: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  close() {
    this.modalDialog = false;
    this.requestForCallForm = false;
  }

  open() {
    this.requestForCallForm = true
  }

  orderConsultation() {
    this.requestForCallForm = false;
    this.modalDialog = true;
  }
}
