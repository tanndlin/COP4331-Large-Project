import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_functions/cloud_functions.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'firebase_options.dart';
import 'package:crypt/crypt.dart';


class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

 @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  FirebaseAuth user_auth = FirebaseAuth.instance;
  final _controllerEmail = TextEditingController();
  final _controllerPass = TextEditingController();
  final _controllerEmail_Reg = TextEditingController();
  final _controllerPass_Reg = TextEditingController();
  final _controllerPass_Confirm = TextEditingController();

  // register output to screen
  final formKey = GlobalKey<FormState>();

  bool error = false;
  String result = "";


  String email = "";
  String password = "";
  String login_verification = "";
  String reg_verification = "";

  @override
  void dispose() {
    _controllerEmail.dispose();
    _controllerPass.dispose();
    super.dispose();
  }
  //test123@gmail.com
  //123456
  // _register(String userEmail, String userPassword) async {
  //   String hashedPassword = Crypt.sha256(userPassword, salt: 'abcdefghijklmnop').toString();
  //   UserCredential userCredential = await FirebaseAuth.instance.createUserWithEmailAndPassword(
  //       email: userEmail,
  //       password: hashedPassword);
  //   print(hashedPassword);
  // }


  _register(String userEmail, String userPassword) async {
    try{
      UserCredential userCredential = await FirebaseAuth.instance.createUserWithEmailAndPassword(
          email: userEmail,
          password: userPassword);
      reg_verification = "Good";
    } on FirebaseAuthException catch (e) {
      if (e.code == 'email-already-in-use') {
        print('That email is taken!');
        reg_verification = "Email is already taken!";
        return 1;
      }
    }
    if (reg_verification == "Good") {

      return 0;
    }
  }

  _login(String email, String password) async {
    try{
      UserCredential userCredential = await FirebaseAuth.instance.signInWithEmailAndPassword(
          email: email,
          password: password);
      login_verification = "good";
    } on FirebaseAuthException catch (e) {
      if (e.code == 'user-not-found') {
        print('No user found with that email!');
        login_verification = "bad";
        return 1;


      } else if (e.code == 'wrong-password') {
        print('Incorrect password!');
        login_verification = "bad";
        return 2;


      }
    }
    if(login_verification == "good")
    {


      print('Good login');
      // Navigator.pushNamed(context, '/MainPage');
      Navigator.pushNamed(context, '/MainPageNav');
      return 0;
    }
  }




  @override
  Widget build(BuildContext context) {
    // final formKey = GlobalKey<FormState>();
    // final dialogKey = GlobalKey<Dialog>();

    void showToast() => Fluttertoast.showToast(
        msg: result, fontSize: 20, gravity: ToastGravity.BOTTOM, backgroundColor: error ? Color(0xFFFF0000).withOpacity(.8) : Colors.green.withOpacity(.8), textColor: Colors.white);

    showSignUpDialog(BuildContext context){
      showDialog(
          context: context,
          builder: (BuildContext dialogContext) {
              return Dialog(
                backgroundColor: const Color(0xFFFAFAFA),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20.0)),
                child: Container(
                  height: 400,
                  child: Padding(
                    padding: const EdgeInsets.only(left: 10.0, right: 10.0),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      // crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Sign Up', style: TextStyle(fontSize: 35,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF2D4B03)),),
                        const SizedBox(height: 10.0,),
                        Form(
                            key: formKey,
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: <Widget>[
                                Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: TextField(
                                    controller: _controllerEmail_Reg,
                                    decoration: InputDecoration(
                                        enabledBorder: OutlineInputBorder(
                                          borderSide: const BorderSide(width: 2,
                                              color: Color(0xFF2D4B03)),
                                          borderRadius: BorderRadius.circular(
                                              10.0),
                                        ),
                                        focusedBorder: OutlineInputBorder(
                                          borderSide: const BorderSide(width: 2,
                                              color: Color(0xFF000000)),
                                          borderRadius: BorderRadius.circular(
                                              10.0),
                                        ),
                                        prefixIcon: const Icon(
                                            Icons.email_rounded),
                                        labelText: 'Email',
                                        hintText: 'Enter Email'),
                                  ),
                                ),
                                Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: TextField(
                                    controller: _controllerPass_Reg,
                                    obscureText: true,
                                    decoration: InputDecoration(
                                        enabledBorder: OutlineInputBorder(
                                          borderSide: const BorderSide(width: 2,
                                              color: Color(0xFF2D4B03)),
                                          borderRadius: BorderRadius.circular(
                                              10.0),
                                        ),
                                        focusedBorder: OutlineInputBorder(
                                          borderSide: const BorderSide(width: 2,
                                              color: Color(0xFF000000)),
                                          borderRadius: BorderRadius.circular(
                                              10.0),
                                        ),
                                        prefixIcon: const Icon(Icons.lock),
                                        labelText: 'Password',
                                        hintText: 'Enter Password'),
                                  ),
                                ),
                                Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: TextField(
                                    controller: _controllerPass_Confirm,
                                    obscureText: true,
                                    decoration: InputDecoration(
                                        enabledBorder: OutlineInputBorder(
                                          borderSide: const BorderSide(width: 2,
                                              color: Color(0xFF2D4B03)),
                                          borderRadius: BorderRadius.circular(
                                              10.0),
                                        ),
                                        focusedBorder: OutlineInputBorder(
                                          borderSide: const BorderSide(width: 2,
                                              color: Color(0xFF000000)),
                                          borderRadius: BorderRadius.circular(
                                              10.0),
                                        ),
                                        prefixIcon: const Icon(Icons.lock),
                                        labelText: 'Confirm Password',
                                        hintText: 'Re-enter Password'),
                                  ),
                                ),
                              ],
                            )
                        ),
                        const SizedBox(height: 10.0,),
                        Container(
                          alignment: Alignment.center,
                          height: 50,
                          width: 320,
                          decoration: BoxDecoration(
                            color: const Color(0xFF020100),
                            border: Border.all(
                                width: 2, color: const Color(0xFF2D4B03)),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: TextButton(
                            style: ButtonStyle(
                              foregroundColor: MaterialStateProperty.all<Color>(
                                  Colors.black),
                            ),
                            onPressed: () {
                              // sign up btn
                              // this.result = "";
                              if (_controllerPass_Reg.text == _controllerPass_Confirm.text) {
                                setState(() {
                                  result = "";
                                  error = false;
                                });

                                Future<dynamic> n = _register(_controllerEmail_Reg.text, _controllerPass_Reg.text);
                                if (n == 0)
                                {
                                    setState(() {
                                      result = "Register Success!";
                                      error = false;
                                    });
                                }
                                else if (n == 1)
                                {
                                    setState(() {
                                      result = "Email is already taken!";
                                      error = true;
                                    });
                                }
                                // showError(1, context);
                              }
                              else {
                                setState(() {
                                  result = "Passwords do not match!";
                                  error = true;
                                });
                                // showError(2, context);
                                // SHOW ON SCREEN
                              }
                              showToast();

                            },
                            child: const Text(
                              'Sign Up',
                              style: TextStyle(fontSize: 20,
                                  color: Color(0xFFE3E9E7),
                                  fontWeight: FontWeight.bold),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            });
    }


    void showForgotPassword(BuildContext context){
      showDialog(
          context: context,
          builder: (BuildContext context) {
            return Dialog(
              backgroundColor: const Color(0xFFFAFAFA),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20.0)),
              child: Container(
                height: 200,
                child: Padding(
                  padding: const EdgeInsets.only(left: 10.0, right: 10.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    // crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Reset Password', style: TextStyle(fontSize: 25, fontWeight: FontWeight.bold, color: Color(0xFF2D4B03)),),
                      const SizedBox( height: 10.0,),
                      TextField(
                        decoration: InputDecoration(
                            enabledBorder: OutlineInputBorder(
                              borderSide: const BorderSide(width: 2, color: Color(0xFF2D4B03)),
                              borderRadius: BorderRadius.circular(10.0),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderSide: const BorderSide(width: 2, color: Color(0xFF000000)),
                              borderRadius: BorderRadius.circular(10.0),
                            ),
                            prefixIcon: const Icon(Icons.email_rounded),
                            labelText: 'Email',
                            hintText: 'Email'),
                      ),
                      const SizedBox( height: 10.0,),
                      Container(
                        alignment: Alignment.center,
                        height: 40,
                        width: 320,
                        decoration: BoxDecoration(
                          color: const Color(0xFF020100), border: Border.all(width: 2, color: const Color(0xFF2D4B03)), borderRadius: BorderRadius.circular(10),
                        ),
                        child: TextButton(
                          style: ButtonStyle(
                            foregroundColor: MaterialStateProperty.all<Color>(Colors.black),
                          ),
                          onPressed: () { // SEND PASSWORD RESET EMAIL !!!!!!!!!!!!!!!!!
                          },
                          child: const Text(
                            'Send Email',
                            style: TextStyle(fontSize: 20, color: Color(0xFFE3E9E7), fontWeight: FontWeight.bold),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          });
    }

    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          stops: [0.2, 0.7, 0.9],
          colors: [
            Color(0xFF479CE0),
            Color(0xFF9ECFA2),
            Color(0xFFE7E233),
          ],
        ),
      ),
      child: Scaffold(
        backgroundColor: Colors.transparent,
        appBar: AppBar(
          automaticallyImplyLeading: false,
          title: const Center(child: Text(
              'Budgie',
            style: TextStyle(fontSize: 35, color: Color(0xFF2D4B03), fontWeight: FontWeight.bold),
          )),
          flexibleSpace: Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                  colors: [
                    Color(0xFFb3e5fc),
                    Color(0xFFb3e5fc),
                  ],
                  begin: FractionalOffset(0.0, 0.0),
                  end: FractionalOffset(1.0, 0.0),
                  stops: [0.0, 1.0],
                  tileMode: TileMode.clamp),
            ),
          ),
        ),
        body: SingleChildScrollView(
          child: Column(
            children: <Widget>[
              Padding(
                padding: const EdgeInsets.only(top: 60.0, bottom: 30.0),
                child: Center(
                  child: SizedBox(
                      width: 200,
                      height: 150,
                      /*decoration: BoxDecoration(
                        color: Colors.red,
                        borderRadius: BorderRadius.circular(50.0)),*/
                      child: Image.asset('assets/images/budgie.png')),
                ),
              ),
              Padding(
                //padding: const EdgeInsets.only(left:15.0,right: 15.0,top:0,bottom: 0),
                padding: const EdgeInsets.symmetric(horizontal: 15),
                child: TextField(
                  controller: _controllerEmail,
                  decoration: InputDecoration(
                    focusColor: const Color(0xFF2D4B03),
                      enabledBorder: OutlineInputBorder(
                        borderSide: const BorderSide(width: 2, color: Color(0xFF2D4B03)),
                        borderRadius: BorderRadius.circular(50.0),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderSide: const BorderSide(width: 2, color: Color(0xFF000000)),
                        borderRadius: BorderRadius.circular(50.0),
                      ),
                      prefixIcon: const Icon(Icons.email_rounded),
                      labelText: 'Email',
                      hintText: 'Email'),
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(
                    left: 15.0, right: 15.0, top: 15, bottom: 10.0),
                //padding: EdgeInsets.symmetric(horizontal: 15),
                child: TextField(
                  controller: _controllerPass,
                  obscureText: true,
                  decoration: InputDecoration(
                      enabledBorder: OutlineInputBorder(
                        borderSide: const BorderSide(width: 2, color: Color(0xFF2D4B03)),
                        borderRadius: BorderRadius.circular(50.0),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderSide: const BorderSide(width: 2, color: Color(0xFF000000)),
                        borderRadius: BorderRadius.circular(50.0),
                      ),
                      prefixIcon: const Icon(Icons.lock),
                      labelText: 'Password',
                      hintText: 'Enter secure password'),
                ),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  const SizedBox(width: 240),
                  MaterialButton(
                    child: const Text('Forgot Password', style: TextStyle(fontSize: 18, color: Color(0xFF2D4B03), decoration: TextDecoration.underline)),
                    onPressed: (){
                        showForgotPassword(context);
                    },
                  ),
                ],
              ),
              const SizedBox(
                height: 30,
              ),
              Container(
                alignment: Alignment.center,
                height: 50,
                width: 180,
                decoration: BoxDecoration(
                  color: const Color(0xFF020100), border: Border.all(width: 2, color: const Color(0xFF2D4B03)), borderRadius: BorderRadius.circular(20),
                ),
                child: TextButton(
                  style: ButtonStyle(
                    foregroundColor: MaterialStateProperty.all<Color>(Colors.black),
                  ),
                  onPressed: () {
                    setState(() {
                      result = "";
                      error = false;
                    });

                    Future<dynamic> n = _login(_controllerEmail.text, _controllerPass.text);
                    print(n.toString());
                    if (n.toString() == "0"){
                      setState(() {
                        result = "Logging...";
                        error = false;
                      });
                    } else if (n == 1){
                      setState(() {
                        result = "Email does not exist!";
                        error = true;
                      });
                    } else if (n == 2){
                      setState(() {
                        result = "Incorrect password!";
                        error = true;
                      });
                    }
                    showToast();
                  },
                  child: const Text(
                      'Log in',
                    style: TextStyle(fontSize: 23, color: Color(0xFFE3E9E7), fontWeight: FontWeight.bold),
                  ),
                ),
              ),
              const SizedBox(
                height: 80,
              ),
              Column(
                // mainAxisAlignment: MainAxisAlignment,
                children: <Widget>[
                  const SizedBox(height: 20),
                  const Text('Don\'t have an account?', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF2D4B03))),
                  const SizedBox(height: 10),
                  Container(
                    alignment: Alignment.center,
                    height: 50,
                    width: 150,
                    decoration: BoxDecoration(
                      color: const Color(0xFF020100), border: Border.all(width: 2, color: const Color(0xFF2D4B03)), borderRadius: BorderRadius.circular(20),
                    ),
                    child: TextButton(
                      style: ButtonStyle(
                        foregroundColor: MaterialStateProperty.all<Color>(Colors.black),
                      ),
                      onPressed: () {
                        this.error = false;
                        this.result = "";
                        showSignUpDialog(context);
                      },
                      child: const Text(
                        'Sign Up',
                        style: TextStyle(fontSize: 20, color: Color(0xFFE3E9E7), fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}