import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { GitHubService } from '../../services/github.service';

declare const $: any;
declare const Chart: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  searchform: FormGroup;
  username: string = '';
  dataTable: any;
  chart: any;
  faUser = faUser;

  constructor(private githubService: GitHubService) {}

  ngOnInit(): void {
    this.searchform = new FormGroup({
      username: new FormControl(
        null,
        [Validators.required, Validators.minLength(4)]
      )
    });

    $(() => {
      this.dataTable = $('.data-table').DataTable({
        dom: 'Bfrtip',
        language: {
          url: "//cdn.datatables.net/plug-ins/1.10.7/i18n/Spanish.json"
        },
        columns: [
          { data: 'id', name: 'id' },
          { data: 'login', name: 'Username', orderable: false, searchable: false },
          { data: 'url', name: 'URL', orderable: false, searchable: false },
          {
            data: null,
            render: function (value: any) {
              return `<a class="btn btn-success" href="${value.login}">Ver</a>`;
            }
          }
        ]
      });

      this.chart = document.getElementById('barChartFollowers');
    });
  }

  sendUser() {
    this.username = this.searchform.value.username;
    if (this.username != "doublevpartners") {
      Swal.fire({
        title: 'Cargando...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        willOpen: () => Swal.showLoading()
      });
      this.githubService
        .fetchUsername(this.username)
        .subscribe((data: any) => {
          this.dataTable.clear();
          this.dataTable.rows.add(data.items).draw()
          var graph: any = [];

          data.items.slice(0, 9).map((v: any, i: any) => {
            graph.push({
              name: v.login,
              followers: 0
            });

            fetch(v.followers_url)
              .then(response => response.json())
              .then((data: any) => {
                graph[i].followers = data.length;
              })
          });

          setTimeout(() => {
            new Chart(this.chart, {
              type: 'bar',
              data: {
                labels: graph.map(function (a: any) {return a.name}),
                datasets: [
                  {
                    label: '# de Seguidores Primeros 10 Resultados',
                    data: graph.map(function (a: any) {return a.followers}),
                    backgroundColor: "green",
                    borderWidth: 1
                  }
                ]
              },
            });

            Swal.close();
          }, 1500);
        });
    }
  }
}
