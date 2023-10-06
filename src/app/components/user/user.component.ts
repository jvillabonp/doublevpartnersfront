import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GitHubService } from 'src/app/services/github.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  username: string;
  userDetail: any;
  id: any;
  email: any;
  imgurl: string;
  name: string;
  bio: string;
  followers: number;
  company: string;
  location: string;

  constructor(private route: ActivatedRoute, private githubService: GitHubService, private router: Router) { }

  ngOnInit(): void {
      this.route.params.subscribe(params =>{
        this.username = params['username'];
       })

       this.githubService.getUser(this.username).subscribe({
         complete : () => {console.log("success!")},
         error:() => {
            alert("error ! search again");
            this.router.navigate(['']);
         },
         next : (data : any = []) => {
           this.userDetail = data;
           this.id = this.userDetail.id;
           this.email = this.userDetail.email;
           this.bio = this.userDetail.bio;
           this.company = this.userDetail.company;
           this.followers = this.userDetail.followers;
           this.imgurl = this.userDetail.avatar_url;
           this.location = this.userDetail.location;
           this.name = this.userDetail.name;
          }
       });
  }
}
