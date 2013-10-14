//       var email = req.body.name.trim();
// console.log(req.body);
//       var emailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
//       if(!emailReg.test(email))res.json({code:1,data:'邮箱格式不对'});
//       else
//       {
//           var headers = req.headers;
//           req.ip = headers['x-real-ip'] || headers['x-forwarded-for']||req.ip;

//           var d = {}; var name = email.split('@');
//           d.email = email;
//           d.name = name[0];
//           D('Member').model().findOne({email:d.email},function(err,data){

//               if(!data)
//               {
//                   d.regip = req.ip;
//                   d.logip = req.ip;
// 			//d.name += C.now;
//                   D('Member').insert(d, function (err, id) {
//                       var key = {name:d.name,email:d.email,uid:id};
//                       key = JSON.stringify(key);
//                       key = _S.encode.e(key);
//                       res.cookie('user',key,{ maxAge: C.maxAge ,path: '/',signed: true});
//                       //res.cookie('user',{name:d.name,email:d.email,uid:id},{ maxAge: C.maxAge ,path: '/',signed: true});
//                       res.json({code:0,data:"注册成功，进行登录......"});
//                   });
//               }
//               else
//               {
//                   d.logip = req.ip;
//                   // console.log(d);
//                  D('Member').update({email: d.email},d, function (err, row) {
//                       var key = {name:data.name,email:data.email,uid:data.id,status:data.status};
//                       key = JSON.stringify(key);
//                       key = _S.encode.e(key);
//                       res.cookie('user',key,{ maxAge: C.maxAge ,path: '/',signed: true});
//                       //res.cookie('user',{name:data.name,email:data.email,uid:data.id},{ maxAge: C.maxAge ,path: '/',signed: true});
//                       res.json({code:0,data:"匹配成功，进行登录......",user:data});
//                   });
//               }
//           })


//       }