import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { BackendProvider } from '../../providers/backend/backend';
import { UtilProvider } from '../../providers/util/util';
import { Chart } from 'angular-highcharts';
import * as Highcharts from 'highcharts';

/**
 * Generated class for the StatCategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-stat-category',
  templateUrl: 'stat-category.html',
})
export class StatCategoryPage {
  category: any;
  stat: any;
  users: any;
  chart: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public backend: BackendProvider,
    public util: UtilProvider) {
    this.category = this.navParams.get('category');
    this.users = this.navParams.get('users');
    
    // Spinner de chargement
    let loading = this.util.loading('Chargement en cours...');
    
    if (this.category != null) {
      this.backend.getStatCategory(this.category).subscribe(
        data => {
          this.stat = data;
          this.buildChart();
          loading.dismiss();
        },
        error => {
          this.util.handleError(error);
          loading.dismiss();        
        });
    } else {
      // Grand Champion
      this.backend.getStatCategoryGrandChampion().subscribe(
        data => {
          this.stat = data;
          this.buildChart();
          loading.dismiss();
        },
        error => {
          this.util.handleError(error);
          loading.dismiss();        
        });
    }
  }

  ionViewDidLoad() {
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  
  buildChart() {
    this.chart = new Chart({
      chart: { type: 'pie' },
      title: { text: null },
      credits: { enabled: false },
      tooltip: {
        //pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        formatter: function() {
          return '<b>' + this.point.name + '</b>: ' + Highcharts.numberFormat(this.percentage, 1) + ' %';
        }
      },
      series: [
        { /*name: null,*/ data: this.stat.graphicsData }
      ]
    });    
    // this.chart.addPoint({name: 'Other', y: 9});
  }
  
  getWinners() {
    return Object.keys(this.stat.awardsByUser);
  }
}
