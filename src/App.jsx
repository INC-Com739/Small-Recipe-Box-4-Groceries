import { useState, useEffect } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { scanRecipes, createRecipe, updateRecipe as updateRecipeDb, deleteRecipe as deleteRecipeDb } from './dynamo';

function App() {
  const [recipeName, setRecipeName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [message, setMessage] = useState(null);
  const [modal, setModal] = useState({ show: false, title: '', body: '', onConfirm: null });
  // Update a recipe in DynamoDB (update by clicking an Edit button next to each recipe)
  const [editIdx, setEditIdx] = useState(null);
  const [editName, setEditName] = useState("");
  const [editIngredients, setEditIngredients] = useState("");

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

  const searchRecipe = () => {
    setModal({
      show: true,
      title: 'Search Recipe',
      body: (
        <div>
          <input
            id="searchInput"
            className="form-control"
            placeholder="Enter recipe name..."
            autoFocus
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      ),
      onConfirm: async () => {
        const value = document.getElementById('searchInput').value;
        if (!value) return setModal({ show: false });
        const found = recipes.find(r => r.Cake.toLowerCase() === value.toLowerCase());
        setModal({
          show: true,
          title: 'Search Result',
          body: found ? (
            <div>
              <div><strong>{found.Cake}</strong></div>
              <div>Ingredients: {found.ingredients.join(', ')}</div>
            </div>
          ) : 'Recipe not found.',
          onConfirm: () => setModal({ show: false })
        });
      }
    });
  };

  const startEdit = (idx) => {
    setEditIdx(idx);
    setEditName(recipes[idx].Cake);
    setEditIngredients(recipes[idx].ingredients.join(", "));
  };

  const cancelEdit = () => {
    setEditIdx(null);
    setEditName("");
    setEditIngredients("");
  };

  const confirmEdit = async () => {
    const updated = {
      Cake: editName,
      ingredients: editIngredients.split(',').map(i => i.trim()),
    };
    await updateRecipeDb(updated);
    await loadRecipes();
    cancelEdit();
    setMessage("Recipe updated!");
    setTimeout(() => setMessage(null), 2000);
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
                  {editIdx === idx ? (
                    <span style={{width: '100%'}}>
                      <input
                        type="text"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="form-control mb-1"
                        style={{maxWidth: 200, display: 'inline-block'}}
                      />
                      <textarea
                        value={editIngredients}
                        onChange={e => setEditIngredients(e.target.value)}
                        className="form-control mb-1"
                        style={{maxWidth: 300, display: 'inline-block'}}
                      />
                      <button className="btn btn-success btn-sm me-1" onClick={confirmEdit}>Save</button>
                      <button className="btn btn-secondary btn-sm" onClick={cancelEdit}>Cancel</button>
                    </span>
                  ) : (
                    <>
                      <span><strong>{recipe.Cake}</strong>: {recipe.ingredients.join(', ')}</span>
                      <span>
                        <button className="btn btn-warning btn-sm me-1" onClick={() => startEdit(idx)}>Edit</button>
                        <button className="btn btn-success btn-sm" onClick={() => saveRecipe(recipe)}>Save</button>
                      </span>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        <button onClick={deleteRecipe} className="btn btn-danger me-2">Delete Recipe</button>
        <button onClick={searchRecipe} className="btn btn-info">Search Recipe</button>
        {message && <div style={{color: 'green', marginTop: '10px'}}>{message}</div>}
        <p className="mt-3">
          Click on the buttons to manage your recipes.
        </p>
      </div>
      {modal.show && (
        <div className="modal show d-block" tabIndex="-1" style={{background: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modal.title}</h5>
                <button type="button" className="btn-close" onClick={() => setModal({ show: false })}></button>
              </div>
              <div className="modal-body">
                {typeof modal.body === 'string' ? <pre>{modal.body}</pre> : modal.body}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={modal.onConfirm}>OK</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App
