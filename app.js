'use strict'

angular.module("app", ['ngMaterial'])

angular.module("app").config(function ($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('indigo')
    .accentPalette('orange')

  $mdThemingProvider.enableBrowserColor({
    theme: 'default', // Default is 'default'
    palette: 'primary', // Default is 'primary', any basic material palette and extended palettes are available
    hue: '800' // Default is '800'
  });
})

angular.module('app').component('plankApp', {
  template: `
<div ng-if="$ctrl.route >= 10">
  <div layout-align="center center" layout="row">
      <div flex="100">            
         <h4 class="md-subheader"></h4>
         <h2 class="md-headline" style="text-align: center">John Doe</h2>
      </div>
      <div flex="noshrink">
        <md-button ng-click="$ctrl.route = ${Routes.SIGNUP}">logout</md-button>
      </div>
  </div>
  
  <md-tabs md-dynamic-height md-border-bottom>
    <md-tab label="{{::'${Routes[Routes.REQUESTS]}'}}">
        <requests></requests>
    </md-tab>
    <md-tab label="{{::'${Routes[Routes.SUBSCRIPTIONS]}'}}">
        <subscriptions></subscriptions>
    </md-tab>      
  </md-tabs>
</div>

 <plank ng-if="$ctrl.route < 10"></plank>    
`,
  controller: function () {
    Object.defineProperty(this, 'route', {
      get: () => localStorage.route,
      set: (value) => localStorage.route = value,
    })

    if (!this.route || !Routes[this.route]) {
      this.route = Routes.SIGNUP
      console.debug("Defaulted to ", Routes[this.route])
    }
  },
})

angular.module('app').component('plank', {
  template: `
  <md-content layout-padding="" layout="column" layout-align="center center ">
    <h2 class="md-display-1" style="text-align: center">Genti</h2>
    <h3 class="md-headline">Sign up</h3>  
    <div class="nid">
      <input class="nid__input">
      <input class="nid__input" type="password">
      <button class="nid__input" ng-click="$ctrl.route = ${Routes.REQUESTS}"></button>
    </div>
</md-content>
  
  `,
  controller: function () {
    Object.defineProperty(this, 'route', {
      get: () => localStorage.route,
      set: (value) => localStorage.route = value,
    })
  }
})

angular.module('app').component('requests', {
  template: `  
  <md-list flex>
    <md-subheader class="md-no-sticky">Requests</md-subheader>
    <md-list-item class="md-3-line" ng-repeat="item in $ctrl.list">      
      <div class="md-list-item-text" layout="row" layout-align="space-between center">
        <div>
          <h3 ng-bind="::item.name"></h3>
          <h4 ng-bind="::item.company"></h4>
          <p>
            kr {{ ::item.amount }} &middot;
            {{ ::item.rate }}           
            {{ ::(item.expires ? ' &middot; Expires ' + item.expires : '') }}            
          </p>
        </div>
        <div>
            <md-button class="md-primary" ng-click="$ctrl.check(item)">activate</md-button>
        </div>
      </div>
    </md-list-item>
  </md-list>
  `,
  controller: function (list, $scope) {
    Object.defineProperty(this, 'route', {
      get: () => localStorage.route,
      set: (value) => localStorage.route = value,
    })

    this.list = list.filter(item => !item.selected)

    this.check = function (item) {
      window.onTokenSuccess = (function (item) {
        return function () {
          item.selected = false
          $scope.$apply()
          window.onTokenSuccess = undefined
        }
      })(item)

      handler.open({
        name: item.name,
        description: item.company,
        amount: item.amount
      })
    }
  }
})

angular.module('app').component('subscriptions', {
  template: `
  <md-list flex>
    <md-subheader class="md-no-sticky">Active subscriptions</md-subheader>
    <md-list-item class="md-3-line" ng-repeat="item in $ctrl.list">      
      <div class="md-list-item-text" layout="column">
        <h3 ng-bind="::item.name"></h3>
        <h4 ng-bind="::item.company"></h4>
        <p>
          kr {{ ::item.amount }} &middot;
          {{ ::item.rate }} &middot; 
          Next {{ ::item.next }} 
          {{ ::(item.expires ? ' &middot; Expires ' + item.expires : '') }}            
        </p>          
      </div>
    </md-list-item>
  </md-list>
`,
  controller: function (list) {
    Object.defineProperty(this, 'route', {
      get: () => localStorage.route,
      set: (value) => localStorage.route = value,
    })

    this.list = list.filter(item => item.selected)

    this.check = function (item) {
      if (!item.checked) {
        handler.open({
          name: 'Stripe.com',
          description: '2 widgets',
          amount: item.amount
        });
      }
    }
  }
})

angular.module('app').service('bottomMenu', class {
    constructor ($mdBottomSheet) {
      this.$mdBottomSheet = $mdBottomSheet

      this.items = [
        {
          name: "Sound Board",
          fn: () => {
            $mdBottomSheet.hide()
            localStorage.route = Routes.SOUND_BOARD
          }
        },
        // {
        //   name: "exercise list",
        //   fn: angular.noop,
        // },
        {
          name: "danske klatrebegreber",
          fn: () => {
            $mdBottomSheet.hide()
            localStorage.route = Routes.GLOSSARY
          },
        },
        {
          name: "source code",
          fn: () => window.location = "https://github.com/johncoffee/plank",
        }
      ]
    }

    show() {
      let self = this
      this.$mdBottomSheet.show({
        controller: function () {
          this.items = self.items
        },
        controllerAs: "$ctrl",
        template: `
  <md-bottom-sheet class="md-list md-has-header">
    <md-subheader>Super useful stuff</md-subheader>
    <md-list>
      <md-list-item ng-repeat="item in $ctrl.items">
        <md-button
            aria-label="item.name"
            md-autofocus="$index == 0"
            ng-click="item.fn()"
            class="md-list-item-content">
          <span class="md-inline-list-icon-label" ng-bind="item.name"></span>
        </md-button>

      </md-list-item>
    </md-list>
  </md-bottom-sheet>
`,
      })
    }
})

angular.module('app').value('list', [
  {
    name: "TV License",
    company: "Danmarks Radio",
    next: "30. May",
    rate: "Biannual",
    amount: 2000,
    selected : false,
  },
  {
    name: "Rent",
    company: "Evil Faceless Landlord",
    next: "1. June",
    rate: "Monthly",
    amount: 9666,
    expires: "25. February 2018",
    selected : true,
  },
  {
    name: "Renovation service",
    company: "Københavns Kommune",
    next: "1. June",
    rate: "Monthly",
    amount: 500,
    selected : true,
  },
  {
    name: "Power",
    company: "DONG",
    next: "1. June",
    rate: "Triannual",
    amount: 2500,
    selected : true,
  },
  {
    name: "Frivillig indbetaling",
    company: "SKAT",
    next: "1. June",
    rate: "Monthly",
    expires: "1. November",
    amount: 253,
    selected : true,
  }
])