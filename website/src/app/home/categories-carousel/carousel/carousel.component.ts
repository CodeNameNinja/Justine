import {
  Directive,
  Component,
  ViewChild,
  ElementRef,
  HostListener,
  OnInit,
  AfterViewInit,
  ViewContainerRef,
  TemplateRef,
  Input,
  forwardRef ,
  ViewChildren,
  QueryList,
  ContentChildren } from '@angular/core';
import { timer } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import {
  animate,
  AnimationBuilder,
  AnimationFactory,
  AnimationPlayer,
  style,
  sequence
} from '@angular/animations';

import { CarouselDirective } from './carousel.directive';

@Directive({
  selector: '.carousel-model'
})
export class CarouselSlideElement {
}

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements AfterViewInit {
  slideWidth;
  slideHeigth;

  @Input() showControls = true;
  @Input() showSelectors = true;
  @Input() timing = '500ms ease-in';

  currentSlide = 0;
  increment = 2;
  offset = 0;
  thumbails: number[] = [];

  noCarousel = false;


  private onTranslation = false;
  private player: AnimationPlayer;
  @ContentChildren(CarouselDirective) slides: QueryList<CarouselDirective>;
  @ViewChild('carousel', { static: false }) private carousel: ElementRef;
  @ViewChild(forwardRef(() => CarouselSlideElement), { static: false, read: ElementRef }) slideElement: ElementRef;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (this.slideWidth && this.slides && this.slides.first) {
      this.resizeCarousel();
    }
  }

  constructor(private builder: AnimationBuilder, private viewContainer: ViewContainerRef) { }

  ngAfterViewInit() {
    timer(0, 200).pipe(takeWhile(() => !this.slideWidth || !this.slides || !this.slides.first)).subscribe(() => {
      const square = this.slideElement.nativeElement.getBoundingClientRect();
      this.slideWidth = square.width;
      if (this.slideWidth && this.slides && this.slides.first) {
        this.resizeCarousel();
      }
    });
  }

  prev() {
    if (!this.noCarousel) {
      this.transitionCarousel(null, this.currentSlide - this.increment);
    }
  }
  next() {
    if (!this.noCarousel) {
      this.transitionCarousel(null, this.currentSlide + this.increment);
    }
  }
  setSlide(slide: number, force: boolean = false) {
    if (this.noCarousel) {
      return;
    }

    if (!force) {
      slide = slide - slide % this.increment;
    }
    this.transitionCarousel(null, slide);

  }

  private resizeCarousel() {

    if (this.carousel) {
      const totalWidth = this.carousel.nativeElement.getBoundingClientRect().width;
      if (totalWidth > this.slides.length * this.slideWidth) {
        this.thumbails = [];
        this.thumbails[0] = 0;
        this.offset = (totalWidth - this.slides.length * this.slideWidth) / 2;
        this.transitionCarousel(0, this.currentSlide);
        this.noCarousel = true;
        return;
      }
      this.noCarousel = false;
      this.increment = Math.floor(totalWidth / this.slideWidth);
      if (this.increment == 0) {
        this.increment = 1;
      }
      this.thumbails = [];
      for (let i = 0; i < this.slides.length / this.increment; i++) {
        this.thumbails[i] = i * this.increment;
      }

      const count = (this.increment * this.slideWidth) < totalWidth ? 1 : 0;
      this.offset = (totalWidth - 3 * (this.increment) * this.slideWidth) / 2 - this.slideWidth * count;

      this.slides.first.viewContainer.clear();
      this.slides.last.viewContainer.clear();

      this.slides.last.viewContainer.createEmbeddedView(this.slides.last.templateRef);
      let addedleft = 0;
      let addedrigth = 0;
      this.slides.forEach((x, index) => {
        if (index && index >= (this.slides.length - this.increment - count)) {
          this.slides.first.viewContainer.createEmbeddedView(x.templateRef);
          addedleft++;
        }
        if (index < this.increment + count) {
          this.slides.last.viewContainer.createEmbeddedView(x.templateRef);
          addedrigth++;
        }
      });
      if (this.increment + 1 >= this.slides.length) {
        this.slides.first.viewContainer.createEmbeddedView(this.slides.first.templateRef, null, 0);
      }

      this.slides.first.viewContainer.createEmbeddedView(this.slides.first.templateRef);
      this.currentSlide = 0;
      this.transitionCarousel(0, this.currentSlide);
    }



  }
  private transitionCarousel(time: any, slide: number) {

    const myAnimation: AnimationFactory = this.buildAnimation(time, slide);
    this.player = myAnimation.create(this.carousel.nativeElement);
    this.currentSlide = (slide >= this.slides.length) ? slide - this.slides.length :
      (slide < 0) ? this.currentSlide = slide + this.slides.length :
        slide;
    this.player.play();
  }

  private buildAnimation(time: any, slide: number) {
    const animation: number = (slide >= this.slides.length) ? 1 : (slide < 0) ? 2 : 0;

    const offsetInitial = (slide >= this.slides.length) ?
      this.offset - this.slideWidth * (this.currentSlide - this.slides.length) :
      0;
    const offsetFinal = (slide < 0) ?
      this.offset - this.slideWidth * (slide + this.slides.length) :
      0;

    const offset = (slide >= this.slides.length) ?
      this.offset - this.slideWidth * (slide - this.slides.length) :
      this.offset - this.slideWidth * slide;

    return animation == 1 ? this.builder.build([
      style({ transform: `translateX(${offsetInitial}px)` }),
      animate(time == null ? this.timing : 0, style({ transform: `translateX(${offset}px)` }))
    ]) : animation == 2 ? this.builder.build(sequence([
      animate(time == null ? this.timing : 0, style({ transform: `translateX(${offset}px)` })),
      style({ transform: `translateX(${offsetFinal}px` })]))
        : this.builder.build([
          animate(time == null ? this.timing : 0, style({ transform: `translateX(${offset}px)` }))
        ]);
  }
}
