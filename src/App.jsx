import { useState, useEffect } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { scanRecipes, createRecipe, updateRecipe as updateRecipeDb, deleteRecipe as deleteRecipeDb } from './dynamo';

function App() {
  const [recipeName, setRecipeName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [message, setMessage] = useState(null);

  // Load recipes from DynamoDB
  const loadRecipes = async () => setRecipes(await scanRecipes());

  // Add or save a recipe
  const saveRecipe = async (recipe) => {
    await createRecipe(recipe || {
      Cake: recipeName,
      ingredients: ingredients.split(',').map(i => i.trim()),
    });
    setRecipeName("");
    setIngredients("");
    setMessage("Recipe saved!");
    await loadRecipes();
    setTimeout(() => setMessage(null), 2000);
  };

  // Delete first recipe (for demo)
  const deleteRecipe = async () => {
    if (!recipes.length) return;
    await deleteRecipeDb(recipes[0].Cake);
    await loadRecipes();
  };

  // Update first recipe (for demo)
  const updateRecipe = async () => {
    if (!recipes.length) return;
    const updated = { ...recipes[0], Cake: recipes[0].Cake + ' (Updated)' };
    await updateRecipeDb(updated);
    await loadRecipes();
  };

  // Search for a recipe
  const searchRecipe = async () => {
    const searchTerm = prompt('Enter the recipe name to search for:');
    if (!searchTerm) return;
    await loadRecipes();
    const found = recipes.find(r => r.Cake.toLowerCase() === searchTerm.toLowerCase());
    alert(found ? `Found: ${found.Cake}\nIngredients: ${found.ingredients.join(', ')}` : 'Recipe not found.');
  };

  useEffect(() => { loadRecipes(); }, []);

  return (
    <>
      <title>Recipe Book</title>
      <div className="card">
        <h1>Recipe Book</h1>
        <form onSubmit={e => { e.preventDefault(); saveRecipe(); }} className="mb-3 text-center p-2 rounded">
          <input
            type="text"
            placeholder="Enter recipe name..."
            value={recipeName}
            onChange={e => setRecipeName(e.target.value)}
            className="form-control mb-2"
            required
          />
          <textarea
            placeholder="Enter ingredients (comma separated)..."
            value={ingredients}
            onChange={e => setIngredients(e.target.value)}
            className="form-control mb-2"
            required
          />
          <button type="submit" className="btn btn-primary">Add Recipe</button>
        </form>
        {recipes.length > 0 && (
          <div className="mb-3 text-left">
            <h2>Recipes</h2>
            <ul className="list-group">
              {recipes.map((recipe, idx) => (
                <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                  <span><strong>{recipe.Cake}</strong>: {recipe.ingredients.join(', ')}</span>
                  <button className="btn btn-success btn-sm" onClick={() => saveRecipe(recipe)}>Save</button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button onClick={deleteRecipe} className="btn btn-danger me-2">Delete Recipe</button>
        <button onClick={updateRecipe} className="btn btn-warning me-2">Update Recipe</button>
        <button onClick={searchRecipe} className="btn btn-info">Search Recipe</button>
        {message && <div style={{color: 'green', marginTop: '10px'}}>{message}</div>}
        <p className="mt-3">
          Click on the buttons to manage your recipes.
        </p>
      </div>
    </>
  );
}

export default App
