import { Component, OnInit, AfterViewInit} from '@angular/core';
import 'jquery';
@Component({
  selector: 'app-categories-carousel',
  templateUrl: './categories-carousel.component.html',
  styleUrls: ['./categories-carousel.component.scss']
})
export class CategoriesCarouselComponent implements OnInit, AfterViewInit {

  items = [
  { title: 'Skirts', img: '../../assets/home/category-image-skirts-pants.png' },
  {  title: 'Dresses', img: '../../assets/home/category-dresses-image.png' },
  {  title: 'Shirts', img: '../../assets/home/category-shirts-image.png' },
  ];

  constructor() { }

  ngOnInit() {

  }
ngAfterViewInit() {


}
}
