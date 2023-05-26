import { Component, OnInit } from '@angular/core';
import { CinemaService } from "../services/cinema.service";

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {
  public villes: any;
  public cinemas: any;
  public salles: any;
  public currentVille: any;
  public currentCinema: any;
  public currentProjection: any;
  public selectedTickets: any[] = [];

  constructor(public cinemaService: CinemaService) { }

  ngOnInit(): void {
    this.cinemaService.getVilles()
      .subscribe(
        data => {
          this.villes = data;
        },
        error => {
          console.log(error);
        }
      );
  }

  onGetCinemas(v: any) {
    this.currentVille = v;
    this.salles = undefined;
    this.cinemaService.getCinemas(v)
      .subscribe(
        data => {
          this.cinemas = data;
        },
        error => {
          console.log(error);
        }
      );
  }

  onGetSalles(s: any) {
    this.currentCinema = s;
    this.cinemaService.getSalles(s)
      .subscribe(
        data => {
          this.salles = data;
          this.salles._embedded.salles.forEach((salle: any) => {
            this.cinemaService.getProjection(salle)
              .subscribe(
                projectionData => {
                  salle.projections = projectionData;
                },
                error => {
                  console.log(error);
                }
              );
          });
        },
        error => {
          console.log(error);
        }
      );
  }

  onGetTicketsPlaces(p: any) {
    this.currentProjection = p;
    this.cinemaService.getTicketsPlaces(p)
      .subscribe(
        data => {
          this.currentProjection.tickets = data;
          this.selectedTickets = [];
        },
        error => {
          console.log(error);
        }
      );
  }

  onSelectTicket(t: any) {
    if (!t.selected) {
      t.selected = true;
      this.selectedTickets.push(t);
    } else {
      t.selected = false;
      this.selectedTickets.splice(this.selectedTickets.indexOf(t), 1);
    }
    console.log(this.selectedTickets);
  }

  getTicketClass(t: any) {
    let str = '';
    if (t.reserve == true) {
      str += "btn btn-danger ticket";
    } else if (t.selected) {
      str += "btn btn-warning ticket";
    } else {
      str += "btn btn-success ticket";
    }
    return str;
  }

  onPayTickets(dataForm: any) {
    let tickets: any[] = this.selectedTickets.map(t => t.id);
    dataForm.tickets = tickets;
    this.cinemaService.payerTickets(dataForm)
      .subscribe(
        () => {
          this.onGetTicketsPlaces(this.currentProjection);
          alert("Tickets réservés avec succès");
        },
        error => {
          console.log(error);
        }
      );
  }

}
