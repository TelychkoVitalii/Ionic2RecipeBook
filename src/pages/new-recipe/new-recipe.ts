import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController, ToastController } from 'ionic-angular';
import { RecipeService } from "../../services/recipeService";
import { Recipe } from "../../data/recipe";
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'page-new-recipe',
  templateUrl: 'new-recipe.html',
})
export class NewRecipePage  implements OnInit {
  mode = 'New';
  recipeForm: FormGroup;
  difficulty = ['Easy', 'Middle', 'Hard'];
  recipe: Recipe;
  index: number;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public actionSheetCtrl: ActionSheetController,
              public alertCtrl: AlertController,
              private recipeService: RecipeService,
              private toastCtrl: ToastController ) {
    this.createForm();
  }

  ngOnInit() {
    this.mode = this.navParams.get('mode');
    if(this.mode == 'Edit') {
      this.recipe = this.navParams.get('recipe');
    }
    this.createForm();
  }

  addNewRecipe(recipe: Recipe) {
    const value = this.recipeForm.value;
    let ingredients = [];
    if(value.ingredients.length > 0) {
      ingredients = value.ingredients.map(name => {
        return {name: name, amount: 1};
      })
    }
    if(this.mode == 'Edit') {
      this.recipeService.updateRecipe(this.index, value.title, value.description, value.difficulty, ingredients)
    } else {
      this.recipeService.addRecipe(value.title, value.description, value.difficulty, ingredients);
    }
    this.recipeForm.reset();
    this.navCtrl.popToRoot();
  }

  createForm() {
    let title = null;
    let description = null;
    let difficulty = 'Medium';
    let ingredients = [];

    if(this.mode == 'Edit') {
      title = this.recipe.title;
      description = this.recipe.description;
      difficulty = this.recipe.difficulty;
      for(let ingredient of this.recipe.ingredient) {
        ingredients.push(new FormControl(ingredient.name, Validators.required));
      }
    }

    this.recipeForm = new FormGroup({
      'title': new FormControl(title, Validators.required),
      'description': new FormControl(description, Validators.required),
      'difficulty': new FormControl(difficulty, Validators.required),
      'ingredients': new FormArray(ingredients)
    })
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'What do you want to do?',
      buttons: [
        {
          text: 'Add Ingredient',
          handler: () => {
            this.presentPrompt().present();
          }
        },{
          text: 'Remove all Ingredients',
          role: 'destructive',
          handler: () => {
            const fArray: FormArray = <FormArray>this.recipeForm.get('ingredients');
            const len = fArray.length;
            if(len > 0) {
              for(let i = len - 1; i >=0; i--) {
                fArray.removeAt(i);
              }
              const toast = this.toastCtrl.create({
                message: 'All Ingredients were deleted!',
                duration: 1500,
                position: 'bottom'
              });
              toast.present();
            }
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  presentPrompt() {
    return this.alertCtrl.create({
      title: 'Add Ingredient',
      inputs: [
        {
          name: 'name',
          placeholder: 'Name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Add',
          handler: data => {
            console.log('Add');
            if (data.name.trim() == '' || data.name == null) {
              const toast = this.toastCtrl.create({
                message: 'Please enter a valid value',
                duration: 1500,
                position: 'bottom'
              });
              toast.present();
              return;
            } else {
              (<FormArray>this.recipeForm.get('ingredients')).push(new FormControl(data.name, Validators.required));
              const toast = this.toastCtrl.create({
                message: 'Item Added',
                duration: 1500,
                position: 'bottom'
              });
              toast.present();
            }
          }
        }
      ]
    });
  }
}


