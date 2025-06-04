import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { scanRecipes, createRecipe, updateRecipe as updateRecipeDb, deleteRecipe as deleteRecipeDb } from './dynamo';

function App() {
  const [Cake, setCake] = useState("");
  const [newRecipeIngredients, setNewRecipeIngredients] = useState("");
  const [recipes, setRecipes] = useState([]);
  // Test AWS connection
  const [awsTestResult, setAwsTestResult] = useState(null);

  // Load recipes from DynamoDB
  const loadRecipes = async () => {
    const data = await scanRecipes();
    setRecipes(data);
  };

  // Add a recipe to DynamoDB
  const handleAddRecipe = async (e) => {
    e.preventDefault();
    const newRecipe = {
      Cake: Cake, // Use 'Cake' as the partition key, matching your table schema
      ingredients: newRecipeIngredients.split(',').map(ing => ing.trim()),
    };
    await createRecipe(newRecipe);
    setCake('');
    setNewRecipeIngredients('');
    loadRecipes();
  };

  // Delete a recipe from DynamoDB (delete first recipe for demo)
  const deleteRecipe = async () => {
    if (recipes.length === 0) return;
    await deleteRecipeDb(recipes[0].Cake); // Use 'Cake' as the key
    loadRecipes();
  };

  // Update a recipe in DynamoDB (update first recipe for demo)
  const updateRecipe = async () => {
    if (recipes.length === 0) return;
    const updated = { ...recipes[0], Cake: recipes[0].Cake + ' (Updated)' };
    await updateRecipeDb(updated);
    loadRecipes();
  };

  // View all recipes (reload from DB)
  const viewRecipes = () => {
    loadRecipes();
  };


  // search for a recipe by Cake name
  const searchRecipe = () => {
    const searchTerm = prompt('Enter the recipe name to search for:');
    if (!searchTerm) return;
    const found = recipes.find(r => r.Cake.toLowerCase() === searchTerm.toLowerCase());
    if (found) {
      alert(`Found: ${found.Cake}\nIngredients: ${found.ingredients.join(', ')}`);
    } else {
      alert('Recipe not found.');
    }
  };

  // Load recipes on mount
  useEffect(() => {
    loadRecipes();
  }, []);

  return (
    <>
      <title>Recipe Book</title>
      <div className="card">
        <h1>Recipe Book</h1>
        <form onSubmit={handleAddRecipe} style={{marginBottom: '10px', textAlign: 'center', padding: '10px', borderRadius: '5px'}}>
          <input
            type="text"
            placeholder="Enter recipe name..."
            value={Cake}
            onChange={e => setCake(e.target.value)}
            style={{marginBottom: '5px', padding: '5px', width: '80%'}}
            required/>
          <br/>
          <textarea
            placeholder="Enter ingredients (comma separated)..."
            value={newRecipeIngredients}
            onChange={e => setNewRecipeIngredients(e.target.value)}
            style={{marginBottom: '5px', padding: '5px', width: '80%', height: '60px'}}
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
                  <strong>{recipe.Cake}</strong>: {recipe.ingredients.join(', ')}
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
