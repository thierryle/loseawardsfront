import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { BackendProvider } from '../../providers/backend/backend';
import { UtilProvider } from '../../providers/util/util';
import { Chart } from 'angular-highcharts';
import * as Highcharts from 'highcharts';

/**
 * Generated class for the StatUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-stat-user',
  templateUrl: 'stat-user.html',
})
export class StatUserPage {
  user: any;
  stat: any;
  categories: any;
  nbAwards: number = 0;
  nbCategories: number = 0;
  divisionChart: any;
  progressionChart: any;
  statType: string = 'division';

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public backend: BackendProvider,
    public util: UtilProvider) {
    this.user = this.navParams.get('user');
    this.categories = this.navParams.get('categories');

    // Spinner de chargement
    let loading = this.util.loading('Chargement en cours...');

    this.backend.getStatUser(this.user).subscribe(
      data => {
        this.stat = data;
        this.setTotal();
        this.buildCharts();
        loading.dismiss();
      },
      error => {
        this.util.handleError(error);
        loading.dismiss();
      });
  }

  ionViewDidLoad() {
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  getWonCategories() {
    if (this.stat.awardsByCategory == null) {
      return [];
    }
    return Object.keys(this.stat.awardsByCategory);
  }

  /**
   * Calcule le total des récompenses et des catégories.
   */
  setTotal() {
    if (this.stat.awardsByCategory != null) {
      for (let categoryId of Object.keys(this.stat.awardsByCategory)) {
        if (categoryId != '-1') {
          this.nbAwards += this.stat.awardsByCategory[categoryId].length;
          this.nbCategories++;
        }
      }
    }
  }

  buildCharts() {
    this.divisionChart = new Chart({
      chart: { type: 'pie' },
      title: { text: null },
      credits: { enabled: false },
      tooltip: {
        formatter: function() {
          return '<b>' + this.point.name + '</b>: ' + Highcharts.numberFormat(this.percentage, 1) + ' %';
        }
      },
      series: [{ data: this.stat.graphicsData }]
    });

    this.progressionChart = new Chart({
      title: { text: null },
      credits: { enabled: false },
      xAxis: { categories: this.stat.progressionGraphicsData.years },
      yAxis: {
        title: { text: null }
      },
      plotOptions: {
        line: {
            dataLabels: { enabled: true }
        }
      },
      series: [{
        name: 'Récompenses',
        data: this.stat.progressionGraphicsData.nbAwards
      }, {
        name: 'Classement',
        data: this.stat.progressionGraphicsData.ranks
      }]
    });
  }
}
