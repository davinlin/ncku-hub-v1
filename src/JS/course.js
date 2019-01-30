
  var vue_course_item = new Vue({
    el: '#course_item',
    data: {
      course_with_comment: [],
      course_data: [],
      course_data_db: function(){
      	return course_db;
      },
      course_by_depart: [],
      heartColor: false,
      comment_only: false,
      count_height: 1,
      count_index: 0,
      userData: userData
    },

    methods: {
      // courseLink: function(index) {
      //   vue_courseContent.isShow = true;
      //   vue_courseContent.course_data = vue_course_item.course_data[index];

      //   var course_id = vue_courseContent.course_data.id;
      //   var course_url = "/course/" + course_id;

      //   $.ajax({
      //     type: "GET",
      //     url: course_url,
      //     success: function(response) {
      //       vue_courseContent.score_data = response;
      //       vue_courseContent.comment_data = response.comment;

      //       if(vue_courseContent.comment_data.length==0){
      //         $(".courseFeedback__msg--default").css("display","block");
      //       } else {
      //         $(".courseFeedback__msg--default").css("display","none");
      //       }
      //     }
      //   });
      // },
      openCoursePage: function(id) {
        console.log("open the page: " + id);
        setWindow('course_page','open');
        var course_url = "/course/" + id;

        $.ajax({
          type: "GET",
          url: course_url,
          success: function(response) {
            // vue_courseContent.isShow = true;
            // console.log(document.getElementById("commentBody").scrollTop);
            vue_courseContent.score_data = response;
            // vue_courseContent.score_data.got = Number(vue_courseContent.score_data.got).toFixed(1).toString();
            // vue_courseContent.score_data.sweet = parseFloat(vue_courseContent.score_data.sweet).toFixed(1);
            // vue_courseContent.score_data.cold = parseFloat(vue_courseContent.score_data.cold).toFixed(1);
            vue_courseContent.comment_data = response.comment;
            vue_courseContent.course_data = response.courseInfo;
            if(vue_courseContent.comment_data.length==0){
              $(".courseFeedback__msg--default").css("display","block");
            } else {
              $(".courseFeedback__msg--default").css("display","none");
            }
          }
        });
        // for(var i in vue_course_item.course_data_db()){
        //   if(id == vue_course_item.course_data_db()[i].id){
        //     vue_course_item.courseLink(i);
        //     vue_courseContent.course_data = vue_course_item.course_data_db()[i];
        //   }
        // }
        // console.log(vue_courseContent.course_data);
      },
      setCourse: function(id){
        var chooseCourse_id = id;
        if (userData.now_wishlist.includes(chooseCourse_id)){
          wishlistRemove(chooseCourse_id);
        }
        else{
          wishlistAdd(chooseCourse_id);
        }

        vue_courseFilter.wishList = userData.now_wishlist;
      },
      handleScroll: function() {
        var list_height = $("#course_item").height();
        var scroll_height = $("#course_item").scrollTop();
        if(scroll_height >= list_height * this.count_height){
          for(var i = 200 + this.count_index*20; i< 200 + (this.count_index+1)*20;i++){
            vue_course_item.course_data.push(vue_course_item.course_data_db()[i]);
          }
          this.count_index++;
          this.count_height++;
        }
      },
      course_circle: function(dept, dept_name) {
        var name = deptTransCat(dept, dept_name);
        return name;
      }
    },
    created: function() {
      document.getElementById("courseList").addEventListener('scroll', this.handleScroll, true);
      // $("#courseList").bind('scroll', function() {
      //   this.handleScroll();
      // });

    },
  });


  var vue_courseContent = new Vue ({
    el: '#courseContent',
    data: {
      // isShow: false,
      page_status: pageStatus,
      course_data: [],
      score_data: {
        got:[],
        sweet:[],
        cold:[],
      },
      comment_data: [],
      userData: userData,
    },
    methods: {
      hideContent: function() {
        setWindow('course_page', 'close');
        vue_courseContent.course_data = [];
        vue_courseContent.score_data = [];
        vue_courseContent.comment_data = [];
        //if click outside then hide
      },
      minusRate: function(rate_name) {
        var rate_input = rate_name;
        if(document.getElementById(rate_input).value>0){
            document.getElementById(rate_input).stepDown();
        }
      },
      addRate: function(rate_name) {
        var rate_input = rate_name;
        if(document.getElementById(rate_input).value<10){
            document.getElementById(rate_input).stepUp();
        }
      },
      submit_score: function(index) {
          // $(".score_input").each(function() {
          //   $(".score_input").css("display","inline-block");
          // });
          // $(".score_span").each(function() {
          //   $(".score_span").css("display","none");
          // });
          // $(".arrow-left").each(function() {
          //   $(".arrow-left").css("display","inline-block");
          // });
          // $(".arrow-right").each(function() {
          //   $(".arrow-right").css("display","inline-block");
          // });


          // document.getElementById("score_input").innerHTML = "寫心得";

      },
      content_setWishlist: function(id) {
        var chooseCourse_id = id;
        if (userData.now_wishlist.includes(chooseCourse_id)){
          wishlistRemove(chooseCourse_id);
        }
        else{
          wishlistAdd(chooseCourse_id);
        }

        vue_courseFilter.wishList = userData.now_wishlist;
      },
      openOutline: function(dept,dept_serial) {
        let url = 'http://course-query.acad.ncku.edu.tw/crm/course_map/course.php?dept=' + dept + '&cono=' + dept_serial;
        window.open(url, '_blank');
      },
      openReviewWindow: function(){
        vue_courseContent.hideContent();
        setWindow( 'add_review', 'open' );
      },
    },
    filter: {
      // roundto2: function(value) {
      //   value = Number(value);
      //   return value.toFixed(2);
      // },
    },
  });

  var vue_courseFilter = new Vue ({
    el: '#courseFilter',
    data: {
      keyword: '',
      dept: [],
      course_data: [],
      wishList: [],
      wishlist_cont: [],
      dept_dropdown: [],
      filter_by_dpmt: [],
      keyPrefix: '',
    },
    methods: {
      comment_filter: function() {
        console.log("check");
        var cCheck = document.getElementById("commentCheck");
        var dpmt_value = document.getElementById("dpmtFilter").value;

        if (cCheck.checked==true) {
            vue_course_item.course_data = [];
          if(dpmt_value=="") {
              vue_course_item.course_data = vue_course_item.course_with_comment;
          } else if (dpmt_value!="") {
            for(var i in vue_courseFilter.filter_by_dpmt){
              if(vue_courseFilter.filter_by_dpmt[i].comment_num>0){
                vue_course_item.course_data.push(vue_courseFilter.filter_by_dpmt[i]);
              }
            }
          }

        } else {
          vue_course_item.course_data = [];
          if(dpmt_value==""){
            for(var i=0;i<100;i++){
              vue_course_item.course_data.push(vue_course_item.course_data_db()[i]);
            }
          } else if (dpmt_value!=""){
            vue_course_item.course_data = [];
            for(var i in vue_course_item.course_data_db()) {
              if(vue_course_item.course_data_db()[i].系號 == this.keyPrefix){
                vue_course_item.course_data.push(vue_course_item.course_data_db()[i]);
              }
            }
          }
        }
      },
      result_click: function(index) {
        var key = document.getElementById("dpmtFilter");
        var key_prefix = vue_courseFilter.dept_dropdown[index].prefix;
        this.keyPrefix = key_prefix;
        key.value = key_prefix + " " + vue_courseFilter.dept_dropdown[index].name;
        this.filter_by_dpmt = [];
        if(this.keyword) {
          if (document.getElementById("commentCheck").checked==true) {
            for(var i in vue_course_item.course_with_comment) {
              if(vue_course_item.course_with_comment[i].系號 == key_prefix){
                this.filter_by_dpmt.push(vue_course_item.course_with_comment[i]);
              }
            }
          } else {
            for(var i in vue_course_item.course_data_db()) {
              if(vue_course_item.course_data_db()[i].系號 == key_prefix){
                this.filter_by_dpmt.push(vue_course_item.course_data_db()[i]);
              }
            }
          }
        }

        $(".search_result--course").css("display","none");
        vue_course_item.course_data = this.filter_by_dpmt;
        console.log(this.filter_by_dpmt);
      },
      refresh: function () {
        this.wishlist_cont.length = 0;
        for ( var i = 0 ; i < userData.now_wishlist.length ; i ++ ) {
            var class_item = getClassObject ( course_db, userData.now_wishlist[i] ) ;
            this.wishlist_cont.push( class_item );
        }
      },
      deleteItem: function ( id ) {
        wishlistRemove( id );
      },
      opentabletab: function() {
        toTab('table');
      },
    },
    computed: {
      search_result: function() {
        this.dept_dropdown = [];
        if(this.keyword) {
          this.keyword = this.keyword.toUpperCase();
          for(var i in this.dept){
            if(this.dept[i].DepPrefix.match(this.keyword) || this.dept[i].DepName.match(this.keyword)) {
              var result_candidate = [];
              result_candidate.prefix = this.dept[i].DepPrefix;
              result_candidate.name = this.dept[i].DepName;
              this.dept_dropdown.push(result_candidate);
            }
          }

        } else if (!this.keyword && vue_course_item.course_data_db().length != 0) {
          console.log("empty!!");
          vue_course_item.course_data = [];
          if (document.getElementById("commentCheck").checked==true) {
            vue_course_item.course_data = vue_course_item.course_with_comment;
          } else {
            for(var i=0;i<100;i++){
              vue_course_item.course_data.push(vue_course_item.course_data_db()[i]);
            }
          }
        }
        console.log(this.dept_dropdown);
        return this.dept_dropdown;

      }
    }
  });

  Vue.filter('roundto2', function(value) {
    value = Number(value);
    return value.toFixed(1);
  })
//end---------------------



// });