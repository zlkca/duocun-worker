import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { SharedService } from '../../shared/shared.service';
import { LocationService } from '../../location/location.service';
import { AccountService } from '../../account/account.service';
import { ILocationHistory, IPlace, ILocation, ILatLng, GeoPoint } from '../../location/location.model';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../store';
import { PageActions } from '../../main/main.actions';
import { SocketService } from '../../shared/socket.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../account/auth.service';
import { Subject } from '../../../../node_modules/rxjs';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { ICommand } from '../../shared/command.reducers';
import { IDeliveryTime } from '../../delivery/delivery.model';
import { AccountActions } from '../../account/account.actions';
import { Account, Role } from '../../account/account.model';
import { ILocationAction } from '../../location/location.reducer';
import { LocationActions } from '../../location/location.actions';

const APP = environment.APP;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  center: GeoPoint = { lat: 43.761539, lng: -79.411079 };
  restaurants;
  places: IPlace[];
  deliveryAddress = '';
  placeholder = 'Delivery Address';
  mapFullScreen = true;
  subscrAccount;
  account;
  bHideMap = false;
  bTimeOptions = false;
  orderDeadline = { h: 9, m: 30 };
  overdue;
  afternoon;
  deliveryTime: IDeliveryTime = { type: '', text: '' };

  inRange = false;
  onDestroy$ = new Subject<any>();

  constructor(
    private accountSvc: AccountService,
    private locationSvc: LocationService,
    private sharedSvc: SharedService,
    private authSvc: AuthService,
    private socketSvc: SocketService,
    private router: Router,
    private route: ActivatedRoute,
    private rx: NgRedux<IAppState>,
  ) {
  }


  ngOnInit() {
    const self = this;
    self.accountSvc.getCurrent().pipe(takeUntil(this.onDestroy$)).subscribe(account => {
      if (account) {
        self.loginSuccessHandler(account);
      } else { // not login
        self.router.navigate(['account/login']);
      }
    }, err => {
      console.log('login failed');
    });
  }

  // ngOnInit() {
  //   const self = this;
  //   self.route.queryParamMap.pipe(takeUntil(this.onDestroy$)).subscribe(queryParams => {
  //     const code = queryParams.get('code');

  //     self.accountSvc.getCurrent().pipe(takeUntil(this.onDestroy$)).subscribe(account => {
  //       if (account) {
  //         self.loginSuccessHandler(account);
  //       } else { // not login
  //         if (code) { // try wechat login
  //           this.accountSvc.wechatLogin(code).pipe(
  //             takeUntil(this.onDestroy$)
  //           ).subscribe((data: any) => {
  //             if (data) {
  //               self.authSvc.setUserId(data.userId);
  //               self.authSvc.setAccessToken(data.id);
  //               self.accountSvc.getCurrentUser().pipe(
  //                 takeUntil(this.onDestroy$)
  //               ).subscribe((acc: Account) => {
  //                 if (acc) {
  //                   self.account = acc;
  //                   self.loginSuccessHandler(acc);
  //                 } else {
  //                   this.router.navigate(['account/setting']);
  //                   // this.snackBar.open('', '微信登录失败。', {
  //                   //   duration: 1000
  //                   // });
  //                 }
  //               });
  //             } else { // failed from shared link login
  //               // tslint:disable-next-line:max-line-length
  //               window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0591bdd165898739&redirect_uri=https://duocun.com.cn&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect';
  //             }
  //           });
  //         } else { // no code in router
  //           this.router.navigate(['account/setting']);
  //         }
  //       }
  //     }, err => {
  //       console.log('login failed');
  //     });
  //   });
  // }

  loginSuccessHandler(account: Account) {
    this.rx.dispatch({ type: AccountActions.UPDATE, payload: account });

    const roles = account.roles;
    if (roles && roles.length > 0 && roles.indexOf(Role.MERCHANT_ADMIN) !== -1) {
      this.router.navigate(['order/package']);
    } else { // not authorized for opreration merchant
      this.router.navigate(['account/setting'], { queryParams: { merchant: false } });
    }
  }

  wechatLoginHandler(data: any) {
    const self = this;
    self.authSvc.setUserId(data.userId);
    self.authSvc.setAccessToken(data.id);
    self.accountSvc.getCurrentUser().pipe(
      takeUntil(this.onDestroy$)
    ).subscribe((account: Account) => {
      if (account) {
        self.account = account;

        // this.snackBar.open('', '微信登录成功。', {
        //   duration: 1000
        // });
        // self.loading = false;
        // self.init(account);
      } else {
        // this.snackBar.open('', '微信登录失败。', {
        //   duration: 1000
        // });
      }
    });

    this.getCurrentLocation();
  }

  getCurrentLocation() {
    const self = this;
    self.places = [];
    this.locationSvc.getCurrentLocation().then(r => {
      // self.sharedSvc.emitMsg({name: 'OnUpdateAddress', addr: r});
      self.deliveryAddress = self.locationSvc.getAddrString(r); // set address text to input

      self.rx.dispatch<ILocationAction>({
        type: LocationActions.UPDATE,
        payload: r
      });
    },
    err => {
      console.log(err);
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
