var express = require('express');
var router = express.Router();
var db = require('../model/db');

/* index  */
router.get('/', function(req, res) {
    // Log
    console.log("\n")
    console.log("========================================");
    var dt = new Date();
    console.log(dt);
    console.log("query: " + req.url);
    if (req.user !== undefined) console.log("使用者：" + req.user.name);

    /* 設定 Order 欄位 */
    if (req.query.order) {
        var order = req.query.order;
    } else {
        var order = 'course_name';
    }
    /*  設定要的欄位 */
    var colmuns = ['id', 'course_name', 'catalog', 'teacher', 'semester', 'user_id'];
    db.GetColumn('post', colmuns, { 'column': order, 'order': 'DESC' }, function(posts) {
        if (req.query.hasOwnProperty("queryw")) {
            db.query_post(posts, req.query.queryw, "query", function(posts, teachers, course_name) {
                if (req.query.order) {
                    res.send(posts);
                } else {
                    res.render('post/index', {
                        'posts': posts,
                        'teachers': teachers,
                        'course_name': course_name,
                        'user': req.user
                    });
                }
            });
        } else if (req.query.hasOwnProperty("teacher")) {
            db.query_post(posts, req.query.teacher, "teacher", function(posts, teachers, course_name) {
                if (req.query.order) {
                    res.send(posts);
                } else {
                    res.render('post/index', {
                        'posts': posts,
                        'teachers': teachers,
                        'course_name': course_name,
                        'user': req.user
                    });
                }
            });
        } else if (req.query.hasOwnProperty("course_name")) {
            db.query_post(posts, req.query.course_name, "course_name", function(posts, teachers, course_name) {
                if (req.query.order) {
                    res.send(posts);
                } else {
                    res.render('post/index', {
                        'posts': posts,
                        'teachers': teachers,
                        'course_name': course_name,
                        'user': req.user
                    });
                }
            });
        } else if (req.query.hasOwnProperty("catalog")) {
            switch (req.query.catalog) {
                case "A9":
                    req.query.catalog = "通識";
                    break;
                case "A2":
                    req.query.catalog = "體育";
                    break;
                case "A1":
                    req.query.catalog = "外國語言";
                    break;
                case "A6":
                    req.query.catalog = "服務學習";
                    break;
                case "A7":
                    req.query.catalog = "基礎國文";
                    break;
                case "AG":
                    req.query.catalog = "公民歷史";
                    break;
                case "M":
                    req.query.catalog = "必修";
                    break;
                case "C":
                    req.query.catalog = "選修";
                    break;
                default:
                    req.query.catalog = "";
                    break;
            }
            db.query_post(posts, req.query.catalog, "catalog", function(posts, teachers, course_name) {
                if (req.query.order) {
                    res.send(posts);
                } else {
                    res.render('post/index', {
                        'posts': posts,
                        'teachers': teachers,
                        'course_name': course_name,
                        'user': req.user
                    });
                }
            });
        } else {
            var teacher = db.search_item(posts, "teacher");
            var courseName = db.search_item(posts, "course_name");
            if (req.query.order) {
                res.send(posts);
            } else {
                res.render('post/index', {
                    'posts': posts,
                    'teachers': teacher,
                    'course_name': courseName,
                    'user': req.user
                });
            }
        }
    });
});

