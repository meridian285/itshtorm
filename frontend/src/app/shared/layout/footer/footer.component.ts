import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  type = '';
  selectedPoint = '';
  isDialogOpen = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  open(type: string) {
    this.type = type;
    this.isDialogOpen = true;
  }
}
