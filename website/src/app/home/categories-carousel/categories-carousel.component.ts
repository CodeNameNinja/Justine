import { Component, OnInit, AfterViewInit} from '@angular/core';
import 'jquery';
import { ShopService } from 'src/app/services/shop.service';
@Component({
  selector: 'app-categories-carousel',
  templateUrl: './categories-carousel.component.html',
  styleUrls: ['./categories-carousel.component.scss']
})
export class CategoriesCarouselComponent implements OnInit {

  items = [
  { title: 'Skirts', img: '../../assets/home/category-image-skirts-pants.png', category: 'skirt' },
  {  title: 'Dresses', img: '../../assets/home/category-dresses-image.png', category: 'dress' },
  {  title: 'Shirts', img: '../../assets/home/category-shirts-image.png', category: 'top' },
  ];

  constructor(
    private shopService: ShopService
  ) { }

  ngOnInit() {

  }

  filter(category:string){

    this.shopService.filterCategories.next(category);
  }

}
