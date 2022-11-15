import 'package:flutter/material.dart';
import 'package:mobile/screens/LoginPage.dart';
import 'package:mobile/screens/BillPage.dart';
import 'package:mobile/screens/Budget.dart';
import 'package:mobile/screens/AccountManager.dart';
import 'package:mobile/screens/CalendarView.dart';
import 'package:mobile/screens/MainPage.dart';

class Routes {
  static const String LOGINPAGE = '/LoginPage';
  static const String BILLPAGE = '/BillPage';
  static const String MAINPAGE = '/MainPage';
  static const String BUDGET = '/Budget';
  static const String ACCOUNTMANAGER = '/AccountManager';
  static const String CALENDARVIEW = '/CalendarView';
  
  // routes of pages in the app
  static Map<String, Widget Function(BuildContext)> get getroutes => {
    '/': (context) => const MainPage(),
    // '/': (context) => const LoginPage(),
    LOGINPAGE: (context) => const LoginPage(),
    BILLPAGE: (context) => const BillPage(),
    MAINPAGE: (context) => const MainPage(),
    BUDGET: (context) => const Budget(),
    ACCOUNTMANAGER: (context) => const AccountManager(),
    CALENDARVIEW: (context) => const CalendarView(),
  };
}