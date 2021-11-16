import { Component, OnInit } from '@angular/core';
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
  styleUrls: ['./our-work.component.css']
})

export class OurWorkComponent implements OnInit {

  constructor() { }

  selectedSweater!: SweaterInfo;

  sweaters: SweaterInfo[] = [
    {
      id: 1,
      brand: 'Balmain',
      material: 'Cashmere',
      customer: 'Farrah G., New York, NY',
      workCompleted: '2021',
      imagePath: '../../../assets/images/sweater-collection/1.png',
      enlargedImagePath: '../../../assets/images/sweater-collection-enlarged/1.png',
    },
    {
      id: 2,
      brand: 'J Crew x Creatures of the Wind',
      material: 'merino wool',
      customer: 'Kendall F, Ft. Myers, FL',
      workCompleted: '2018',
      imagePath: '../../../assets/images/sweater-collection/2.png',
      enlargedImagePath: '../../../assets/images/sweater-collection-enlarged/2.png',
    },
    {
      id: 3,
      brand: 'Johnstons of Elgin',
      material: 'Cashmere',
      customer: 'Clary McCall, Asheville, NC',
      workCompleted: '2019',
      imagePath: '../../../assets/images/sweater-collection/3.png',
      enlargedImagePath: '../../../assets/images/sweater-collection-enlarged/3.png',
    },
    {
      id: 4,
      brand: 'The Fisher Project',
      material: 'Alpaca wool blend',
      customer: 'Alyson V., New York, NY',
      workCompleted: '2017',
      imagePath: '../../../assets/images/sweater-collection/4.png',
      enlargedImagePath: '../../../assets/images/sweater-collection-enlarged/4.png',
    },
    {
      id: 5,
      brand: 'Bergdorf Goodman',
      material: 'Cashmere',
      customer: 'Ken, S., Jersey City, NJ',
      workCompleted: '2018',
      imagePath: '../../../assets/images/sweater-collection/5.png',
      enlargedImagePath: '../../../assets/images/sweater-collection-enlarged/5.png',
    },
    {
      id: 6,
      brand: 'Autumn Cashmere',
      material: 'Cashmere',
      customer: 'Lisa F., Berwyn, PA',
      workCompleted: '2020',
      imagePath: '../../../assets/images/sweater-collection/6.png',
      enlargedImagePath: '../../../assets/images/sweater-collection-enlarged/6.png',
    },
    {
      id: 7,
      brand: 'J crew',
      material: 'Wool blend',
      customer: 'Melissa B., Phoenix, AZ',
      workCompleted: '2019',
      imagePath: '../../../assets/images/sweater-collection/7.png',
      enlargedImagePath: '../../../assets/images/sweater-collection-enlarged/7.png',
    },
    {
      id: 8,
      brand: 'Michael Kors',
      material: 'merino wool',
      customer: 'Shane Y., Clovis, NM',
      workCompleted: '2015',
      imagePath: '../../../assets/images/sweater-collection/8.png',
      enlargedImagePath: '../../../assets/images/sweater-collection-enlarged/8.png',
    },
    {
      id: 9,
      brand: 'H&M',
      material: 'Cashmere',
      customer: 'Mari D., Brooklyn, NY',
      workCompleted: '2017',
      imagePath: '../../../assets/images/sweater-collection/9.png',
      enlargedImagePath: '../../../assets/images/sweater-collection-enlarged/9.png',
    },
    {
      id: 10,
      brand: 'Gucci',
      material: 'merino wool ',
      customer: 'Melissa B., Phoenix, AZ',
      workCompleted: '2019',
      imagePath: '../../../assets/images/sweater-collection/10.png',
      enlargedImagePath: '../../../assets/images/sweater-collection-enlarged/10.png',
    },
    {
      id: 11,
      brand: 'Felicite',
      material: 'Cashmere',
      customer: 'Collene S., Gig Harbor, WA',
      workCompleted: '2017',
      imagePath: '../../../assets/images/sweater-collection/11.png',
      enlargedImagePath: '../../../assets/images/sweater-collection-enlarged/11.png',
    }
  ];
  viewerOpen: boolean = false;
  ngOnInit(): void {
  }

  showViewer(item: SweaterInfo) {
    console.log(item);
    this.selectedSweater = item;
    this.viewerOpen = true;
  }

  close() {
    this.viewerOpen = false;
  }

}
