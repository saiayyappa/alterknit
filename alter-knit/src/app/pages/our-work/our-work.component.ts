import { Component, OnInit } from '@angular/core';

import { HeaderTheme } from 'src/app/common/interfaces/header-theme';

interface SweaterInfo {
  id: number;
  brand: string;
  material: string;
  customer: string;
  workCompleted: string;
  imagePath: string;
  enlargedImagePath: string;
}
@Component({
  selector: 'app-our-work',
  templateUrl: './our-work.component.html',
  styleUrls: ['./our-work.component.css'],
})
export class OurWorkComponent implements OnInit {
  isHover: number;

  constructor() {
    this.isHover = -1;
  }

  headerThemes = HeaderTheme;

  selectedSweater!: SweaterInfo;

  print(i: any) {
    console.log(i);
  }
  sweaters: SweaterInfo[] = [
    {
      id: 1,
      brand: 'Ralph Lauren',
      material: 'Cashmere',
      customer: 'Adam T., Short Hills, NJ',
      workCompleted: '2022',
      imagePath: '../../../assets/images/sweater-collection/1.png',
      enlargedImagePath:
        '../../../assets/images/sweater-collection-enlarged/1e.png',
    },
    {
      id: 2,
      brand: 'Chanel',
      material: 'Cashmere',
      customer: 'Michelle B. New York, NY  2022',
      workCompleted: '2022',
      imagePath: '../../../assets/images/sweater-collection/2.png',
      enlargedImagePath:
        '../../../assets/images/sweater-collection-enlarged/2e.png',
    },
    {
      id: 3,
      brand: 'Dear Cashmere',
      material: 'Cashmere',
      customer: 'Thomas B., Long Beach, CA',
      workCompleted: '2022',
      imagePath: '../../../assets/images/sweater-collection/3.png',
      enlargedImagePath:
        '../../../assets/images/sweater-collection-enlarged/3e.png',
    },
    {
      id: 4,
      brand: 'Marimekko',
      material: 'Wool',
      customer: 'Aletta S.,Chevy Chase, MD',
      workCompleted: '2022',
      imagePath: '../../../assets/images/sweater-collection/4.png',
      enlargedImagePath:
        '../../../assets/images/sweater-collection-enlarged/4e.png',
    },
    {
      id: 5,
      brand: 'Gucci',
      material: 'Cashmere',
      customer: 'Natsuki, K. Rye, NY',
      workCompleted: '2022',
      imagePath: '../../../assets/images/sweater-collection/5.png',
      enlargedImagePath:
        '../../../assets/images/sweater-collection-enlarged/5e.png',
    },
    {
      id: 6,
      brand: 'Britches',
      material: 'Wool',
      customer: 'Suzanne M. Silver Springs, MD',
      workCompleted: '2022',
      imagePath: '../../../assets/images/sweater-collection/6.png',
      enlargedImagePath:
        '../../../assets/images/sweater-collection-enlarged/6e.png',
    },
    {
      id: 7,
      brand: 'Wyett',
      material: 'Wool',
      customer: 'Francine K., New York, NY',
      workCompleted: '2021',
      imagePath: '../../../assets/images/sweater-collection/7.png',
      enlargedImagePath:
        '../../../assets/images/sweater-collection-enlarged/7e.png',
    },
    {
      id: 8,
      brand: 'Woolovers',
      material: 'Wool',
      customer: 'David B. Leavenworth, KS',
      workCompleted: '2022',
      imagePath: '../../../assets/images/sweater-collection/8.png',
      enlargedImagePath:
        '../../../assets/images/sweater-collection-enlarged/8e.png',
    },
    {
      id: 9,
      brand: 'Patagonia',
      material: 'Cashmere',
      customer: 'Evan S. Charlotte, NC',
      workCompleted: '2022',
      imagePath: '../../../assets/images/sweater-collection/9.png',
      enlargedImagePath:
        '../../../assets/images/sweater-collection-enlarged/9e.png',
    },
    {
      id: 10,
      brand: 'Reese',
      material: 'Cashmere',
      customer: 'Tina I. New York, NY',
      workCompleted: '2021',
      imagePath: '../../../assets/images/sweater-collection/10.png',
      enlargedImagePath:
        '../../../assets/images/sweater-collection-enlarged/10e.png',
    },
    {
      id: 11,
      brand: 'Theory',
      material: 'Cashmere',
      customer: 'Beth K. New York, NY',
      workCompleted: '2022',
      imagePath: '../../../assets/images/sweater-collection/11.png',
      enlargedImagePath:
        '../../../assets/images/sweater-collection-enlarged/11e.png',
    },
    {
      id: 12,
      brand: 'Prada',
      material: 'Cashmere',
      customer: 'Dane D. Brooklyn, NY',
      workCompleted: '2022',
      imagePath: '../../../assets/images/sweater-collection/12.png',
      enlargedImagePath:
        '../../../assets/images/sweater-collection-enlarged/12e.png',
    },
    {
      id: 13,
      brand: 'Unknown',
      material: 'Cashmere',
      customer: 'Joseph G., Ithaca, NY',
      workCompleted: '2022',
      imagePath: '../../../assets/images/sweater-collection/13.png',
      enlargedImagePath:
        '../../../assets/images/sweater-collection-enlarged/13e.png',
    },
    {
      id: 14,
      brand: 'Vince',
      material: 'Cashmere',
      customer: 'Jen V. Greenwich, CT',
      workCompleted: '2022',
      imagePath: '../../../assets/images/sweater-collection/14.png',
      enlargedImagePath:
        '../../../assets/images/sweater-collection-enlarged/14e.png',
    },
    {
      id: 15,
      brand: 'Cotelac',
      material: 'Cashmere',
      customer: 'Dianna G.,Columbus, OH',
      workCompleted: '2021',
      imagePath: '../../../assets/images/sweater-collection/15.png',
      enlargedImagePath:
        '../../../assets/images/sweater-collection-enlarged/15e.png',
    },
  ];
  viewerOpen: boolean = false;
  ngOnInit(): void {}

  showViewer(item: SweaterInfo) {
    console.log(item);
    this.selectedSweater = item;
    this.viewerOpen = true;
  }

  close() {
    this.viewerOpen = false;
  }
}
