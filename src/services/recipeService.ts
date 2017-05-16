import { Recipe } from "../data/recipe";
import { Ingredient } from "../data/ingredient";
import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { AuthService } from "./auth";
import 'rxjs/Rx';

@Injectable()
export class RecipeService {
  recipes: Recipe[] = [];

  constructor(private http: Http, private authService: AuthService) {}
  getRecipes() {
    return this.recipes.slice();
  }

  addRecipe(title: string, description: string, difficulty: string, ingredients: Ingredient[]) {
    this.recipes.push(new Recipe(title, description, difficulty, ingredients));
    console.log(this.recipes);
  }

  updateRecipe(index: number, title: string, description: string, difficulty: string, ingredients: Ingredient[]) {
    this.recipes[index] = new Recipe(title, description, difficulty, ingredients);
  }

  removeRecipe(index: number) {
    this.recipes.splice(index, 1);
  }

  storeList(token: string) {
    const userId = this.authService.getActiveUser().uid;
    return this.http.put('https://ionic2recipebook-e6859.firebaseio.com/' + userId + '/recipes.json?auth=' + token, this.recipes)
      .map((response: Response) => {
        return response.json();
      });
  }

  fetchList(token: string) {
    const userId = this.authService.getActiveUser().uid;
    return this.http.get('https://ionic2recipebook-e6859.firebaseio.com/' + userId + '/recipes.json?auth=' + token, this.recipes)
      .map((response: Response) => {
        const recipes: Recipe[] = response.json() ? response.json(): [];
        for(let item of recipes) {
          if(!item.hasOwnProperty('ingredients')) {
            item.ingredient = [];
          }
        }
        return recipes;
      })
      .do((recipes: Recipe[]) => {
        if(recipes) {
          this.recipes = recipes;
        } else {
          this.recipes = [];
        }
      })
  }
}
