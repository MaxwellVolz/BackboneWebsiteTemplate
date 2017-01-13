

define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tether              = require('tether'),
        d3                  = require('d3'),
        bootstrap           = require('bootstrap'),
        // firebase           	= require('firebase'),
        firebase           	= require('firebase'),
        // backbonefire         = require('backbonefire'),
        // Model           	= require('collections/fangCollection'),
        
        // ProjectItem           = require('../views/projectItem'),
        HTML                = require('text!html/sites/fangChat.html'),
        // projectsData        = require('json!data/projects.json'), 
        // svgBike             = require('text!svg/svgBike.svg')
        template = _.template(HTML);


    
    

    return Backbone.View.extend({
    	// model: testModel,
    	initialize:function(){
    		 var self = this;
    		 // this.model = new Model();
    		 // console.log("this.model");

    		

			// self.connectToFirebase();

			if(typeof(FB) == "undefined"){
    			self.facebookSetup();
    		}
				

    		self.authFirebase();

    		  
    		 


    	},
        render: function () {
            var self = this;
            self.undelegateEvents();
            self.$el.html(template());

            $(".checkFBstatus").on('click',function(){
    		 	self.checkFacebookStatus();
    		}); 

    		$(".checkFirebaseStatus").on('click',function(){
    		 	self.firebaseFBpopup();
    		});

            

            return this;
        },
        authFirebase: function(){
        	var provider = new firebase.auth.FacebookAuthProvider();



        },
        firebaseFBpopup: function(){
        	

        	firebase.auth().signInWithPopup(provider).then(function(result) {
			  // This gives you a Facebook Access Token. You can use it to access the Facebook API.
			  var token = result.credential.accessToken;
			  // The signed-in user info.
			  var user = result.user;
			  // ...
			}).catch(function(error) {
			  // Handle Errors here.
			  var errorCode = error.code;
			  var errorMessage = error.message;
			  // The email of the user's account used.
			  var email = error.email;
			  // The firebase.auth.AuthCredential type that was used.
			  var credential = error.credential;
			  // ...
			});
        },
        facebookSetup: function(){
        	console.log("loading facebook setup");
        	var self = this;

        	function checkLoginState() {
	            FB.getLoginStatus(function(response) {
	            statusChangeCallback(response);
	            });
	        }

        	window.fbAsyncInit = function() {
			    FB.init({
			      appId      : '482065135274562',
			      xfbml      : true,
			      version    : 'v2.8'
			    });
			    FB.AppEvents.logPageView();
			  };

			  (function(d, s, id){
			     var js, fjs = d.getElementsByTagName(s)[0];
			     if (d.getElementById(id)) {return;}
			     js = d.createElement(s); js.id = id;
			     js.src = "//connect.facebook.net/en_US/sdk.js";
			     fjs.parentNode.insertBefore(js, fjs);
		   }(document, 'script', 'facebook-jssdk'));
        	// 
       

		  // 
        },
        checkFacebookStatus: function(){
        	console.log("FB?");
        	console.log(FB);
        	

			FB.getLoginStatus(function(response) {
        		console.log("response");
        		console.log(response);
			    statusChangeCallback(response);
			});
        	
        },

        connectToFirebase: function(){
        	var self = this;
        	console.log("Initializing connection to Firebase.");

        	console.log("this.model");
        	// console.log(firebase);
        	// firebase.initializeApp(config);
        	// console.log(this.model.toJSON());


        	var config = {
			    apiKey: "AIzaSyBufAgxJlMcZl_t_Sw63EhWmLNqEdKiNoI",
			    authDomain: "fangchatdb.firebaseapp.com",
			    databaseURL: "https://fangchatdb.firebaseio.com",
			    storageBucket: "fangchatdb.appspot.com"
			  };
		  	firebase.initializeApp(config);


			  // // Get a reference to the database service
		  	var database = firebase.database(),
		  		rootRef = database.ref();

		 //  	firebase.auth().signInAnonymously().catch(function(error) {
			//   // Handle Errors here.
			//   var errorCode = error.code;
			//   var errorMessage = error.message;
			//   // ...
			  


			var chatdatabase = [];
			console.log("chatDB");

			firebase.database().ref('/Chat/').once('value').then(function(snapshot) {
			console.log("chatDB......");
			  	chatdatabase = snapshot.val();

			  	console.log("chatdatabase");
				console.log(chatdatabase);
			  // ...
			});

			
		  	
		  	// console.log(firebase.database().ref(''posts/' + postId + '/starCount'');


   //         	var config = {
			//     apiKey: "AIzaSyBufAgxJlMcZl_t_Sw63EhWmLNqEdKiNoI",
			//     authDomain: "fangchatdb.firebaseapp.com",
			//     databaseURL: "https://fangchatdb.firebaseio.com",
			//     storageBucket: "fangchatdb.appspot.com",
			//     messagingSenderId: "441662901082"
			//   };
			// firebase.initializeApp(config);
        },

    });
});
