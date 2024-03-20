import { HttpClientModule } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-search',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  searchTerm='';
  constructor(activatedRoute:ActivatedRoute,private router:Router) {

    activatedRoute.params.subscribe(params => {
      if(params.searchTerm){
        this.searchTerm = params.searchTerm;
      }
    });
    
  }
@Input()
isStockSearch:boolean=false;
@Input()
isCryptoSearch:boolean=false;

  search(term:string):void{
    if(term){
      if(this.isCryptoSearch){
        this.router.navigateByUrl('/crypto/search/'+term);
        
      }
      if(this.isStockSearch){
        this.router.navigateByUrl('/search/'+term);
      }

      
    }
  }

}
