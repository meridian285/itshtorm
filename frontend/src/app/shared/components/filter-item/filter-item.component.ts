import {Component, Input, OnInit} from '@angular/core';
import {CategoriesType} from "../../../types/categories.type";

@Component({
  selector: 'filter-item',
  templateUrl: './filter-item.component.html',
  styleUrls: ['./filter-item.component.scss']
})
export class FilterItemComponent implements OnInit {

  @Input() sortingOption!: CategoriesType;
  constructor() { }

  ngOnInit(): void {

  }

}
