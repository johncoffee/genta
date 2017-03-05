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
<div>
  <md-button ng-click="$ctrl.route = ${Routes.SUBSCRIPTIONS}" ng-bind="::'${Routes[Routes.SUBSCRIPTIONS]}'"></md-button>
  <md-button ng-click="$ctrl.route = ${Routes.REQUESTS}" ng-bind="::'${Routes[Routes.REQUESTS]}'"></md-button>
  <md-button ng-click="$ctrl.route = ${Routes.SIGNUP}" ng-bind="::'${Routes[Routes.SIGNUP]}'"></md-button>
</div>
    <requests ng-if="$ctrl.route == ${Routes.REQUESTS}"></requests>
    <plank ng-if="$ctrl.route == ${Routes.SIGNUP}"></plank>
    <subscriptions ng-if="$ctrl.route == ${Routes.SUBSCRIPTIONS}"></subscriptions>
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
  <md-content layout-padding="">      
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
        item.selected = true
        setTimeout(() => $scope.$apply())
      })(item)

      handler.open({
        name: 'Stripe.com',
        description: '2 widgets',
        amount: 2000
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