import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import {CATEGORIES, DIET_TYPES} from '../constants';

function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipeData, setRecipeData] = useState({
    title: '',
    description: '',
    ingredients: '',
    instructions: '',
    category: '',
    diet_type: '',
  });

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await api.get(`/api/recipes/${id}/`);
        setRecipeData(response.data);
      } catch (error) {
        console.error('Error fetching recipe for edit:', error);
        navigate('/');
      }
    }
    fetchRecipe();
  }, [id, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipeData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/api/recipes/${id}/`, recipeData);

      navigate(`/recipes/${id}`);
    } catch (error) {
      console.error('Error updating recipe:', error);
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Edit Recipe
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Title"
            value={recipeData.title}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Category Dropdown */}
          <div className="flex-1">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select id="category" name="category" value={recipeData.category} onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
              {CATEGORIES.map(cat => (
                <option key={cat.code} value={cat.code}>{cat.name}</option>
              ))}
            </select>
          </div>
          {/* Diet Type Dropdown */}
          <div className="flex-1">
            <label htmlFor="dietType" className="block text-sm font-medium text-gray-700">Diet Type</label>
            <select id="dietType" name="diet_type" value={recipeData.diet_type} onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
              {DIET_TYPES.map(diet => (
                <option key={diet.code} value={diet.code}>{diet.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Description"
            value={recipeData.description}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="ingredients"
            className="block text-sm font-medium text-gray-700"
          >
            Ingredients
          </label>
          <textarea
            id="ingredients"
            name="ingredients"
            placeholder="Ingredients"
            value={recipeData.ingredients}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="instructions"
            className="block text-sm font-medium text-gray-700"
          >
            Instructions
          </label>
          <textarea
            id="instructions"
            name="instructions"
            placeholder="Instructions"
            value={recipeData.instructions}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Save Recipe</button>
      </form>
    </div>
  );
}

export default EditRecipe;
