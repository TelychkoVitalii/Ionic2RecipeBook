import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { TabsPage } from "../pages/tabs/tabs";
import { RecipesPage } from "../pages/recipes/recipes";
import { RecipePage } from "../pages/recipe/recipe";
import { ShoppingListPage } from "../pages/shopping-list/shopping-list";
import { NewRecipePage } from "../pages/new-recipe/new-recipe";
import { RecipeService } from "../services/recipeService";
import { ShoppingListService } from "../services/shopping-list";
import { SigninPage } from "../pages/signin/signin";
import { SignupPage } from "../pages/signup/signup";
import { AuthService } from "../services/auth";
import { DatabaseOptionsPage } from "../pages/database-options/database-options";
import { HttpModule } from "@angular/http";

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    RecipesPage,
    RecipePage,
    ShoppingListPage,
    NewRecipePage,
    SigninPage,
    SignupPage,
    DatabaseOptionsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    RecipesPage,
    RecipePage,
    ShoppingListPage,
    NewRecipePage,
    SigninPage,
    SignupPage,
    DatabaseOptionsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RecipeService,
    ShoppingListService,
    AuthService
  ]
})

export class AppModule {}