/* create */
router.post('/create', function(req, res) {
    console.log('\n' + 'POST /post/create');
    if (req.user == undefined) {
        console.log("Not login");
        res.send([{ msg: "請重新登入!" }]);
    } else {
        var userid = parseInt(req.user.id);
        console.log('User_id: ' + req.user.id + ' User_name: ' + req.user.name);
        req.checkBody('course_name', '課程名稱不可為空').notEmpty();
        req.checkBody('comment', '修課心得不可為空').notEmpty();
        var errors = req.validationErrors();
        if (errors) {
            console.log("Error " + errors);
            res.send(errors);
        } else {
            console.log(req.body.course_name);
            var post = {
                course_name: req.body.course_name.replace(/\'|\#|\/\*/g, ""),
                teacher: req.body.teacher.replace(/\'|\#|\/\*/g, ""),
                semester: req.body.semester.replace(/\'|\#|\/\*/g, ""),
                catalog: req.body.catalog.replace(/\'|\#|\/\*/g, ""),
                comment: req.body.comment.replace(/\n/g, "<br>").replace(/\'|\#|\/\*/g, "").replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ""),
                report_hw: req.body.report_hw.replace(/\'|\#|\/\*/g, ""),
                course_style: req.body.course_style.replace(/\'|\#|\/\*/g, ""),
                user_id: userid
            }
            db.Insert('post', post, function(err, results) {
                if (err) throw err;
                console.log(results);
                var rate = {
                    sweet: parseInt(req.body.sweet.replace(/\'|\#|\/\*/g, "")),
                    hard: parseInt(req.body.hard.replace(/\'|\#|\/\*/g, "")),
                    recommand: parseInt(req.body.recommand.replace(/\'|\#|\/\*/g, "")),
                    give: parseInt(req.body.give.replace(/\'|\#|\/\*/g, "")),
                    got: parseInt(req.body.got.replace(/\'|\#|\/\*/g, "")),
                    course_name: req.body.course_name.replace(/\'|\#|\/\*/g, ""),
                    teacher: req.body.teacher.replace(/\'|\#|\/\*/g, ""),
                    user_id: userid,
                    post_id: results.insertId
                }
                db.Insert('course_rate', rate, function(err, results) {
                    if (err) throw err;
                    res.send("success");
                });
            });
        }
    }
});

/* new */
router.get('/new', function(req, res) {
    var sql = 'SELECT id,課程名稱,老師,系所名稱 FROM course_all WHERE semester ="104-2" OR semester ="105-1" OR semester ="105-2" OR semester ="106-1" GROUP BY 課程名稱,老師';
    db.Query(sql,function(course){
      res.render('post/new', {
        'course': course,
        'user': req.user
      });
    });
});

/* show */
router.get('/:id', function(req, res) {
    var id = req.params.id;
    if (id.match(/\D/g)) {
        console.log('\n' + 'GET /post/' + id);
        res.redirect('/');
    } else {
        console.log('\n' + 'GET /post/' + id);
        db.FindbyID('post', id, function(post) {
            db.FindbyColumn('course_rate', ['give', 'got'], { "post_id": post.id }, function(rate) {
                if (rate.length > 0) {
                    res.render('post/show', {
                        'post': post,
                        'user': req.user,
                        'rate': rate[0]
                    });
                } else {
                    res.render('post/show', {
                        'post': post,
                        'user': req.user,
                        'rate': null
                    });
                }
            });
        });
    }
});

/* update */
router.post('/update', function(req, res) {

});

/*report post */
router.post('/report/:id', function(req, res) {
    /* 要檢舉的文章id*/
    var postid = parseInt(req.params.id);
    console.log('\n' + 'POST /post/report/' + postid);
    /* 檢查用戶是否登入 */
    if (req.user !== undefined) {
        var name = req.user.name;
        var userid = parseInt(req.user.id);
        console.log('檢舉者：' + name)
            /* 檢查是否檢舉過 依照user_id及post_id去尋找 */
        db.FindbyColumn('report_post', ["id"], { 'post_id': postid, 'user_id': userid }, function(reports) {
            if (reports.length > 0) {
                console.log('Already report');
                res.send('Already report');
            } else {
                /* 區分檢舉原因 */
                var type = req.query.type;
                var reason = "";
                switch (type) {
                    case 'A':
                        reason = "不實內容";
                        break;
                    case 'B':
                        reason = "辱罵";
                        break;
                    default:
                        reason = "無";
                        break;
                }
                console.log("檢舉原因:" + reason);
                /* 新增檢舉紀錄 */
                var report_post = {
                    user_id: userid,
                    post_id: postid,
                    reason: reason
                }
                db.Insert('report_post', report_post, function(err, results) {
                    if (err) throw err;
                    console.log('Report post ' + postid + ' success');
                    /* 依照post_id將文章的檢舉次數+1 */
                    db.UpdatePlusone('post', 'report_count', postid, function(results) {
                        res.send('Success');
                    });
                });
            }
        });
    } else {
        console.log('Not login');
        res.send('Not Login');
    }
});

/* del */
router.delete('/:id', function(req, res) {
    var id = req.params.id;
    console.log('\n' + 'DELETE post/' + id);
    db.DeleteById('post', id, function(err) {
        res.send('Success');
    });
});

module.exports = router;
