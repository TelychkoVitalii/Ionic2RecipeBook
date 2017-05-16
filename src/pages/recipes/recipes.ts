import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController, NavParams, PopoverController } from 'ionic-angular';
import { NewRecipePage } from "../new-recipe/new-recipe";
import { Recipe } from "../../data/recipe";
import { RecipeService } from "../../services/recipeService";
import { RecipePage } from "../recipe/recipe";
import { DatabaseOptionsPage } from "../database-options/database-options";
import { ShoppingListService } from "../../services/shopping-list";
import { AuthService } from "../../services/auth";

@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html',
})
export class RecipesPage {
  recipes: Recipe[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private recipeService: RecipeService,
              private loadingCtrl: LoadingController,
              private popoverCtrl: PopoverController,
              private slSrvice: ShoppingListService,
              private authService: AuthService,
              private alertCtrl: AlertController) {}

  ionViewWillEnter() {
    this.recipes = this.recipeService.getRecipes();
  }

  onNewRecipe() {
    this.navCtrl.push(NewRecipePage, {mode: 'New'});
  }

  onLoadRecipe(recipe: Recipe, index: number) {
    this.navCtrl.push(RecipePage, {recipe: recipe, index: index});
  }

  onShowOptions(event: MouseEvent) {
    const loading = this.loadingCtrl.create({
      content: 'Please, wait...'
    });
    const popover = this.popoverCtrl.create(DatabaseOptionsPage);
    popover.present({ev: event});
    popover.onDidDismiss(
      data => {
        if(!data) {
          return;
        }
        if (data.action == 'load') {
          loading.present();
          this.authService.getActiveUser().getToken()
            .then(
              (token: string) => {
                this.recipeService.fetchList(token)
                  .subscribe(
                    (list: Recipe[]) => {
                      loading.dismiss();
                      if(list) {
                        this.recipes = list;
                      } else {
                        this.recipes = [];
                      }
                    },
                    error => {
                      loading.dismiss();
                      this.handleError(error.json().error);
                    }
                  )
              }
            );
        } else if (data.action == 'store') {
          loading.present();
          this.authService.getActiveUser().getToken()
            .then(
              (token: string) => {
                this.recipeService.storeList(token)
                  .subscribe(
                    () => loading.dismiss(),
                    error => {
                      loading.dismiss();
                      this.handleError(error.json().error);
                    }
                  )
              }
            )
        }
      })
  }

  private handleError(errorMessage: string) {
    const alert = this.alertCtrl.create({
      title: 'An error occured',
      message: errorMessage,
      buttons: ['Ok']
    });
    alert.present();
  }
}
