// module.exports = function(app) {
//   app.dataSources.db.automigrate('Campaign', function(err) {
//     if (err) throw err;
//
//     app.models.Campaign.create([
//       {
//         "name": "Campaign 1",
//         "dateCreated": "2016-12-08",
//         "funds": 0,
//         "deadline": "2016-12-18"
//       }, {
//         "name": "Campaign 2",
//         "dateCreated": "2016-12-10",
//         "funds": 0,
//         "deadline": "2016-12-22"
//       }, {
//         "name": "Campaign 3",
//         "dateCreated": "2017-01-01",
//         "funds": 0,
//         "deadline": "2017-01-12"
//       }
//     ], function(err, coffeeShops) {
//       if (err) throw err;
//
//       console.log('Models created: \n', coffeeShops);
//     });
//   });
// };







var async = require('async');
module.exports = function(app) {
  //data sources
  var mongoDs = app.dataSources.db;
  //create all models
  async.parallel({
    customers: async.apply(createCustomers),
    // campaigns: async.apply(createCampaigns),
  }, function(err, results) {
    if (err) throw err;
    console.log('> models created sucessfully');
    createCampaigns(results.customers, function(err) {
      console.log('> models created sucessfully');
    });
    // createReviews(results.reviewers, results.coffeeShops, function(err) {
    //   console.log('> models created sucessfully');
    // });
  });
  //create reviewers
  function createCustomers(cb) {
    mongoDs.automigrate('Customer', function(err) {
      if (err) return cb(err);
      var Customer = app.models.Customer;
      Customer.create([{
        email: 'foo@bar.com',
        password: 'foobar'
      }, {
        email: 'john@doe.com',
        password: 'johndoe'
      }, {
        email: 'jane@doe.com',
        password: 'janedoe'
      }], cb);
    });
  }
  //create coffee shops
  function createCampaigns(customers, cb) {
    mongoDs.automigrate('Campaign', function(err) {
      if (err) return cb(err);
      var Campaign = app.models.Campaign;
      Campaign.create([
        {
          "name": "Campaign 1",
          "dateCreated": "2016-12-08",
          "funds": 0,
          "deadline": "2016-12-18",
          "customerId": customers[0].id
        }, {
          "name": "Campaign 2",
          "dateCreated": "2016-12-10",
          "funds": 0,
          "deadline": "2016-12-22",
          "customerId": customers[1].id
        }, {
          "name": "Campaign 3",
          "dateCreated": "2017-01-01",
          "funds": 0,
          "deadline": "2017-01-12",
          "customerId": customers[2].id
        }
      ], cb);
    });
  }
  //create reviews
  function createReviews(reviewers, coffeeShops, cb) {
    mongoDs.automigrate('Review', function(err) {
      if (err) return cb(err);
      var Review = app.models.Review;
      var DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
      Review.create([{
        date: Date.now() - (DAY_IN_MILLISECONDS * 4),
        rating: 5,
        comments: 'A very good coffee shop.',
        publisherId: reviewers[0].id,
        coffeeShopId: coffeeShops[0].id,
      }, {
        date: Date.now() - (DAY_IN_MILLISECONDS * 3),
        rating: 5,
        comments: 'Quite pleasant.',
        publisherId: reviewers[1].id,
        coffeeShopId: coffeeShops[0].id,
      }, {
        date: Date.now() - (DAY_IN_MILLISECONDS * 2),
        rating: 4,
        comments: 'It was ok.',
        publisherId: reviewers[1].id,
        coffeeShopId: coffeeShops[1].id,
      }, {
        date: Date.now() - (DAY_IN_MILLISECONDS),
        rating: 4,
        comments: 'I go here everyday.',
        publisherId: reviewers[2].id,
        coffeeShopId: coffeeShops[2].id,
      }], cb);
    });
  }
};
