import { Component,OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../shared/models/User';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

interface Testimonial {
  image: string;
  name: string;
  subtitle: string;
  text: string;
}


@Component({
  selector: 'app-first-page',
  standalone: true,
  providers:[UserService,ToastrService],
  imports: [RouterModule,CommonModule],
  templateUrl: './first-page.component.html',
  styleUrl: './first-page.component.css'
})
export class FirstPageComponent{
  testimonials: Testimonial[] = [
    {
      image: 'assets/client1.jpg',
      name: 'Zen Court',
      subtitle: 'Professional Trader',
      text: 'TradingPlatform has completely transformed my trading experience. The platform is intuitive, and the tools provided are top-notch. I can access real-time market data and execute trades seamlessly. Highly recommend!'
    },
    {
      image: 'assets/client2.jpg',
      name: 'LusDen',
      subtitle: 'Beginner Trader',
      text: 'As a beginner, I was looking for a platform that was easy to use and provided excellent customer support. TradingPlatform exceeded my expectations. The educational resources are fantastic and have helped me gain confidence in my trading decisions.'
    },
    {
      image: 'assets/client1.jpg',
      name: 'John Doe',
      subtitle: 'CFD Enthusiast',
      text: 'I have been trading CFDs for a few years now, and TradingPlatform is by far the best platform I have used. The advanced charting tools and market analysis features are incredibly useful. The customer service team is also very responsive and helpful.'
    },
    {
      image: 'assets/client1.jpg',
      name: 'Jane Smith',
      subtitle: 'Stock Market Investor',
      text: 'TradingPlatform offers a wide range of stocks to trade, and the execution speed is excellent. I appreciate the security measures they have in place to protect my investments. The user interface is clean and easy to navigate. Definitely a five-star platform!'
    },
    {
      image: 'assets/client1.jpg',
      name: 'Alex Johnson',
      subtitle: 'Forex Trader',
      text: 'I have tried multiple trading platforms, but TradingPlatform stands out due to its reliability and range of features. The forex trading tools are particularly impressive, and I have seen significant improvements in my trading performance since I started using this platform.'
    }
  ];
  
  currentIndex: number = 0;
  showCount: number = 2;
  transformStyle: string = 'translateX(0)';
  user!:User
  constructor(private userService:UserService){
    userService.userObservable.subscribe((newUser)=>{
      this.user = newUser;
      console.log(this.user);
  });
  }
  ngOnInit(): void {
    this.updateTransformStyle();
  }

  updateTransformStyle(): void {
    const offset = -this.currentIndex * (100 / this.showCount);
    this.transformStyle = `translateX(${offset}%)`;
  }

  next(): void {
    if (this.currentIndex + this.showCount < this.testimonials.length) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
    this.updateTransformStyle();
  }

  prev(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.testimonials.length - this.showCount;
    }
    this.updateTransformStyle();
  }
}
