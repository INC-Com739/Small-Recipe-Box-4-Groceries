import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [count, setCount] = useState(0)
  const [newRecipeName, setNewRecipeName] = useState("");
  const [newRecipeIngredients, setNewRecipeIngredients] = useState("");
  const [recipes, setRecipes] = useState([]);

  // input for recipe name
  const recipeName = "Recipe Name"; // Placeholder for recipe name input
  
  // view all recipes
  const viewRecipes = () => {
    // Logic to view all recipes
    console.log("Viewing all recipes...");
  }
  // delete a recipe
  const deleteRecipe = () => {
    // Logic to delete a recipe
    console.log("Deleting a recipe...");
  }
  // update a recipe
  const updateRecipe = () => {
    // Logic to update a recipe
    console.log("Updating a recipe...");
  }
  // search for a recipe
  const searchRecipe = () => {
    // Logic to search for a recipe
    console.log("Searching for a recipe...");
  }
  // add a recipe
  const handleAddRecipe = (e) => {
    e.preventDefault();
    const newRecipe = {
      name: newRecipeName,
      ingredients: newRecipeIngredients.split(',').map(ing => ing.trim()),
    };
    setRecipes([...recipes, newRecipe]);
    setNewRecipeName('');
    setNewRecipeIngredients('');
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <title>Recipe Book</title>
      <div className="card">
        <h1>Recipe Book</h1>
        <form onSubmit={handleAddRecipe} style={{marginBottom: '10px'}}>
          <input
            type="text"
            placeholder="Enter recipe name..."
            value={newRecipeName}
            onChange={e => setNewRecipeName(e.target.value)}
            style={{marginBottom: '5px', padding: '5px', width: '80%'}}
            required
          />
          <br />
          <textarea
            placeholder="Enter ingredients (comma separated)..."
            value={newRecipeIngredients}
            onChange={e => setNewRecipeIngredients(e.target.value)}
            style={{marginBottom: '5px', padding: '5px', width: '80%'}}
            required
          />
          <br />
          <button type="submit">Add Recipe</button>
        </form>
        {recipes.length > 0 && (
          <div style={{marginBottom: '10px', textAlign: 'left'}}>
            <h2>Recipes</h2>
            <ul>
              {recipes.map((recipe, idx) => (
                <li key={idx} style={{marginBottom: '8px'}}>
                  <strong>{recipe.name}</strong>: {recipe.ingredients.join(', ')}
                </li>
              ))}
            </ul>
          </div>
        )}
        <button onClick={viewRecipes}>View Recipes</button>
        <button onClick={deleteRecipe}>Delete Recipe</button>
        <button onClick={updateRecipe}>Update Recipe</button>
        <button onClick={searchRecipe}>Search Recipe</button>
        <p>
          Click on the buttons to manage your recipes.
        </p>
      </div>
    </>
  )
}

export default App
